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

        // --------------------------------
        // 1. NEXT / UPCOMING SESSION
        // --------------------------------
        if (
            /(next|upcoming|nearest|future)/i.test(q) &&
            /(session|meeting|class)/i.test(q)
        ) {
            const session = await getNextSession();

            if (session) {
                campusData.sessions = [session];
            }
        }

        // --------------------------------
        // 2. TODAY'S SESSIONS
        // --------------------------------
        else if (
            /today/i.test(q) &&
            /(session|meeting|class|schedule)/i.test(q)
        ) {
            campusData.sessions = await getTodaySessions();
        }

        // --------------------------------
        // 3. NOTES
        // --------------------------------
        else if (/(note|notes|summary)/i.test(q)) {
            const keyword = cleanKeyword(question);

            if (keyword) {
                campusData.notes = await searchNotes(keyword);
            } else {
                campusData.notes = await searchNotes("");
            }
        }

        // --------------------------------
        // 4. STUDY GROUPS
        // --------------------------------
        else if (
            /(group|groups|recommend|join|subject)/i.test(q)
        ) {
            const keyword = cleanKeyword(question);

            if (keyword) {
                campusData.groups = await searchGroups(keyword);
            } else {
                campusData.groups = await searchGroups("");
            }
        }

        // --------------------------------
        // 5. STUDY SESSIONS
        // --------------------------------
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

        // --------------------------------
        // SEND QUESTION + DATA TO GEMINI
        // --------------------------------

        const prompt = `
You are Campus AI, the intelligent assistant inside Campus Connect Hub.

Your job is to help students with:
- Notes
- Study Groups
- Study Sessions
- Programming
- Data Structures
- Academic Questions
- General studying

IMPORTANT RESPONSE RULES:

1. Answer the student's question directly.
2. Keep the explanation clear and easy to understand.
3. Use headings and bullet points when useful.
4. Do not give unnecessary introductions.
5. If campus data is provided, use it to answer the question.
6. Never invent campus data.
7. If the requested campus data is empty, clearly say that no matching information was found.
8. For programming questions, provide simple examples when useful.
9. For academic questions, explain concepts step-by-step.
10. Keep answers concise but useful.

Student Question:
${question}

Campus Connect Data:
${JSON.stringify(campusData, null, 2)}
`;

       let response;

try {
    response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });
} catch (error) {
    // If Gemini 2.5 Flash is temporarily unavailable,
    // try the lighter Flash-Lite model.
    if (error.status === 503) {
        console.log("Gemini 2.5 Flash unavailable. Trying Flash-Lite...");

        response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt
        });
    } else {
        throw error;
    }
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
            message: err.message || "AI Assistant failed."
        });
    }
};

module.exports = {
    chatWithAssistant
};