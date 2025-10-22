import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { CartContext } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  const backendOrigin = (API.defaults?.baseURL || process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/api\/?$/, "");
  const normalizeImages = (imgs) => {
    if (!imgs) return [];
    if (typeof imgs === "string") {
      try { imgs = JSON.parse(imgs); } catch (e) { imgs = [imgs]; }
    }
    if (!Array.isArray(imgs)) imgs = [imgs];
    return imgs.filter(Boolean).map(src => {
      if (typeof src !== "string") return "";
      if (src.startsWith("http://") || src.startsWith("https://")) return src;
      if (src.startsWith("/uploads") || src.startsWith("uploads")) {
        return backendOrigin + (src.startsWith("/") ? src : "/" + src);
      }
      return src;
    });
  };

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(res => {
        const p = res.data || {};
        p.images = normalizeImages(p.images);
        setProduct(p);
      })
      .catch((err) => {
        console.error("Product load error:", err);
        setProduct(null);
      });
  }, [id]);

  if (!product) return <div className="container">Loading...</div>;

  const handleAdd = () => { addToCart(product, Number(qty) || 1); alert("Added to cart"); };
  const handleBuy = () => { addToCart(product, Number(qty) || 1); nav("/checkout"); };

  return (
    <div className="container">
      <div className="product-detail">
        <div className="gallery">
          {(product.images || []).map((src, i) => (
            <img key={i} src={src || "/images/placeholder.png"} alt={product.name} style={{ maxWidth: 320, marginRight: 8 }} />
          ))}
        </div>

        <div className="info">
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <div className="price">
            <strong>₹{product.discount_price || product.price}</strong>
            {product.discount_price && <span className="muted"> <del>₹{product.price}</del></span>}
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
            <label>
              Qty:
              <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} style={{ width: 72, marginLeft: 8 }} />
            </label>
            <button className="btn" onClick={handleAdd} type="button">Add to cart</button>
            <button className="btn primary" onClick={handleBuy} type="button">Buy now</button>
          </div>
        </div>
      </div>
    </div>
  );
}