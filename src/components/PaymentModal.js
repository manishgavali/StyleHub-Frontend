import React, { useState } from "react";

export default function PaymentModal({ open, onClose, amount, onSuccess }) {
  const [card, setCard] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const masked = (n) => n.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();

  if (!open) return null;

  const doPay = () => {
    if (!name || card.replace(/\s/g, "").length < 12 || !expiry || cvv.length < 3) {
      alert("Please fill valid card details (this is a dummy gateway).");
      return;
    }
    setLoading(true);
    // simulate network / payment processing
    setTimeout(() => {
      setLoading(false);
      const orderId = "ORD" + Date.now();
      onSuccess({ orderId, amount });
    }, 1800);
  };

  return (
    <div className="ph-modal-backdrop" onClick={() => !loading && onClose()}>
      <div className="ph-modal" onClick={(e) => e.stopPropagation()}>
        <button className="ph-close" onClick={() => !loading && onClose()}>✕</button>
        <h3>Pay ₹{amount} — Dummy Gateway</h3>

        <div className="ph-form">
          <label>Card holder</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full name" />

          <label>Card number</label>
          <input value={masked(card)} onChange={(e)=>setCard(e.target.value)} placeholder="1234 5678 9012 3456" />

          <div style={{display:"flex", gap:8}}>
            <div style={{flex:1}}>
              <label>Expiry</label>
              <input value={expiry} onChange={(e)=>setExpiry(e.target.value)} placeholder="MM/YY" />
            </div>
            <div style={{width:120}}>
              <label>CVV</label>
              <input value={cvv} onChange={(e)=>setCvv(e.target.value)} placeholder="123" />
            </div>
          </div>

          <button className="btn primary wide" onClick={doPay} disabled={loading}>
            {loading ? "Processing..." : `Pay ₹${amount}`}
          </button>

          <div className="ph-note">
            This is a dummy payment gateway for demo only. No real charges.
          </div>
        </div>
      </div>
    </div>
  );
}