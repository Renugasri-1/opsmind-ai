const express = require("express");
const router = express.Router();
const retrieveRelevantChunks = require("../services/retrievalService");
const getQueryEmbedding = require("../services/queryEmbeddingService");


router.post("/", async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ error: "Query is required" });
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

        const topChunks = await retrieveRelevantChunks(queryEmbedding);
        const context = topChunks.map((c, i) => 
    `Point ${i + 1}: ${c.text}`
).join("\n\n");
        

        res.json({
            answer: context,
            chunks: topChunks
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve chunks" });
    }
});

module.exports = router;