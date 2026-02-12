import { useState } from "react";

function OrderSummary() {
  const [notes, setNotes] = useState("");

  const item1Price = 5;
  const item2Price = 3;

  const [item1Qty, setItem1Qty] = useState(1);
  const [item2Qty, setItem2Qty] = useState(1);

  const total = item1Qty * item1Price + item2Qty * item2Price;
  const orderEmpty = item1Qty === 0 && item2Qty === 0;

  // Quantity controls
  function decItem1() {
    if (item1Qty > 0) setItem1Qty(item1Qty - 1);
  }
  function incItem1() {
    setItem1Qty(item1Qty + 1);
  }

  function decItem2() {
    if (item2Qty > 0) setItem2Qty(item2Qty - 1);
  }
  function incItem2() {
    setItem2Qty(item2Qty + 1);
  }

  // Remove item
  function removeItem1() {
    setItem1Qty(0);
  }
  function removeItem2() {
    setItem2Qty(0);
  }

  return (
    <div
      style={{
        fontFamily: "Arial",
        backgroundColor: "lightgrey",
        minHeight: "100vh",
        padding: "20px",
        textAlign: "center"
      }}
    >
      <h2>ORDER SUMMARY</h2>

      {/* ITEM 1 */}
      {item1Qty > 0 && (
        <div style={{ marginBottom: "18px" }}>
          <p>
            ITEM 1 (£{item1Price}) &nbsp; Qty: {item1Qty}
          </p>

          <button onClick={decItem1}>-</button>
          <button onClick={incItem1} style={{ marginLeft: "8px" }}>
            +
          </button>

          <button onClick={removeItem1} style={{ marginLeft: "12px" }}>
            Remove
          </button>
        </div>
      )}

      {/* ITEM 2 */}
      {item2Qty > 0 && (
        <div style={{ marginBottom: "18px" }}>
          <p>
            ITEM 2 (£{item2Price}) &nbsp; Qty: {item2Qty}
          </p>

          <button onClick={decItem2}>-</button>
          <button onClick={incItem2} style={{ marginLeft: "8px" }}>
            +
          </button>

          <button onClick={removeItem2} style={{ marginLeft: "12px" }}>
            Remove
          </button>
        </div>
      )}

      {orderEmpty && <p>Your order is empty.</p>}

      <p>
        <b>Total: £{total}</b>
      </p>

      <p>Additional Notes:</p>
      <textarea
        rows="3"
        cols="35"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <br />
      <br />

      <button style={{ marginRight: "10px" }}>CANCEL ORDER</button>
      <button disabled={orderEmpty}>PLACE ORDER</button>
    </div>
  );
}

export default OrderSummary;
