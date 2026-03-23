async function generateAnswer(query, context) {
try {
        // ✅ Guardrail: if no context, return safe response
        if (!context || context.trim().length === 0) {
            return "I don't know based on the provided documents.";
        }

        // ✅ Clean response
        const answer = `
Answer based on company documents:

${context.substring(0, 1000)}
        `;

        return answer;

    } catch (error) {
        console.error("Answer generation error:", error.message);
        return "Error generating answer";
    }
}

module.exports = generateAnswer;



/*const { pipeline } = require("@xenova/transformers");

// Local LLM generator
let generator;

async function generateAnswer(query, contextWithCitations) {
    try {
        // ✅ Initialize local LLM once
        if (!generator) {
            generator = await pipeline("text-generation", "Xenova/gpt2");
        }

        // Guardrail: No context → refuse to answer
        if (!contextWithCitations || contextWithCitations.trim().length === 0) {
            return "I don't know based on available documents.";
        }

        // Build prompt with retrieved context
        const prompt = `
You are an AI assistant. Answer the question based only on the given context.
If the answer is not in the context, respond: "I don't know".
Always include the source filename and page number for each point you mention.

Context:
${contextWithCitations}

Question:
${query}

Answer:
`;

        // Generate locally
        const result = await generator(prompt, { max_new_tokens: 200, temperature: 0.3 });

        let text = "";
        if (Array.isArray(result) && result.length > 0) {
            text = result.map(r => r.generated_text).join("\n");
        }

        // Clean output: trim, replace multiple newlines
        text = text.replace(/\n{2,}/g, "\n").trim();

        return text;

    } catch (error) {
        console.error("Local LLM error:", error);
        return "Error generating answer";
    }
}

module.exports = generateAnswer;*/

/*const { pipeline } = require("@xenova/transformers");

let generator;

async function generateAnswer(query, contextWithCitations) {
    try {
        // ✅ Load Flan-T5 model (only once)
        if (!generator) {
            generator = await pipeline(
                "text2text-generation",
                "Xenova/flan-t5-base"
            );
            console.log("Flan-T5 model loaded");
        }

        // ✅ Guardrail
        if (!contextWithCitations || contextWithCitations.trim().length === 0) {
            return "I don't know based on available documents.";
        }

        // ✅ Clean prompt (Flan-T5 understands instructions well)
        const prompt = `
You are an AI assistant.

Your task is to answer the question using ONLY the given context.

IMPORTANT RULES:
- Do NOT copy the context directly
- Combine information from all points
- Give a COMPLETE and structured answer
- If multiple items exist (like types), list them clearly
- Always include source and page number




Context:
${contextWithCitations}

Question: ${query}

Answer:
`;

        // ✅ Generate answer
        const result = await generator(prompt, {
            max_new_tokens: 700,
            temperature: 0.3,
        });

        // ✅ Extract clean output
        let text = result[0]?.generated_text || "";

        text = text.replace(/^Answer:\s*//*i, "");// 2 comment remove it when reusing
        // Clean formatting
        text = text.replace(/\n{2,}/g, "\n").trim();

        return text;

    } catch (error) {
        console.error("Local LLM error:", error);
        return "Error generating answer";
    }
}

module.exports = generateAnswer;*/

