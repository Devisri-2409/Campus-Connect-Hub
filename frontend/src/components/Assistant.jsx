import React, { useEffect, useState } from "react";
import { getAllNotes } from "../services/noteService";
import { getAllGroups } from "../services/groupService";
import { getAllSessions } from "../services/sessionService";
import "../styles/Assistant.css";

const Assistant = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState([]);
  const [notes, setNotes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesData, groupsData, sessionsData] = await Promise.all([
          getAllNotes(),
          getAllGroups(),
          getAllSessions()
        ]);
        setNotes(notesData);
        setGroups(groupsData);
        setSessions(sessionsData);
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
    const date = new Date(dateValue);
    return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  };

  const formatTime = (timeValue) => {
    if (!timeValue) return "Unknown time";
    const time = new Date(`1970-01-01T${timeValue}`);
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const searchNotes = (query) => {
    const match = notes.filter((note) => {
      const target = `${note.title} ${note.description}`.toLowerCase();
      return query.split(" ").some((token) => target.includes(token));
    });

    if (!match.length) {
      return "I couldn't find a matching note, but try using a specific topic or keyword from the Notes page.";
    }

    const note = match[0];
    return `I found a note titled \"${note.title}\". ${note.description || "No description available."} If you'd like, ask me to explain a specific note title or keyword.`;
  };

  const searchGroups = (query) => {
    const match = groups.filter((group) => {
      const target = `${group.group_name} ${group.subject}`.toLowerCase();
      return query.split(" ").some((token) => target.includes(token));
    });

    if (!match.length) {
      return `I couldn't find a matching group from your current groups, but I can tell you about all available groups or how to join one.`;
    }

    const group = match[0];
    return `Here is the group I found: ${group.group_name}. Subject: ${group.subject || "not specified"}. Description: ${group.description || "No description available."}.`;  
  };

  const searchSessions = (query) => {
    const upcoming = sessions
      .map((session) => ({
        ...session,
        dateTime: new Date(`${session.session_date}T${session.session_time || "00:00"}`)
      }))
      .filter((session) => session.dateTime >= new Date())
      .sort((a, b) => a.dateTime - b.dateTime);

    if (query.includes("upcoming") || query.includes("next")) {
      if (!upcoming.length) {
        return "No upcoming sessions are scheduled right now.";
      }
      const next = upcoming[0];
      return `The next session is ${next.title} on ${formatDate(next.session_date)} at ${formatTime(next.session_time)} in ${next.location || "an online meeting"}.`; 
    }

    const match = sessions.filter((session) => {
      const target = `${session.title} ${session.description} ${session.group_name}`.toLowerCase();
      return query.split(" ").some((token) => target.includes(token));
    });

    if (!match.length) {
      return "I couldn't find a matching session, but I can show you upcoming session details if you ask about upcoming or next sessions.";
    }

    const session = match[0];
    return `I found a session titled \"${session.title}\" for ${session.group_name}. It is scheduled on ${formatDate(session.session_date)} at ${formatTime(session.session_time)}. Location: ${session.location || "No location provided"}.`;
  };

  const handleAsk = () => {
    const trimmed = question.trim();
    if (!trimmed) {
      setError("Please enter your question before sending.");
      return;
    }

    let response = "I am here to help you with notes, groups, and sessions. Ask me about note explanations, group details, or session schedules.";
    const query = trimmed.toLowerCase();

    if (query.includes("note") || query.includes("notes") || query.includes("explain")) {
      response = notes.length ? searchNotes(query) : "I need your notes data first. Please visit the Notes page and refresh.";
    } else if (query.includes("group") || query.includes("study group") || query.includes("join group")) {
      response = groups.length ? searchGroups(query) : "I need your group data first. Please visit the Groups page and refresh.";
    } else if (query.includes("session") || query.includes("meeting") || query.includes("schedule")) {
      response = sessions.length ? searchSessions(query) : "I need your session data first. Please visit the Sessions page and refresh.";
    } else {
      const matchedNote = notes.some((note) => note.title?.toLowerCase().includes(query));
      const matchedGroup = groups.some((group) => group.group_name?.toLowerCase().includes(query));
      const matchedSession = sessions.some((session) => session.title?.toLowerCase().includes(query));
      if (matchedNote) response = searchNotes(query);
      else if (matchedGroup) response = searchGroups(query);
      else if (matchedSession) response = searchSessions(query);
    }

    setHistory((prev) => [...prev, { question: trimmed, answer: response }]);
    setAnswer(response);
    setQuestion("");
    setError("");
  };

  return (
    <div className="assistant-page">
      <div className="assistant-panel">
        <div className="assistant-header">
          <div>
            <h1>AI Assistant</h1>
            <p>Ask about notes, group details, or upcoming sessions.</p>
          </div>
          <span className="assistant-badge">Powered by campus data</span>
        </div>

        <div className="assistant-body">
          <div className="assistant-input-card">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here..."
              rows={4}
            />
            {error && <span className="assistant-error">{error}</span>}
            <button className="assistant-submit" onClick={handleAsk}>
              Ask AI
            </button>
          </div>

          <div className="assistant-response-card">
            <h2>Response</h2>
            {loading ? (
              <p>Loading your notes, groups, and session data...</p>
            ) : (
              <div className="assistant-response">
                {history.length === 0 ? (
                  <p>Ask a question to get started. For example: "Explain my last note" or "What is the next session?"</p>
                ) : (
                  history.slice().reverse().map((item, index) => (
                    <div key={index} className="assistant-exchange">
                      <div className="assistant-question">Q: {item.question}</div>
                      <div className="assistant-answer">A: {item.answer}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
