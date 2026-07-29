import React, { useState } from "react";
import { getAssistantResponse } from "../services/assistantService";
import "../styles/Assistant.css";

const suggestionPrompts = [
  "Find notes about React",
  "Recommend study groups for AI",
  "Show today's sessions",
  "Show upcoming sessions",
  "Explain the latest note summary"
];

const Assistant = () => {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async (value = question) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Please enter your question before sending.");
      return;
    }

    setError("");
    setLoading(true);
    setHistory((prev) => [...prev, { type: "user", content: trimmed }]);

    try {
      const response = await getAssistantResponse(trimmed);
      setHistory((prev) => [
        ...prev,
        {
          type: "assistant",
          content: response.reply,
          items: response.items || [],
          resultType: response.type
        }
      ]);
      setQuestion("");
    } catch (err) {
      setHistory((prev) => [
        ...prev,
        {
          type: "assistant",
          content: "The assistant could not reach the server. Please try again in a moment.",
          items: [],
          resultType: "error"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessageContent = (message) => {
    if (message.type === "user") {
      return <div className="assistant-bubble user">{message.content}</div>;
    }

    return (
      <div className="assistant-bubble assistant">
        <div className="assistant-message-text">{message.content}</div>
        {message.items?.length > 0 && (
          <div className="assistant-card-list">
            {message.items.map((item) => (
              <div key={item.id} className="assistant-card-item">
                <div className="assistant-card-title">{item.title}</div>
                <div className="assistant-card-subtitle">{item.subtitle}</div>
                <div className="assistant-card-summary">{item.summary}</div>
                {item.downloadUrl && (
                  <a className="assistant-link" href={item.downloadUrl} target="_blank" rel="noreferrer">
                    Download note
                  </a>
                )}
                {item.meetingLink && (
                  <a className="assistant-link" href={item.meetingLink} target="_blank" rel="noreferrer">
                    Join meeting
                  </a>
                )}
                {item.location && !item.meetingLink && (
                  <div className="assistant-card-location">Location: {item.location}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="assistant-page">
      <div className="assistant-panel">
        <div className="assistant-header">
          <div>
            <h1>Campus AI Assistant</h1>
            <p>Ask questions about notes, study groups, and study sessions.</p>
          </div>
          <span className="assistant-badge">Connected to MySQL data</span>
        </div>

        <div className="assistant-suggestions">
          {suggestionPrompts.map((prompt) => (
            <button key={prompt} className="assistant-chip" onClick={() => handleAsk(prompt)}>
              {prompt}
            </button>
          ))}
        </div>

        <div className="assistant-chat-window">
          {history.length === 0 ? (
            <div className="assistant-empty-state">
              <h3>How can I help today?</h3>
              <p>Use the prompts above or ask a question like “Show today’s sessions” or “Find notes about React”.</p>
            </div>
          ) : (
            history.map((message, index) => (
              <div key={`${message.type}-${index}`} className="assistant-message-row">
                {renderMessageContent(message)}
              </div>
            ))
          )}
          {loading && (
            <div className="assistant-message-row">
              <div className="assistant-bubble assistant loading">
                <span className="assistant-dot" />
                <span className="assistant-dot" />
                <span className="assistant-dot" />
              </div>
            </div>
          )}
        </div>

        <div className="assistant-input-card">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about notes, groups, or study sessions..."
            rows={4}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleAsk();
              }
            }}
          />
          {error && <span className="assistant-error">{error}</span>}
          <button className="assistant-submit" onClick={() => handleAsk()}>
            Ask AI
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
