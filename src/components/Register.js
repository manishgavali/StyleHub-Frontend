import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const validate = () => {
    if (!name.trim()) return "Name is required";
    if (!email.includes("@")) return "Enter a valid email";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) { setError(v); return; }

    setLoading(true);
    try {
      await API.post("/auth/register", { name, email, password });
      nav("/login");
    } catch (err) {
      console.error("Register error:", err);
      // handle normalized error from API client
      const msg = err?.message || "Registration failed";
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <h2>Create account</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 8 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button className="btn" type="submit" disabled={loading}>{loading ? "Creating..." : "Sign up"}</button>
      </form>
      <div style={{ marginTop: 12 }}>
        <small>Already have an account? <Link to="/login">Login</Link></small>
      </div>
    </div>
  );
}