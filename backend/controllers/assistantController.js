const ai = require("../config/gemini");

const {
    normalize,
    cleanKeyword,
    getNextSession,
    getTodaySessions,
    searchNotes,
    searchGroups,
    searchSessions
} = require("../services/assistantService");

const chatWithAssistant = async (req, res) => {
    try {
        const question = (req.body.question || "").trim();

        if (!question) {
            return res.status(400).json({
                success: false,
                message: "Please enter a question."
            });
        }

        const q = normalize(question);

        let campusData = {
            notes: [],
            groups: [],
            sessions: []
        };

        // Sessions
        if (
            /(next|upcoming|nearest|future)/i.test(q) &&
            /(session|meeting|class)/i.test(q)
        ) {
            const session = await getNextSession();

            if (session) {
                campusData.sessions = [session];
            }
        }

        // Today's sessions
        else if (
            /today/i.test(q) &&
            /(session|meeting|class|schedule)/i.test(q)
        ) {
            campusData.sessions = await getTodaySessions();
        }

        // Notes
        else if (/(note|notes|summary)/i.test(q)) {
            const keyword = cleanKeyword(question);
            campusData.notes = await searchNotes(keyword);
        }

        // Groups
        else if (/(group|groups|recommend|join|subject)/i.test(q)) {
            const keyword = cleanKeyword(question);
            campusData.groups = await searchGroups(keyword);
        }

        // Sessions
        else if (
            /(session|sessions|meeting|schedule|class)/i.test(q)
        ) {
            const keyword = cleanKeyword(question);

            if (keyword) {
                campusData.sessions = await searchSessions(keyword);
            } else {
                campusData.sessions = await getTodaySessions();
            }
        }

        const prompt = `
You are Campus AI inside Campus Connect Hub.

Help students with:
- Notes
- Study Groups
- Study Sessions
- Programming
- Data Structures
- Academic Questions
- General studying

IMPORTANT RULES:

1. Answer the student's question directly.
2. Give a clear and useful explanation.
3. Use simple plain text only.
4. Do NOT use Markdown formatting.
5. Do NOT use #, ##, ###, *, **, backticks, or other Markdown symbols.
6. Use simple numbered lists when you need to organize information.
7. For programming questions, provide examples in code blocks.
8. For academic questions, explain step-by-step.
9. Do NOT mention Campus Connect data unless the student's question is specifically asking about notes, groups, or sessions.
10. Do NOT say "no matching campus data was found" for general academic or programming questions.
11. Do NOT use LaTeX syntax such as $...$.
12. Use normal text symbols instead of LaTeX.
13. Keep the response concise.

Student Question:
${question}

Campus Connect Data:
${JSON.stringify(campusData, null, 2)}
`;

        let response;

try {
    response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
    });
} catch (error) {
    console.log("Gemini 3.5 Flash failed. Trying fallback model...");

    response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt
    });
}
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
            message: "Campus AI is temporarily unavailable. Please try again."
        });
    }
};

module.exports = {
    chatWithAssistant
};