import React, { useState, useEffect, useCallback } from "react";
import {FaTrash , FaUpload, FaSignOutAlt} from "react-icons/fa";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  
  const token = localStorage.getItem("token");

  useEffect(() => {
      if(!token) {
         window.location.href = "/login";
  }
  }, [token]);
  

const loadHistory = useCallback(async () => {
  try {
    const res = await fetch(`http://localhost:5000/history`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    });

    const data = await res.json();
    console.log("History API response:", data);

    setHistory(Array.isArray(data) ? data : []);

  } catch (err) {
    console.error(err);
    setHistory([]);
  }
}, [ token]);

useEffect(() => {

  if (token) loadHistory();
}, [loadHistory, token]);

const loadChat = (chat) => {
  const cleanAnswer = chat.answer
    ?.replace("Answer based on company documents:", "")
    .trim();
  setMessages([
    { type: "user", text: chat.query },
    { type: "bot", text: cleanAnswer, chunks: chat.chunks }
  ]);
};

const deleteChat = async (id) => {
  try {
    await fetch(`http://localhost:5000/history/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": token
      }
    });

    // remove from UI
    setHistory(prev => prev.filter(chat => chat._id !== id));

  } catch (err) {
    console.error(err);
  }
};

  const sendQuery = async () => {
    if (!query.trim()) return;

    const userMessage = { type: "user", text: query };
    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await fetch("http://localhost:5000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({ query })
      });

      const data = await res.json();

      const botMessage = { type: "bot", text: "", chunks: data.chunks };
setMessages(prev => [...prev, botMessage]);

let i = 0;
const fullText = data.answer.replace("Answer based on company documents:", "").trim();

const interval = setInterval(() => {
  i++;
  setMessages(prev => {
    const updated = [...prev];
    updated[updated.length - 1].text = fullText.slice(0, i);
    return updated;
  });

  if (i >= fullText.length) clearInterval(interval);
}, 10);

loadHistory();

    } catch (err) {
      console.error(err);
    }

    setQuery("");
  };
  const handleUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      headers: {
        "Authorization": localStorage.getItem("token")
      },
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ File uploaded successfully");
    } else {
      alert(data.error || "Upload failed");
    }

  } catch (err) {
    console.error(err);
    alert("Upload error");
  }
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");

  window.location.href = "/login";
};

  return (
    <div className="app">
      
      {/*sidebar */}
      <div className="sidebar">
    <h3>Chat History</h3>
    {history.length === 0 && <p>No chats yet</p>}
    {history.map((h) => (
  <div key={h._id} className="history-item">

    <span onClick={() => loadChat(h)}>
      {h.query}
    </span>
    <button
  className="delete-btn"
  onClick={() => deleteChat(h._id)}
>
  <FaTrash />
</button>
      </div>
    ))}
  </div>
  
  {/*main chat */}
  <div className="main">   
      <div className="header">
        <span className="logo">Opsmind AI</span>
        
   <div className="header-actions">
    <button className="admin-btn" onClick={() => window.location.href = "/admin"}>
  Admin
</button>
  <label className="upload-btn">
    <FaUpload />
    Upload
    <input type="file" hidden onChange={handleUpload} />
  </label>
   {/*profile */}
   <div className="profile-container" onClick={() => setShowMenu(!showMenu)}>
    <img src={`https://ui-avatars.com/api/?name=${localStorage.getItem("email")}`}
          alt="user"
          className="profile-pic"
        />
        <span className="email">
          {localStorage.getItem("email")}
        </span>

        {showMenu && (
          <div className="dropdown">
            <button  onClick={logout}>
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        )}
   </div>

  
        </div>
  </div>
      

      <div className="chat-container">
        {messages.map((msg, index) => (
          <div key={index} className="message-block">
            
            <div className={msg.type === "user" ? "user-msg" : "bot-msg"}>
              {msg.text}
            </div>

            {/* Reference Cards */}
            {msg.type === "bot" && msg.chunks && (
              <div className="reference-section">
                <h4>📄 Sources</h4>
                <div className="reference-cards">
                  {msg.chunks.map((c, i) => (
                    <div key={i} className="card">
                      <p>{c.text.slice(0, 150)}...</p>
                      <span>
                        {c.source.split("\\").pop()} • Page {c.page}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

      <div className="input-box">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about company policies..."
        />
        <button onClick={sendQuery}>➤</button>
      </div>
    </div>

  </div>
  );
}

export default App;