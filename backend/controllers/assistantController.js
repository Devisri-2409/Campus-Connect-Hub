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

Rules:
1. Answer directly.
2. Keep answers clear and easy to understand.
3. Use headings and bullet points when useful.
4. Do not invent campus information.
5. Use the provided campus data when relevant.
6. If campus data is empty, say that no matching information was found.
7. For programming questions, give simple examples when useful.
8. For academic questions, explain step-by-step.
9. Keep the response concise.

Student Question:
${question}

Campus Connect Data:
${JSON.stringify(campusData, null, 2)}
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt
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
            message: "Campus AI is temporarily unavailable. Please try again."
        });
    }
};

module.exports = {
    chatWithAssistant
};