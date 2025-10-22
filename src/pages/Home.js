import React, { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [trending, setTrending] = useState([]);

  useEffect(()=> {
    API.get("/products").then(r => setTrending(r.data.slice(0,12))).catch(()=>{});
  }, []);

  return (
    <div>
      <div className="hero container">
        <div className="text">
          <h1>Discover your style — curated fashion</h1>
          <p>Top brands, exclusive deals and fast delivery. Shop the look.</p>
        </div>
        <div style={{ width:160, textAlign:"center" }}>
          <img src="/images/hero_shoe.png" alt="hero" style={{ width: "100%" }} />
        </div>
      </div>

      <div className="container">
        <h2 style={{ marginTop:12 }}>Trending</h2>
        <div className="product-grid">
          {trending.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}