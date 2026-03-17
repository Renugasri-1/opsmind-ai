const fs = require("fs");
const chunkText = require("../services/chunkService");
const createEmbedding = require("../services/embeddingService");
const Chunk = require("../models/chunkmodel");

async function parsePDF(filePath) {

    try {

        console.log("Reading PDF:", filePath);

        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

        const data = new Uint8Array(fs.readFileSync(filePath));

        const pdf = await pdfjsLib.getDocument({ data }).promise;

        let text = "";

        for (let i = 1; i <= pdf.numPages; i++) {

            const page = await pdf.getPage(i);
            const content = await page.getTextContent();

            const pageText = content.items.map(item => item.str).join(" ");

            text += pageText + "\n";

        }

        console.log("Extracted text length:", text.length);
        
        // STEP 1: Split text into chunks
        const chunks = chunkText(text);

        console.log("Total chunks:", chunks.length);

        // STEP 2: Generate embeddings and save to MongoDB
        for (let i = 0; i < chunks.length; i++) {

            const chunk = chunks[i];

            const embedding = await createEmbedding(chunk);

            const newChunk = new Chunk({
                text: chunk,
                embedding: embedding,
                source: filePath,
                page: i
            });

            await newChunk.save();

        }

        console.log("Chunks stored in database successfully");

        return text;

    } catch (error) {

        console.error("PDF parsing error:", error);
        throw error;

    }

}

module.exports = parsePDF;