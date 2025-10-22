import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const onSearch = (e) => {
    e.preventDefault();
    nav(`/products?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <div className="logo">StyleHub</div>
        </Link>

        <form className="searchbar" onSubmit={onSearch}>
          <input
            type="search"
            placeholder="Search for clothing, brands, styles..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>

        <div className="header-actions">
          <Link to="/add-product" className="icon-btn" title="Sell">Sell</Link>
          {!user ? (
            <>
              <Link to="/register" className="icon-btn" title="Sign up">Sign up</Link>
              <Link to="/login" className="icon-btn" title="Login">Login</Link>
            </>
          ) : (
            <>
              <Link to="/wishlist" className="icon-btn" title="Wishlist">♡</Link>
              <Link to="/cart" className="icon-btn" title="Cart">🛒</Link>
              <Link to="/profile" className="icon-btn" title="Profile">Hi, {user.name?.split(" ")[0] || "User"}</Link>
              <button className="icon-btn" onClick={() => { logout(); nav("/"); }} title="Logout">Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}