import React, { useState } from "react";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Signup failed");
        return;
      }

      alert("Signup successful ✅");

      // 👉 redirect to login
      window.location.href = "/login";

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h2>Signup</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        style={{ margin: "10px", padding: "10px" }}
      />

      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={{ margin: "10px", padding: "10px" }}
      />

      <br />

      <button onClick={signup} style={{ padding: "10px 20px" }}>
        Signup
      </button>
    </div>
  );
}

export default Signup;