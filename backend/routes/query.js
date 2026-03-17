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

        // ✅ STEP 2: Validate embedding (VERY IMPORTANT)
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
        const topChunks = await retrieveRelevantChunks(queryEmbedding);
        const context = topChunks.map(c => c.text).join("\n");

// generate safe answer
const answer = await generateAnswer(query, context);

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