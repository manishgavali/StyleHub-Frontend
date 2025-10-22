import React, { useContext, useMemo, useState } from "react";
import { CartContext } from "../context/CartContext";
import PaymentModal from "../components/PaymentModal";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, updateQty, removeFromCart, clearCart } = useContext(CartContext);
  const nav = useNavigate();
  const [showPay, setShowPay] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);

  const subtotal = useMemo(() => cart.reduce((s, p) => s + (Number(p.discount_price || p.price) * (p.qty || 1)), 0), [cart]);
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const handlePaySuccess = ({ orderId, amount }) => {
    // record order client-side (could POST to backend here)
    setOrderInfo({ orderId, amount, date: new Date().toISOString() });
    setShowPay(false);
    clearCart();
    // navigate to a simple confirmation screen (same page shows confirmation)
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="container checkout-empty">
        <h2>Your cart is empty</h2>
        <p>Add items and use the beautiful checkout to buy them.</p>
        <button className="btn primary" onClick={()=>nav("/products")}>Shop now</button>
      </div>
    );
  }

  return (
    <div className="container checkout-page">
      <h2>Checkout</h2>

      {!orderInfo ? (
        <div className="checkout-grid">
          <div className="checkout-left">
            <div className="card">
              <h3>Billing & Delivery</h3>
              <div className="placeholder-address">
                <p><strong>Demo Customer</strong></p>
                <p>123 Demo Street, Your City</p>
                <p>State • PIN 000000</p>
                <button className="btn secondary small">Change address</button>
              </div>
            </div>

            <div className="card">
              <h3>Order items</h3>
              {cart.map(item => (
                <div key={item.id} className="checkout-item">
                  <img src={(item.images && item.images[0]) || item.image || "/images/placeholder.png"} alt={item.name} />
                  <div className="ci-body">
                    <div className="ci-title">{item.name}</div>
                    <div className="ci-meta">{item.brand} • {item.sizes && item.sizes[0]}</div>
                    <div className="ci-actions">
                      <label>Qty:
                        <input type="number" min="1" value={item.qty || 1} onChange={(e)=> updateQty(item.id, Math.max(1, Number(e.target.value)))} />
                      </label>
                      <button className="link" onClick={() => removeFromCart(item.id)}>Remove</button>
                    </div>
                  </div>
                  <div className="ci-price">₹{item.discount_price || item.price}</div>
                </div>
              ))}
            </div>
          </div>

          <aside className="checkout-right card">
            <h3>Payment summary</h3>
            <div className="summary-row"><span>Subtotal</span><b>₹{subtotal}</b></div>
            <div className="summary-row"><span>Shipping</span><b>{shipping === 0 ? "FREE" : `₹${shipping}`}</b></div>
            <div className="summary-row"><span>Tax</span><b>₹{tax}</b></div>
            <div className="summary-row total"><span>Total</span><b>₹{total}</b></div>

            <div style={{marginTop:12}}>
              <button className="btn primary wide" onClick={() => setShowPay(true)}>Pay ₹{total} — Pay now</button>
              <button className="btn secondary wide" onClick={() => { alert("Simulated UPI/Wallet flow (demo)"); setShowPay(true); }}>Pay with UPI / Wallet</button>
            </div>

            <div style={{marginTop:12, fontSize:13, color:"#666"}}>
              You will be redirected to a dummy gateway for demo payments. No real charges.
            </div>
          </aside>
        </div>
      ) : (
        <div className="order-confirm">
          <h3>Payment successful</h3>
          <p>Order ID: <strong>{orderInfo.orderId}</strong></p>
          <p>Amount paid: <strong>₹{orderInfo.amount}</strong></p>
          <p>We have emailed the receipt (demo).</p>
          <div style={{display:"flex", gap:8, marginTop:12}}>
            <button className="btn primary" onClick={()=>nav("/products")}>Continue shopping</button>
            <button className="btn secondary" onClick={()=>nav("/profile")}>View profile</button>
          </div>
        </div>
      )}

      <PaymentModal open={showPay} amount={total} onClose={() => setShowPay(false)} onSuccess={handlePaySuccess} />
    </div>
  );
}