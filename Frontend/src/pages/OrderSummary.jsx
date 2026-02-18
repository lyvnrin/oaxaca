import { useState } from "react";

function OrderSummary() {
  const [notes, setNotes] = useState("");
  const [showConfirm, setShowConfirm] = useState(false); // NEW

  const item1Price = 5;
  const item2Price = 3;

  const [item1Qty, setItem1Qty] = useState(1);
  const [item2Qty, setItem2Qty] = useState(1);

  const total = item1Qty * item1Price + item2Qty * item2Price;
  const orderEmpty = item1Qty === 0 && item2Qty === 0;

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
        backgroundColor: "#2b2b2b",
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        justifyContent: "center"
      }}
    >
      {/* phone-like card */}
      <div
        style={{
          width: "360px",
          backgroundColor: "lightgrey",
          minHeight: "100vh",
          padding: "18px",
          boxSizing: "border-box",
          position: "relative"
        }}
      >
        {/* Header bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "15px"
          }}
        >
          {/* Back arrow */}
          <button
            style={{
              border: "none",
              background: "transparent",
              fontSize: "20px",
              cursor: "pointer"
            }}
            onClick={() => setShowConfirm(true)} 
            aria-label="Back"
          >
            ←
          </button>

          {/* Company name */}
          <div style={{ fontWeight: "bold", fontSize: "18px" }}>
            OAXACA
          </div>

          {/* Call waiter */}
          <div style={{ fontSize: "12px", textAlign: "right" }}>
            <div style={{ fontWeight: "bold" }}>Call Waiter</div>
            <div>  07579 033233</div>
          </div>
        </div>

        <h2 style={{ textAlign: "center", marginTop: "0" }}>
          ORDER SUMMARY
        </h2>

        {/* Items */}
        {item1Qty > 0 && (
          <div style={{ marginBottom: "16px" }}>
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

        {item2Qty > 0 && (
          <div style={{ marginBottom: "16px" }}>
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
          style={{ width: "100%", boxSizing: "border-box" }}
        />

        <br />
        <br />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            style={{ width: "48%" }}
            onClick={() => alert("Cancelled")}
          >
            CANCEL ORDER
          </button>

          <button
            style={{ width: "48%" }}
            disabled={orderEmpty}
            onClick={() => alert("Placed")}
          >
            PLACE ORDER
          </button>
        </div>

        {/* Back Confirmation Popup */}
        {showConfirm && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                textAlign: "center",
                width: "80%"
              }}
            >
              <p style={{ fontWeight: "bold" }}>
                Are you sure you want to go back?
              </p>
              <p>Your current order will be lost.</p>

              <button onClick={() => setShowConfirm(false)}>
                Cancel
              </button>

              <button
                style={{ marginLeft: "10px" }}
                onClick={() => {
                  alert("Going back...");
                  setShowConfirm(false);
                }}
              >
                Yes, Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderSummary;
