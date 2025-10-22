import React, { useState } from "react";

export default function ProductFilter({ onChange, initial = {} }) {
  const [q, setQ] = useState(initial.q || "");
  const [sort, setSort] = useState("");

  const apply = () => onChange({ q, sort });

  return (
    <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:12 }}>
      <input
        value={q}
        onChange={e=> setQ(e.target.value)}
        placeholder="Search products, brands..."
        style={{ flex:1, padding:8, borderRadius:999, border:"1px solid #eee" }}
      />
      <select value={sort} onChange={e=> setSort(e.target.value)} style={{ padding:8, borderRadius:8 }}>
        <option value="">Sort</option>
        <option value="price_asc">Price ↑</option>
        <option value="price_desc">Price ↓</option>
      </select>
      <button className="btn secondary" onClick={apply}>Apply</button>
    </div>
  );
}