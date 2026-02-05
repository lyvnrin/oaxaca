import { useState } from "react";

function OrderSummary() {
  const [notes, setNotes] = useState("");

  const item1Price = 5;
  const item2Price = 3;

  const total = item1Price + item2Price;

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

      <p>ITEM 1  £{item1Price}</p>
      <p>ITEM 2  £{item2Price}</p>

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

      <br /><br />

      <button>CANCEL ORDER</button>
      <button>PLACE ORDER</button>
    </div>
  );
}

export default OrderSummary;
