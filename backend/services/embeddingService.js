const { pipeline } = require("@xenova/transformers");

let extractor;

async function generateEmbedding(text) {

    if (!extractor) {
        extractor = await pipeline(
            "feature-extraction",
            "Xenova/all-MiniLM-L6-v2"
        );
    }

    const result = await extractor(text);

    const embedding = Array.from(result.data);

    return embedding;
}

module.exports = generateEmbedding;