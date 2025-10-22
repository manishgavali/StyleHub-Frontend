import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const { cart, updateQty, remove, clear } = useContext(CartContext);
  const total = cart.reduce((s,p) => s + (p.discount_price || p.price) * p.qty, 0);
  return (
    <div className="container">
      <h2>Cart</h2>
      {cart.length === 0 ? <p>Cart is empty</p> :
        <>
          {cart.map(item => (
            <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <img src={item.images?.[0] || "/images/placeholder.png"} style={{ width: 60 }} alt="" />
              <div>{item.name}</div>
              <input type="number" value={item.qty} onChange={e => updateQty(item.id, Number(e.target.value))} style={{ width: 60 }} />
              <button onClick={()=> remove(item.id)}>Remove</button>
            </div>
          ))}
          <hr/>
          <div>Total: ₹{total}</div>
          <button onClick={clear}>Clear Cart</button>
        </>
      }
    </div>
  );
}