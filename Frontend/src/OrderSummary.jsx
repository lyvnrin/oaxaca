import { useState } from "react";

function OrderSummary() {
  const [notes, setNotes] = useState("");

  const item1Price = 5;
  const item2Price = 3;

  const [item1Qty, setItem1Qty] = useState(1);
  const [item2Qty, setItem2Qty] = useState(1);

  const total = item1Qty * item1Price + item2Qty * item2Price;

  function decreaseItem1() {
    if (item1Qty > 0) setItem1Qty(item1Qty - 1);
  }

  function increaseItem1() {
    setItem1Qty(item1Qty + 1);
  }

  function decreaseItem2() {
    if (item2Qty > 0) setItem2Qty(item2Qty - 1);
  }

  function increaseItem2() {
    setItem2Qty(item2Qty + 1);
  }

  return (
    <div
      style={{
        fontFamily: "Arial",
        backgroundColor: "lightgrey",
        minHeight: "100vh",
        padding: "20px"
      }}
    >
      <h2>ORDER SUMMARY</h2>

      <div style={{ marginBottom: "10px" }}>
        <p>
          ITEM 1 (£{item1Price}) &nbsp; Qty: {item1Qty}
        </p>
        <button onClick={decreaseItem1}>-</button>
        <button onClick={increaseItem1} style={{ marginLeft: "8px" }}>
          +
        </button>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <p>
          ITEM 2 (£{item2Price}) &nbsp; Qty: {item2Qty}
        </p>
        <button onClick={decreaseItem2}>-</button>
        <button onClick={increaseItem2} style={{ marginLeft: "8px" }}>
          +
        </button>
      </div>

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

      <button>CANCEL ORDER</button>
      <button>PLACE ORDER</button>
    </div>
  );
}

export default OrderSummary;
