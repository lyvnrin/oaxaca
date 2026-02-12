import { useState } from "react";

function OrderSummary() {
  const [notes, setNotes] = useState("");

  const item1Price = 5;
  const item2Price = 3;

  const [item1Qty, setItem1Qty] = useState(1);
  const [item2Qty, setItem2Qty] = useState(1);

  const total = item1Qty * item1Price + item2Qty * item2Price;

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
        padding: "20px"
      }}
    >
      <h2>ORDER SUMMARY</h2>

      {item1Qty > 0 && (
        <div>
          <p>
            ITEM 1 (£{item1Price}) &nbsp; Qty: {item1Qty}
          </p>
          <button onClick={removeItem1}>Remove</button>
        </div>
      )}

      {item2Qty > 0 && (
        <div>
          <p>
            ITEM 2 (£{item2Price}) &nbsp; Qty: {item2Qty}
          </p>
          <button onClick={removeItem2}>Remove</button>
        </div>
      )}

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
