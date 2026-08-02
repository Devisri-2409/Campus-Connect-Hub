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

    const isNextSession = /(next|upcoming|nearest|future)/i.test(q);

    const isTodaySession = /(today)/i.test(q);

    const isNotes = /(note|notes|summary|download|open|explain)/i.test(q);

    const isGroups = /(group|groups|study group|recommend|join|subject)/i.test(q);

    const isSessions = /(session|sessions|meeting|schedule|class)/i.test(q);

    let response = {
      type: "general",
      reply:
        "I can help you with Notes, Study Groups and Study Sessions.",
      items: []
    };

    // ==========================
    // NEXT SESSION
    // ==========================
    if (isNextSession) {

      const session = await getNextSession();

      if (!session) {

        response.reply = "No upcoming study sessions found.";

      } else {

        response.type = "sessions";

        response.reply =
          `Your next session is "${session.title}" on ${session.session_date} at ${session.session_time}.`;

        response.items = [session];

      }

    }

    // ==========================
    // TODAY'S SESSIONS
    // ==========================
    else if (isTodaySession) {

      const sessions = await getTodaySessions();

      if (!sessions.length) {

        response.reply = "No study sessions scheduled for today.";

      } else {

        response.type = "sessions";

        response.reply =
          `You have ${sessions.length} study session(s) today.`;

        response.items = sessions;

      }

    }

    // ==========================
    // NOTES
    // ==========================
    else if (isNotes) {

      const keyword = cleanKeyword(question);

      const notes = await searchNotes(keyword);

      if (!notes.length) {

        response.reply = "No matching notes found.";

      } else {

        response.type = "notes";

        response.reply =
          `I found ${notes.length} matching note(s).`;

        response.items = notes;

      }

    }

    // ==========================
    // GROUPS
    // ==========================
    else if (isGroups) {

      const keyword = cleanKeyword(question);

      const groups = await searchGroups(keyword);

      if (!groups.length) {

        response.reply = "No matching study groups found.";

      } else {

        response.type = "groups";

        response.reply =
          `I found ${groups.length} matching study group(s).`;

        response.items = groups;

      }

    }

    // ==========================
    // SESSION SEARCH
    // ==========================
    else if (isSessions) {

      const keyword = cleanKeyword(question);

      const sessions = await searchSessions(keyword);

      if (!sessions.length) {

        response.reply = "No matching study sessions found.";

      } else {

        response.type = "sessions";

        response.reply =
          `I found ${sessions.length} matching session(s).`;

        response.items = sessions;

      }

    }

    return res.json({
      success: true,
      ...response
    });

  } catch (err) {

    console.error("Assistant Error:", err);

    return res.status(500).json({
      success: false,
      message: "Assistant failed."
    });

  }
};

module.exports = {
  chatWithAssistant
};