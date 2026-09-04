const ai = require("../config/gemini");

const chatWithAssistant = async (req, res) => {
    try {
        const question = (req.body.question || "").trim();

        if (!question) {
            return res.status(400).json({
                success: false,
                message: "Please enter a question."
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.7-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `You are Campus AI, a helpful assistant for a student campus platform.

Help students with:
- Studying
- Notes
- Study groups
- Study sessions
- Programming
- Data structures
- Academic questions

Answer clearly, accurately, and concisely.

Student question:
${question}`
                        }
                    ]
                }
            ]
        });

        return res.json({
            success: true,
            type: "ai",
            reply: response.text
        });

    } catch (err) {
        console.error("GEMINI ERROR:", err);
        console.error("STATUS:", err.status);
        console.error("MESSAGE:", err.message);

        return res.status(500).json({
            success: false,
            message: err.message || "AI Assistant failed."
        });
    }
};

module.exports = { chatWithAssistant };