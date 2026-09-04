import React, { useEffect, useState } from "react";
import { getAllNotes } from "../services/noteService";
import { getAllGroups } from "../services/groupService";
import { getAllSessions } from "../services/sessionService";
import api from "../services/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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



  // Handle AI question
const handleAsk = async () => {
    const trimmed = question.trim();

    if (!trimmed) {
        setError("Please enter a question.");
        return;
    }

    try {
        setError("");

        const token = localStorage.getItem("token");

        const response = await api.post(
            "/assistant/chat",
            {
                question: trimmed
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.data.success) {
            setHistory((prev) => [
                ...prev,
                {
                    question: trimmed,
                    answer: response.data.reply
                }
            ]);

            setQuestion("");
        } else {
            setError(
                response.data.message || "Assistant could not answer."
            );
        }

    } catch (err) {
        console.error("Assistant Error:", err);

        setError(
            err.response?.data?.message ||
            "Unable to connect to Campus AI."
        );
    }
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
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
  > {"#Markdown Test \n\n **bold** and *italic*."}
    {item.answer}
  </ReactMarkdown>
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