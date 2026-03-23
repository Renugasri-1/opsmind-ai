const express = require("express");
const router = express.Router();
const retrieveRelevantChunks = require("../services/retrievalService");
const getQueryEmbedding = require("../services/queryEmbeddingService");
const generateAnswer = require("../services/answerService");
const Chat = require("../models/Chat");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
    try {
        const body = req.body || {};
        const query = body.query;
        const userId = req.userId;

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

/*topChunks = topChunks.filter(c => c.score > 0.5);*/

// ✅ Take top 3 (not 2, safer)
/*topChunks = topChunks.slice(0, 3);
        if (!topChunks || topChunks.length === 0) {
            return res.json({
                answer: "I don't know based on available documents.",
                chunks: []
            });
        } */
       // get best score
const maxScore = topChunks[0]?.score || 0;

// 🧠 DECISION LOGIC
if (maxScore < 0.60) {
    // ❌ completely unrelated
    return res.json({
        answer: "I don't know based on the provided documents.",
        chunks: []
    });
}

/*if (maxScore >= 0.60 && maxScore < 0.75) {
    // ⚠️ weak match → give safe answer
    return res.json({
        answer: "I'm not fully confident based on the documents. Please refine your question.",
        chunks: topChunks
    });
}*/
        // step4
        const contextWithCitations = topChunks
    .map(c => c.text.trim())
    .join("\n\n");

// generate safe answer
let answer = await generateAnswer(query, contextWithCitations);

//ensure guardrail
if (!answer || answer.trim().length === 0) {
            answer = "I don't know based on available documents.";
        }
        

        // Save chat
await Chat.create({
    userId: req.userId, 
    query,
    answer,
    chunks: topChunks
});

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