import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("https://text-share-app-by-wittedtech.vercel.app/api"); // Adjust for the Vercel deployment

function App() {
  const [sessionId, setSessionId] = useState("");
  const [content, setContent] = useState("");
  const [texts, setTexts] = useState([]);

  useEffect(() => {
    const storedSessionId = localStorage.getItem("sessionId");
    const storedTexts = JSON.parse(localStorage.getItem("texts")) || [];
    if (storedSessionId) {
      setSessionId(storedSessionId);
      setTexts(storedTexts);
      socket.emit("joinSession", { sessionId: storedSessionId });
    }

    socket.on("updateContent", (newContent) => {
      setTexts((prevTexts) => {
        const updatedTexts = [...prevTexts, newContent];
        localStorage.setItem("texts", JSON.stringify(updatedTexts));
        return updatedTexts;
      });
    });

    return () => {
      socket.off("updateContent");
    };
  }, []);

  const joinSession = () => {
    localStorage.setItem("sessionId", sessionId);
    socket.emit("joinSession", { sessionId });
  };

  const sendContent = () => {
    socket.emit("newContent", { sessionId, content });
    setContent("");
  };

  const endSession = () => {
    localStorage.removeItem("sessionId");
    localStorage.removeItem("texts");
    setSessionId("");
    setTexts([]);
  };

  return (
    <div className="App">
      <h1>Text Sharing App</h1>
      <div className="session-controls">
        <input
          type="text"
          placeholder="Session ID"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
        />
        <button onClick={joinSession}>Join Session</button>
      </div>
      <div className="content-controls">
        <textarea
          placeholder="Enter text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button onClick={sendContent}>Send</button>
      </div>
      <div className="texts">
        {texts.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
      <button className="end-session" onClick={endSession}>
        End Session
      </button>
    </div>
  );
}

export default App;
