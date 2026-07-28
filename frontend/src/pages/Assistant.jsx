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
          getAllSessions()
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

  const formatDate = (dateValue) => {
    if (!dateValue) return "Unknown date";
    return new Date(dateValue).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  };

  const formatTime = (timeValue) => {
    if (!timeValue) return "Unknown time";
    return new Date(`1970-01-01T${timeValue}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const searchNotes = (query) => {
    const queryText = query.toLowerCase();
    const match = notes.find((note) => {
      const target = `${note.title} ${note.description}`.toLowerCase();
      return queryText.split(" ").every((token) => target.includes(token));
    });

    if (!match) {
      return "I couldn't find an exact note match. Try asking something like 'Explain the note about recursion' or 'What is the note on database design?'";
    }

    return `I found a note titled \"${match.title}\". ${match.description || "This note has no description."}`;
  };

  const searchGroups = (query) => {
    const queryText = query.toLowerCase();
    const match = groups.find((group) => {
      const target = `${group.group_name} ${group.subject}`.toLowerCase();
      return queryText.split(" ").every((token) => target.includes(token));
    });

    if (!match) {
      return "I couldn't find an exact group match. You can ask me to show groups or explain how to join a study group.";
    }

    return `I found the group \"${match.group_name}\". Subject: ${match.subject || "not specified"}. Description: ${match.description || "No description available."}.`;
  };

  const searchSessions = (query) => {
    const upcoming = sessions
      .map((session) => ({
        ...session,
        dateTime: new Date(`${session.session_date}T${session.session_time || "00:00"}`)
      }))
      .filter((session) => session.dateTime >= new Date())
      .sort((a, b) => a.dateTime - b.dateTime);

    if (!upcoming.length) {
      return "There are no upcoming sessions right now.";
    }

    if (query.includes("next") || query.includes("upcoming")) {
      const next = upcoming[0];
      return `The next session is \"${next.title}\" on ${formatDate(next.session_date)} at ${formatTime(next.session_time)}.`;
    }

    const queryText = query.toLowerCase();
    const match = sessions.find((session) => {
      const target = `${session.title} ${session.description} ${session.group_name}`.toLowerCase();
      return queryText.split(" ").every((token) => target.includes(token));
    });

    if (!match) {
      return "I couldn't find an exact session match. Please ask about upcoming sessions or mention the session title.";
    }

    return `I found session \"${match.title}\" for ${match.group_name}. It is scheduled on ${formatDate(match.session_date)} at ${formatTime(match.session_time)}.`;
  };

  const handleAsk = () => {
    const trimmed = question.trim();
    if (!trimmed) {
      setError("Please enter a question.");
      return;
    }

    let response = "Ask me about notes, groups, or sessions. For example: 'Explain the note on algebra', 'Tell me about my study group', or 'What is the next session?'";
    const lower = trimmed.toLowerCase();

    if (lower.includes("note") || lower.includes("notes") || lower.includes("explain")) {
      response = searchNotes(lower);
    } else if (lower.includes("group") || lower.includes("study group") || lower.includes("join")) {
      response = searchGroups(lower);
    } else if (lower.includes("session") || lower.includes("meeting") || lower.includes("schedule")) {
      response = searchSessions(lower);
    } else {
      const matchNote = notes.some((note) => note.title?.toLowerCase().includes(lower));
      const matchGroup = groups.some((group) => group.group_name?.toLowerCase().includes(lower));
      const matchSession = sessions.some((session) => session.title?.toLowerCase().includes(lower));
      if (matchNote) response = searchNotes(lower);
      else if (matchGroup) response = searchGroups(lower);
      else if (matchSession) response = searchSessions(lower);
    }

    setHistory((prev) => [{ question: trimmed, answer: response }, ...prev]);
    setQuestion("");
    setError("");
  };

  return (
    <div className="assistant-page">
      <div className="assistant-panel">
        <div className="assistant-header">
          <div>
            <h1>AI Assistant</h1>
            <p>Get instant help with notes, groups, and upcoming sessions.</p>
          </div>
          <span className="assistant-badge">Campus AI</span>
        </div>

        <div className="assistant-body">
          <div className="assistant-input-card">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about notes, group info, or sessions..."
            />
            {error && <span className="assistant-error">{error}</span>}
            <button className="assistant-submit" onClick={handleAsk}>
              Ask AI
            </button>
          </div>

          <div className="assistant-response-card">
            <h2>Conversation</h2>
            <div className="assistant-response">
              {loading ? (
                <p>Loading data...</p>
              ) : history.length === 0 ? (
                <p>Ask anything about your notes, groups, or sessions.</p>
              ) : (
                history.map((item, index) => (
                  <div key={index} className="assistant-exchange">
                    <div className="assistant-question">Q: {item.question}</div>
                    <div className="assistant-answer">A: {item.answer}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
