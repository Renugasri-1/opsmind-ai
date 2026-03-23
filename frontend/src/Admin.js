import React, { useEffect, useState, useCallback } from "react";
import { FaArrowLeft } from "react-icons/fa";
import "./App.css";

function Admin() {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [stats, setStats] = useState({ docCount: {}, topicCount: {} });
  const token = localStorage.getItem("token");

  const loadData = useCallback(async () => {
    try {
      const u = await fetch("http://localhost:5000/admin/users", {
        headers: { Authorization: token }
      });
      const usersData = await u.json();

      const c = await fetch("http://localhost:5000/admin/chats", {
        headers: { Authorization: token }
      });
      const chatsData = await c.json();

      const s = await fetch("http://localhost:5000/admin/stats", {
      headers: { Authorization: token }
    });
    const statsData = await s.json();

      setUsers(Array.isArray(usersData) ? usersData : []);
      setChats(Array.isArray(chatsData) ? chatsData : []);
      setStats(statsData || { docCount: {}, topicCount: {} });
    } catch (err) {
      console.error("Admin load error:", err);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      {/* Back Button */}
<button 
  className="back-btn"
  onClick={() => window.location.href = "/"}
>
  <FaArrowLeft /> Back to Chat
</button>

      {/* USERS */}
      <h3>Users</h3>
      {users.length === 0 && <p>No users found</p>}
      {users.map((u) => (
        <div key={u._id} className="admin-card">
          {u.email} ({u.role})
        </div>
      ))}

      {/* CHATS */}
      <h3>Chats</h3>
      {chats.length === 0 && <p>No chats found</p>}
      {chats.map((c) => (
        <div key={c._id} className="admin-card dark">
          <b>{c.query}</b>
          <p>{c.answer}</p>

          <h3>📊 Knowledge Insights</h3>

<div className="admin-card">
  <h4>Top Documents</h4>
  {Object.entries(stats.docCount).length === 0 && <p>No data</p>}

  {Object.entries(stats.docCount).map(([doc, count]) => (
    <div key={doc}>{doc} → {count}</div>
  ))}
</div>

<div className="admin-card">
  <h4>Top Topics</h4>
  {Object.entries(stats.topicCount).length === 0 && <p>No data</p>}
  
  {Object.entries(stats.topicCount).map(([topic, count]) => (
    <div key={topic}>{topic} → {count}</div>
  ))}
</div>
        </div>
      ))}
    </div>
  );
}

export default Admin;