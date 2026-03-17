const { pipeline } = require("@xenova/transformers");

let extractor;

async function generateEmbedding(text) {

    if (!extractor) {
        extractor = await pipeline(
            "feature-extraction",
            "Xenova/all-MiniLM-L6-v2"
        );
    }

    // ✅ handle empty input
    if (!text || text.trim().length === 0) {
        return new Array(384).fill(0);
    }

    const result = await extractor(text);

    const embeddings = result.data;

    if (!embeddings || embeddings.length === 0) {
        return new Array(384).fill(0);
    }

    const dim = 384;
let pooled = new Array(dim).fill(0);

// result.data is flat array
for (let i = 0; i < embeddings.length; i++) {
    const val = embeddings[i];

    if (typeof val !== "number" || !isFinite(val)) continue;

    pooled[i % dim] += val;
}

// normalize
pooled = pooled.map(val => val / (embeddings.length / dim || 1));


    // ✅ FINAL SAFETY (MOST IMPORTANT)
    pooled = pooled.map(val => {
        if (!isFinite(val) || isNaN(val)) {
            return 0;
        }
        return val;
    });

    return pooled;
}

module.exports = generateEmbedding;