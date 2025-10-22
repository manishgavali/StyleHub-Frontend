import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password }); // AuthContext will call API and fetch profile
      nav("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <h2>Login</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 8 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button className="btn" type="submit">Login</button>
      </form>
      <div style={{ marginTop: 12 }}>
        <small>Don't have an account? <Link to="/register">Sign up</Link></small>
      </div>
    </div>
  );
}