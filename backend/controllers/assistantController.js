const openai = require("../config/openai");

const chatWithAssistant = async (req, res) => {
    try {
        const question = (req.body.question || "").trim();

        if (!question) {
            return res.status(400).json({
                success: false,
                message: "Please enter a question."
            });
        }

        const response = await openai.responses.create({
            model: "gpt-4.1-mini",
            input: [
                {
                    role: "system",
                    content:
                        "You are Campus AI, a helpful assistant for a student campus platform. Answer questions clearly and concisely. You can help students with studying, notes, study groups, sessions, programming, and general academic questions."
                },
                {
                    role: "user",
                    content: question
                }
            ]
        });

        return res.json({
            success: true,
            type: "ai",
            reply: response.output_text
        });

    } catch (err) {
    console.error("OPENAI ERROR:", err);
    console.error("STATUS:", err.status);
    console.error("MESSAGE:", err.message);

    return res.status(500).json({
        success: false,
        message: err.message || "AI Assistant failed."
    });
}
};

module.exports = {
    chatWithAssistant
};