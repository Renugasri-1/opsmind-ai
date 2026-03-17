const mongoose = require("mongoose");

const chunkSchema = new mongoose.Schema({
    text: String,
    embedding: [Number],
    source: String,
    page: Number
});

module.exports = mongoose.model("Chunk", chunkSchema);