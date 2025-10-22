import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import API from "../services/api";

export default function ProductCard({ product }) {
  const nav = useNavigate();
  const { addToCart } = useContext(CartContext);

  const backendOrigin = (API.defaults?.baseURL || process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/api\/?$/, "");

  const normalizeImages = (imgs) => {
    if (!imgs) return [];
    if (typeof imgs === "string") {
      try { imgs = JSON.parse(imgs); } catch (e) { imgs = [imgs]; }
    }
    if (!Array.isArray(imgs)) imgs = [imgs];
    return imgs.filter(Boolean);
  };

  const resolveImg = (src) => {
    if (!src) return "/images/placeholder.png";
    if (typeof src !== "string") return "/images/placeholder.png";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    if (src.startsWith("/uploads") || src.startsWith("uploads")) {
      return backendOrigin + (src.startsWith("/") ? src : "/" + src);
    }
    return src;
  };

  const imgs = normalizeImages(product.images || product.image || product.imageUrl);
  const imgUrl = resolveImg(imgs[0]);

  const onAdd = (e) => { e.preventDefault(); e.stopPropagation(); addToCart(product, 1); alert("Added to cart"); };
  const onBuyNow = (e) => { e.preventDefault(); e.stopPropagation(); addToCart(product, 1); nav("/checkout"); };

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-thumb" style={{ backgroundImage: `url(${imgUrl})` }} />
      <div className="product-body">
        <h4 className="product-title">{product.name}</h4>
        <div className="product-price">
          <strong>₹{product.discount_price || product.price}</strong>
          {product.discount_price && <span className="muted"> <del>₹{product.price}</del></span>}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button className="btn small" onClick={onAdd} type="button">Add to cart</button>
          <button className="btn primary small" onClick={onBuyNow} type="button">Buy now</button>
        </div>
      </div>
    </Link>
  );
}