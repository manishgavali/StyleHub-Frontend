import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [sizes, setSizes] = useState("");
  const [colors, setColors] = useState("");
  const [stock, setStock] = useState(0);
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFileChange = (e) => {
    const f = Array.from(e.target.files || []);
    setFiles(f);
    // preview first 4 images
    const p = f.slice(0, 6).map(file => URL.createObjectURL(file));
    setPreview(p);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      alert("Name and price required");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("name", name.trim());
      form.append("description", desc);
      form.append("price", price);
      if (discount) form.append("discount_price", discount);
      form.append("category", category);
      form.append("brand", brand);
      form.append("sizes", sizes); // comma separated
      form.append("colors", colors); // comma separated
      form.append("stock", String(stock));

      files.forEach((f) => form.append("images", f));

      const res = await API.post("/products", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data) {
        alert("Product saved to server");
        navigate("/products");
      } else {
        alert("Unexpected server response");
      }
    } catch (err) {
      console.error("AddProduct error:", err);
      alert("Failed to save product: " + (err?.message || "server error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 760 }}>
      <h2>Add Product</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Brand" value={brand} onChange={e => setBrand(e.target.value)} />
        <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
        <textarea placeholder="Short description" value={desc} onChange={e => setDesc(e.target.value)} />
        <div style={{ display: "flex", gap: 8 }}>
          <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
          <input placeholder="Discount price (optional)" value={discount} onChange={e => setDiscount(e.target.value)} />
          <input placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} />
        </div>
        <input placeholder="Sizes (comma separated: S,M,L)" value={sizes} onChange={e => setSizes(e.target.value)} />
        <input placeholder="Colors (comma separated or hex)" value={colors} onChange={e => setColors(e.target.value)} />

        <div>
          <label>Images (multiple)</label>
          <input type="file" accept="image/*" multiple onChange={onFileChange} />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {preview.map((src, i) => <img key={i} src={src} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }} />)}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" type="submit" disabled={loading}>{loading ? "Saving..." : "Save product"}</button>
          <button className="btn secondary" type="button" onClick={() => {
            setName(""); setDesc(""); setPrice(""); setDiscount(""); setCategory(""); setBrand(""); setSizes(""); setColors(""); setFiles([]); setPreview([]); setStock(0);
          }}>Clear</button>
        </div>
      </form>
    </div>
  );
}