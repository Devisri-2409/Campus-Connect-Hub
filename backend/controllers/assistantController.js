const {
  normalize,
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

    let response = {
      type: "general",
      reply: "I can help you with Notes, Study Groups and Study Sessions.",
      items: []
    };

    // =============================
    // NEXT SESSION
    // =============================
    if (q.includes("next") || q.includes("upcoming")) {

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

    // =============================
    // TODAY'S SESSION
    // =============================
    else if (q.includes("today")) {

      const sessions = await getTodaySessions();

      if (!sessions.length) {

        response.reply = "No study sessions scheduled for today.";

      } else {

        response.type = "sessions";

        response.reply =
          `You have ${sessions.length} session(s) today.`;

        response.items = sessions;

      }

    }

    // =============================
    // NOTES
    // =============================
    else if (q.includes("note")) {

      const keyword = question
        .replace(/notes?|find|about/gi, "")
        .trim();

      const notes = await searchNotes(keyword);

      if (!notes.length) {

        response.reply = "No matching notes found.";

      } else {

        response.type = "notes";

        response.reply =
          `I found ${notes.length} note(s).`;

        response.items = notes;

      }

    }

    // =============================
    // GROUPS
    // =============================
    else if (q.includes("group") || q.includes("recommend")) {

      const keyword = question
        .replace(/groups?|recommend|study/gi, "")
        .trim();

      const groups = await searchGroups(keyword);

      if (!groups.length) {

        response.reply = "No matching study groups found.";

      } else {

        response.type = "groups";

        response.reply =
          `I found ${groups.length} study group(s).`;

        response.items = groups;

      }

    }

    // =============================
    // SESSION SEARCH
    // =============================
    else if (q.includes("session")) {

      const keyword = question
        .replace(/sessions?/gi, "")
        .trim();

      const sessions = await searchSessions(keyword);

      if (!sessions.length) {

        response.reply = "No matching study sessions found.";

      } else {

        response.type = "sessions";

        response.reply =
          `I found ${sessions.length} session(s).`;

        response.items = sessions;

      }

    }

    return res.json({
      success: true,
      ...response
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Assistant failed."
    });

  }
};

module.exports = {
  chatWithAssistant
};