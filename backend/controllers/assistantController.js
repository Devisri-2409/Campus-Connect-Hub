const db = require("../config/db");

const queryDb = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results);
    });
  });

const normalizeText = (value) => (value || "").toString().toLowerCase();

const getMatches = (items, question) => {
  const terms = normalizeText(question)
    .split(/\s+/)
    .filter(Boolean)
    .filter((term) => !["what", "show", "find", "tell", "me", "the", "a", "an", "my", "for", "about", "can", "you", "please", "help", "with", "and", "or"].includes(term));

  if (!terms.length) {
    return items;
  }

  return items.filter((item) => {
    const haystack = [
      item.title,
      item.summary,
      item.subject,
      item.group_name,
      item.description,
      item.location,
      item.meeting_link,
      item.file_url
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return terms.every((term) => haystack.includes(term));
  });
};

const buildNoteReply = (notes, question) => {
  const matchedNotes = getMatches(notes, question);
  const filtered = matchedNotes.slice(0, 3);

  if (!filtered.length) {
    return {
      type: "notes",
      reply: "I could not find a note matching that request. Try a title, keyword, or topic from your notes.",
      items: []
    };
  }

  const firstNote = filtered[0];
  const summary = firstNote.summary && firstNote.summary.trim()
    ? firstNote.summary
    : "No summary is stored for this note yet. Please open the note to view the full details.";

  const downloadLink = firstNote.file_url
    ? `\n\nDownload: /uploads/${firstNote.file_url}`
    : "";

  return {
    type: "notes",
    reply: `I found "${firstNote.title}".\n\n${summary}${downloadLink}`,
    items: filtered.map((note) => ({
      id: note.note_id,
      title: note.title,
      subtitle: note.group_name || "General note",
      summary: note.summary || "No summary stored yet.",
      downloadUrl: note.file_url ? `/uploads/${note.file_url}` : null
    }))
  };
};

const buildGroupReply = (groups, question) => {
  const matchedGroups = getMatches(groups, question);
  const filtered = matchedGroups.slice(0, 3);

  if (!filtered.length) {
    return {
      type: "groups",
      reply: "I could not find a matching study group. Try a subject such as Mathematics, AI, or Programming.",
      items: []
    };
  }

  const recommendationText = /recommend|suggest|idea|find/i.test(question)
    ? "Here are a few study groups that may suit your interest:"
    : "Here are the study groups I found:";

  return {
    type: "groups",
    reply: `${recommendationText}\n\n${filtered.map((group) => `• ${group.group_name} (${group.subject || "General"}) - ${group.description || "No description available."}`).join("\n")}`,
    items: filtered.map((group) => ({
      id: group.group_id,
      title: group.group_name,
      subtitle: group.subject || "General",
      summary: group.description || "No description available."
    }))
  };
};

const buildSessionReply = (sessions, question) => {
  const normalizedQuestion = normalizeText(question);
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  let filtered = sessions;

  if (normalizedQuestion.includes("today")) {
    filtered = sessions.filter((session) => session.session_date === todayString);
  } else if (normalizedQuestion.includes("upcoming") || normalizedQuestion.includes("next")) {
    filtered = sessions.filter((session) => session.session_date >= todayString);
  } else {
    filtered = getMatches(sessions, question);
  }

  filtered = filtered.slice(0, 4);

  if (!filtered.length) {
    return {
      type: "sessions",
      reply: "No matching study sessions were found. Try asking for today's sessions or upcoming sessions.",
      items: []
    };
  }

  const heading = normalizedQuestion.includes("today")
    ? "Here are the study sessions for today:"
    : normalizedQuestion.includes("upcoming") || normalizedQuestion.includes("next")
      ? "Here are the upcoming study sessions:"
      : "Here are the study sessions I found:";

  return {
    type: "sessions",
    reply: `${heading}\n\n${filtered.map((session) => `• ${session.title} — ${session.session_date} at ${session.session_time || "TBD"}. Location: ${session.location || "Not specified"}. ${session.meeting_link ? `Link: ${session.meeting_link}` : ""}`).join("\n")}`,
    items: filtered.map((session) => ({
      id: session.session_id,
      title: session.title,
      subtitle: session.group_name || "Study session",
      summary: `${session.session_date} at ${session.session_time || "TBD"}`,
      location: session.location || "Not specified",
      meetingLink: session.meeting_link || null
    }))
  };
};

const chatWithAssistant = async (req, res) => {
  try {
    const question = (req.body?.question || "").trim();

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Please enter a question."
      });
    }

   const notes = await queryDb(`
    SELECT
        n.note_id,
        n.title,
        n.summary,
        n.file_url,
        n.created_at,
        sg.group_name
    FROM notes n
    LEFT JOIN study_groups sg
        ON n.group_id = sg.group_id
    ORDER BY n.created_at DESC
`);

const groups = await queryDb(`
    SELECT *
    FROM study_groups
    ORDER BY group_name ASC
`);

const sessions = await queryDb(`
    SELECT
        ss.session_id,
        ss.title,
        ss.description,
        ss.session_date,
        ss.session_time,
        ss.location,
        ss.meeting_link,
        sg.group_name
    FROM study_sessions ss
    JOIN study_groups sg
        ON ss.group_id = sg.group_id
    ORDER BY ss.session_date ASC, ss.session_time ASC
`);

    const lowerQuestion = normalizeText(question);
    const isNoteIntent = /(note|notes|summary|download|open|keyword|title|explain)/i.test(question);
    const isGroupIntent = /(group|groups|study group|subject|recommend|suggest|join)/i.test(question);
    const isSessionIntent = /(session|sessions|meeting|schedule|today|upcoming|next|location|link)/i.test(question);

    let response;

    if (isSessionIntent) {
      response = buildSessionReply(sessions, question);
    } else if (isNoteIntent) {
      response = buildNoteReply(notes, question);
    } else if (isGroupIntent) {
      response = buildGroupReply(groups, question);
    } else {
      const noteMatch = getMatches(notes, question);
      const groupMatch = getMatches(groups, question);
      const sessionMatch = getMatches(sessions, question);

      if (noteMatch.length) {
        response = buildNoteReply(notes, question);
      } else if (groupMatch.length) {
        response = buildGroupReply(groups, question);
      } else if (sessionMatch.length) {
        response = buildSessionReply(sessions, question);
      } else {
        response = {
          type: "general",
          reply: "I can help you explore notes, study groups, and study sessions. Try asking things like: 'Find notes about React', 'Recommend study groups for AI', or 'Show today's sessions'.",
          items: []
        };
      }
    }

    const finalReply = lowerQuestion.includes("today") && response.type === "sessions"
      ? response.reply
      : response.reply;

    return res.json({
      success: true,
      reply: finalReply,
      type: response.type,
      items: response.items || []
    });
  } catch (error) {
    console.error("Assistant error:", error);
    return res.status(500).json({
      success: false,
      message: "The assistant could not process your request right now."
    });
  }
};

module.exports = {
  chatWithAssistant
};
