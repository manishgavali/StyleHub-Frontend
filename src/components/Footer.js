import React from "react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container" style={{ textAlign: "center", padding: 18 }}>
        <small style={{ color: "var(--muted)" }}>
          © {new Date().getFullYear()} StyleHub — Fashion for everyone
        </small>
      </div>
    </footer>
  );
}