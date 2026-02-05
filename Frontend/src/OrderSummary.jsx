function OrderSummary() {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "lightgrey",
        minHeight: "100vh",
        padding: "20px"
      }}
    >
      <h2>ORDER SUMMARY</h2>

      <p>ITEM 1 x1 £5</p>
      <p>ITEM 2 x2 £3</p>

      <p><strong>Total: £11</strong></p>

      <p>Additional Notes:</p>
      <textarea rows="3"></textarea>

      <br /><br />

      <button>CANCEL ORDER</button>
      <button>PLACE ORDER</button>
    </div>
  );
}

export default OrderSummary;
