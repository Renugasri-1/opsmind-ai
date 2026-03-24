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



