import React, { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import ProductFilter from "../components/ProductFilter";
import { useLocation, useNavigate } from "react-router-dom";
import { ensureSeedLocalProducts } from "../utils/seedLocalProducts";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const loc = useLocation();
  const nav = useNavigate();

  const loadProducts = async () => {
    setLoading(true);
    try {
      // ensure seeder ran (creates localProducts if missing)
      const seeded = await ensureSeedLocalProducts();
      if (seeded && seeded.length) console.info("Loaded seeded products:", seeded.length);

      // try backend
      let apiProducts = [];
      try {
        const res = await API.get("/products");
        apiProducts = Array.isArray(res.data) ? res.data : [];
        console.info("Loaded API products:", apiProducts.length);
      } catch (err) {
        console.warn("API products load failed, using local products only.", err?.message || err);
        apiProducts = [];
      }

      // local products from localStorage
      const localProducts = JSON.parse(localStorage.getItem("localProducts") || "[]");
      console.info("Local products:", localProducts.length);

      // merged list (local first)
      const merged = [...localProducts, ...apiProducts];
      setProducts(merged);

      // categories
      const cats = Array.from(new Set(merged.map(p => (p.category || "Other").toString())));
      setCategories(cats);
    } catch (err) {
      console.error("loadProducts error", err);
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // read query param q
  useEffect(()=> {
    const qs = new URLSearchParams(loc.search);
    const q = qs.get("q") || "";
    if (q) setFilter(f => ({ ...f, q }));
  }, [loc.search]);

  const onFilter = (f) => {
    setFilter(f);
  };

  const filtered = products.filter(p => {
    const q = (filter.q || "").toString().toLowerCase();
    const byQ = !q || (p.name || "").toLowerCase().includes(q) || (p.brand || "").toLowerCase().includes(q);
    const byCat = !filter.category || filter.category === "all" || (p.category || "").toLowerCase() === filter.category.toLowerCase();
    return byQ && byCat;
  }).sort((a,b)=> {
    if (filter.sort === "price_asc") return (a.discount_price || a.price) - (b.discount_price || b.price);
    if (filter.sort === "price_desc") return (b.discount_price || b.price) - (a.discount_price || a.price);
    return 0;
  });

  return (
    <div className="container">
      <h2>Products</h2>

      <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:12 }}>
        <ProductFilter onChange={onFilter} initial={{ q: filter.q }} />
        <select onChange={e => setFilter(f => ({ ...f, category: e.target.value }))} value={filter.category || "all"} style={{ padding:8, borderRadius:8 }}>
          <option value="all">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="btn secondary" onClick={() => nav("/add-product")}>+ Add product</button>
        <button className="btn secondary" onClick={async () => {
          try {
            await API.post("/admin/seed");
            // refresh
            await loadProducts();
            alert("Server seeded with sample products");
          } catch (err) {
            alert("Seeding failed: " + (err?.message || "server error"));
          }
        }}>
          Seed DB (server)
        </button>
      </div>

      {loading ? (
        <div>Loading products...</div>
      ) : filtered.length === 0 ? (
        <div>
          <p>No products found.</p>
          <p>You can click "Seed 100 products" to populate sample items, or add a product manually via + Add product.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}