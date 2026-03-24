import React, { useEffect, useState, useCallback } from "react";
import { FaArrowLeft } from "react-icons/fa";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,Cell
} from "recharts";
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

  const docData = Object.entries(stats.docCount).map(([name, value]) => ({
  name,
  value
}));

const topicData = Object.entries(stats.topicCount).map(([name, value]) => ({
  name,
  value
}));

  const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4"];
  return (
  <div className="admin-container">

    {/* HEADER */}
    <div className="admin-header">
      <h2>Admin Dashboard</h2>

      <button 
        className="back-btn"
        onClick={() => window.location.href = "/"}
      >
        <FaArrowLeft /> Back to Chat
      </button>
    </div>

    {/* STATS CARDS */}
    <div className="stats-grid">
      <div className="card">👤 Users: {users.length}</div>
      <div className="card">💬 Chats: {chats.length}</div>
      <div className="card">📄 Docs: {Object.keys(stats.docCount).length}</div>
    </div>

    {/* CHARTS */}
    <div className="charts-grid">

      {/* DOCUMENTS */}
      <div className="card">
        <h3>Top Documents</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart  data={docData}>
            
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4F46E5"/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* TOPICS */}
      <div className="card">
        <h3>Top Topics</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topicData}>
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value">
  {topicData.map((entry, index) => (
    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
  ))}
</Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>

    {/* USERS */}
    <div className="card">
      <h3>Users</h3>
      {users.map(u => (
        <div key={u._id} className="list-item">
          {u.email} ({u.role})
        </div>
      ))}
    </div>

    {/* CHATS */}
    <div className="card">
      <h3>Chats</h3>
      {chats.map(c => (
        <div key={c._id} className="chat-item">
          <b>{c.query}</b>
          <p>{c.answer.slice(0, 150)}...</p>
        </div>
      ))}
    </div>

  </div>
);
}

export default Admin;