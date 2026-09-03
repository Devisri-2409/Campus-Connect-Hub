import React, { useEffect, useState } from "react";
import { getAllNotes } from "../services/noteService";
import { getAllGroups } from "../services/groupService";
import { getAllSessions } from "../services/sessionService";
import "../styles/Assistant.css";

const Assistant = () => {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]);
  const [notes, setNotes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [noteData, groupData, sessionData] = await Promise.all([
          getAllNotes(),
          getAllGroups(),
          getAllSessions(),
        ]);

        setNotes(noteData);
        setGroups(groupData);
        setSessions(sessionData);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format date in a clean, user-friendly way
  const formatDate = (dateValue) => {
    if (!dateValue) return "Unknown date";

    const date = new Date(dateValue);

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Format time in 12-hour format
  const formatTime = (timeValue) => {
    if (!timeValue) return "Unknown time";

    const [hours, minutes] = timeValue.split(":");

    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Search notes
  const searchNotes = (query) => {
    const queryText = query.toLowerCase();

    const match = notes.find((note) => {
      const target = `${note.title || ""} ${
        note.description || ""
      }`.toLowerCase();

      return queryText
        .split(" ")
        .filter(Boolean)
        .every((token) => target.includes(token));
    });

    if (!match) {
      return (
        "I couldn't find an exact note match. Try asking something like " +
        "'Explain the note about recursion' or " +
        "'What is the note on database design?'"
      );
    }

    return `📝 Note: ${match.title}

${match.description || "This note has no description."}`;
  };

  // Search study groups
  const searchGroups = (query) => {
    const queryText = query.toLowerCase();

    const match = groups.find((group) => {
      const target = `${group.group_name || ""} ${
        group.subject || ""
      }`.toLowerCase();

      return queryText
        .split(" ")
        .filter(Boolean)
        .every((token) => target.includes(token));
    });

    if (!match) {
      return (
        "I couldn't find an exact group match. " +
        "You can ask me to show groups or explain how to join a study group."
      );
    }

    return `👥 ${match.group_name}

📚 Subject: ${match.subject || "Not specified"}

${
  match.description ||
  "No description is available for this study group."
}`;
  };

  // Search study sessions
  const searchSessions = (query) => {
    const now = new Date();

    const upcoming = sessions
      .map((session) => ({
        ...session,
        dateTime: new Date(
          `${session.session_date}T${session.session_time || "00:00"}`
        ),
      }))
      .filter((session) => session.dateTime >= now)
      .sort((a, b) => a.dateTime - b.dateTime);

    if (!upcoming.length) {
      return "There are no upcoming study sessions right now.";
    }

    // Next / upcoming session
    if (query.includes("next") || query.includes("upcoming")) {
      const next = upcoming[0];

      return `📚 Your next study session is "${next.title}"

📅 ${formatDate(next.session_date)}
🕘 ${formatTime(next.session_time)}
📍 ${next.location || "Online"}`;
    }

    // Search for a particular session
    const queryText = query.toLowerCase();

    const match = sessions.find((session) => {
      const target =
        `${session.title || ""} ${session.description || ""} ${
          session.group_name || ""
        }`.toLowerCase();

      return queryText
        .split(" ")
        .filter(Boolean)
        .every((token) => target.includes(token));
    });

    if (!match) {
      return (
        "I couldn't find that session. " +
        "Try asking about upcoming sessions or mention the session title."
      );
    }

    return `📚 ${match.title}

👥 Group: ${match.group_name || "Not specified"}
📅 ${formatDate(match.session_date)}
🕘 ${formatTime(match.session_time)}
📍 ${match.location || "Online"}`;
  };

  // Handle AI question
  const handleAsk = () => {
    const trimmed = question.trim();

    if (!trimmed) {
      setError("Please enter a question.");
      return;
    }

    let response =
      "Ask me about notes, groups, or sessions. For example: 'Explain the note on algebra', 'Tell me about my study group', or 'What is the next session?'";

    const lower = trimmed.toLowerCase();

    if (
      lower.includes("note") ||
      lower.includes("notes") ||
      lower.includes("explain")
    ) {
      response = searchNotes(lower);
    } else if (
      lower.includes("group") ||
      lower.includes("study group") ||
      lower.includes("join")
    ) {
      response = searchGroups(lower);
    } else if (
      lower.includes("session") ||
      lower.includes("meeting") ||
      lower.includes("schedule")
    ) {
      response = searchSessions(lower);
    } else {
      const matchNote = notes.some((note) =>
        note.title?.toLowerCase().includes(lower)
      );

      const matchGroup = groups.some((group) =>
        group.group_name?.toLowerCase().includes(lower)
      );

      const matchSession = sessions.some((session) =>
        session.title?.toLowerCase().includes(lower)
      );

      if (matchNote) {
        response = searchNotes(lower);
      } else if (matchGroup) {
        response = searchGroups(lower);
      } else if (matchSession) {
        response = searchSessions(lower);
      }
    }

    setHistory((prev) => [
      {
        question: trimmed,
        answer: response,
      },
      ...prev,
    ]);

    setQuestion("");
    setError("");
  };

  return (
    <div className="assistant-page">
      <div className="assistant-panel">

        {/* Header */}
        <div className="assistant-header">
          <div>
            <h1>Campus AI Assistant</h1>
            <p>
              Ask questions about notes, study groups, and study sessions.
            </p>
          </div>

          <span className="assistant-badge">
            Campus AI
          </span>
        </div>

        {/* Suggestions */}
        <div className="assistant-suggestions">
          <button
            className="assistant-chip"
            onClick={() => setQuestion("Find notes about React")}
          >
            Find notes about React
          </button>

          <button
            className="assistant-chip"
            onClick={() => setQuestion("Show study groups")}
          >
            Show study groups
          </button>

          <button
            className="assistant-chip"
            onClick={() => setQuestion("What is my next study session?")}
          >
            Show upcoming sessions
          </button>

          <button
            className="assistant-chip"
            onClick={() => setQuestion("Explain the latest note")}
          >
            Explain latest note
          </button>
        </div>

        {/* Chat */}
        <div className="assistant-chat-window">
          {loading ? (
            <div className="assistant-empty-state">
              <p>Loading campus data...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="assistant-empty-state">
              <div className="assistant-empty-icon">🤖</div>

              <h2>Welcome to Campus AI</h2>

              <p>
                Ask me about your notes, study groups,
                or upcoming study sessions.
              </p>
            </div>
          ) : (
            history.map((item, index) => (
              <div key={index} className="assistant-exchange">

                {/* User message */}
                <div className="assistant-message-row">
                  <div className="assistant-bubble user">
                    <span className="message-label">
                      You
                    </span>

                    <div className="assistant-message-text">
                      {item.question}
                    </div>
                  </div>
                </div>

                {/* AI message */}
                <div className="assistant-message-row">
                  <div className="assistant-bubble assistant">

                    <span className="message-label">
                      🤖 Campus AI
                    </span>

                    <div className="assistant-message-text">
                      {item.answer}
                    </div>

                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="assistant-input-card">

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
            placeholder="Ask about notes, study groups, or sessions..."
          />

          {error && (
            <span className="assistant-error">
              {error}
            </span>
          )}

          <button
            className="assistant-submit"
            onClick={handleAsk}
          >
            Ask AI
          </button>

        </div>

      </div>
    </div>
  );
};

export default Assistant;