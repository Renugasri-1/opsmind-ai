const express = require("express");
const router = express.Router();
const retrieveRelevantChunks = require("../services/retrievalService");
const getQueryEmbedding = require("../services/queryEmbeddingService");
const generateAnswer = require("../services/answerService");

router.post("/", async (req, res) => {
    try {
        const body = req.body || {};
        const query = body.query;

        if (!query || typeof query !== "string" || query.trim().length === 0) {
            return res.status(400).json({ error: "Query is required and must be a string." });
        }
        // ✅ STEP 1: Generate query embedding
        const queryEmbedding = await getQueryEmbedding(query);

        // ✅ STEP 2: Validate embedding 
        if (
            !queryEmbedding ||
            queryEmbedding.length !== 384 ||
            queryEmbedding.some(val => !isFinite(val))
        ) {
            return res.status(500).json({
                error: "Invalid query embedding"
            });
        }
       //step3:Retrieve top chunks
        let topChunks = await retrieveRelevantChunks(queryEmbedding);
        
// ✅ Sort by score (highest first)
topChunks = topChunks.sort((a, b) => b.score - a.score);

// ✅ Take top 3 (not 2, safer)
topChunks = topChunks.slice(0, 3);
        if (!topChunks || topChunks.length === 0) {
            return res.json({
                answer: "I don't know based on available documents.",
                chunks: []
            });
        }
        //step 4:prepare context with citations for ai
        const contextWithCitations = topChunks
            .map((c, i) => `Point ${i + 1} (Source: ${c.source}, Page: ${c.page}): ${c.text}`)
            .join("\n\n");

// generate safe answer
let answer = await generateAnswer(query, contextWithCitations);

//ensure guardrail
if (!answer || answer.trim().length === 0) {
            answer = "I don't know based on available documents.";
        }

// ✅ Send final response
res.json({
    answer,        
    chunks: topChunks 
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve chunks" });
    }
});

module.exports = router;