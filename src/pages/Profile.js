import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, loading, logout } = useContext(AuthContext);
  const nav = useNavigate();

  if (loading) return <div className="container">Loading...</div>;

  if (!user) {
    return (
      <div className="container" style={{ maxWidth: 420 }}>
        <h2>Please login</h2>
        <button className="btn" onClick={() => nav("/login")}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <h2>Profile</h2>
      <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
        <div><strong>Name:</strong> {user.name}</div>
        <div><strong>Email:</strong> {user.email}</div>
        {user.phone && <div><strong>Phone:</strong> {user.phone}</div>}
        <div style={{ marginTop: 12 }}>
          <button className="btn" onClick={() => { logout(); nav("/"); }}>Logout</button>
        </div>
      </div>
    </div>
  );
}