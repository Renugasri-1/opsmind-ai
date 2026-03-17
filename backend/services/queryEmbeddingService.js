const generateEmbedding = require("./embeddingService");

async function getQueryEmbedding(query) {
    const embedding = await generateEmbedding(query);
    return embedding;
}

module.exports = getQueryEmbedding;