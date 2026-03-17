const Chunk = require("../models/chunkmodel");


async function retrieveRelevantChunks(queryEmbedding, topK = 3) {
    
    if (
        !queryEmbedding ||
        queryEmbedding.length !== 384 ||
        queryEmbedding.some(val => !isFinite(val))
    ) {
        throw new Error("Invalid query embedding in retrieval");
    }
    
    const results = await Chunk.aggregate([
        {
            $vectorSearch: {
                index: "vector_index", // your index name
                path: "embedding",
                queryVector: queryEmbedding,
                numCandidates: 100,
                limit: topK
            }
        },
        {
            $project: {
                text: 1,
                source: 1,
                page: 1,
                score: { $meta: "vectorSearchScore" }
            }
        }
    ]);

    return results;
}

module.exports = retrieveRelevantChunks;