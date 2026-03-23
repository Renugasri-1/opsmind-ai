import React, { useState } from "react";
import "./Auth.css";

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async () => {
    try {
      const url = isSignup
        ? "http://localhost:5000/auth/signup"
        : "http://localhost:5000/auth/login";

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      // Signup success
      if (isSignup) {
        alert("Signup successful! Please login.");
        setIsSignup(false);
        return;
      }

      // Login success
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("email", email);

      window.location.href = "/";

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleAuth}>
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <div
          className="switch-text"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? (
            <>
              Already have an account? <span>Login</span>
            </>
          ) : (
            <>
              New user? <span>Sign Up</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;