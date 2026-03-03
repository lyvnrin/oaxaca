import "./KitchenDashboard.css";

export default function KitchenDashboard() {
  return (
    <div className="kitchen-page">
      <header className="kitchen-nav">
        <div className="nav-brand">OAXACA</div>

        <div className="nav-icons">
          <button className="nav-icon" aria-label="Menu">
            ≡
          </button>
          <button className="nav-icon" aria-label="User">
            👤
          </button>
          <button className="nav-icon" aria-label="Notifications">
            🔔
          </button>
        </div>
      </header>

      <div className="kitchen-content">
        <div className="kitchen-board">
          <div className="kitchen-column">
            <div className="column-header">Pending Confirmation</div>

            <div className="order-card">
              <div className="order-pill">Order ###</div>

              <div className="order-row">
                <div className="row-left">
                  <div className="item-name">Item Name: xxxx</div>
                  <div className="qty-pill">Qty: 00</div>
                </div>
                <div className="row-price">£00.00</div>
              </div>

              <div className="order-row">
                <div className="row-left">
                  <div className="item-name">Item Name: xxxx</div>
                  <div className="qty-pill">Qty: 00</div>
                </div>
                <div className="row-price">£00.00</div>
              </div>

              <div className="order-notes">
                <div>Allergies: -----------</div>
                <div>Preferences: -----------</div>
              </div>

              <div className="order-total">
                <span>Total</span>
                <span>£00.00</span>
              </div>

              <div className="order-footer">
                <div className="order-id">
                  <div>Order ID</div>
                  <div>000000000</div>
                </div>

                <div className="order-actions">
                  <button className="cancel-btn">Cancel</button>
                  <button className="prepare-btn">Prepare</button>
                </div>
              </div>
            </div>
          </div>

          <div className="kitchen-column">
             <div className="column-header">Ready to Prepare</div>
           <div className="order-card">
             <div className="order-pill">Order ###</div>
             <div className="order-row">
                <div className="row-left">
                <div className="item-name">Item Name: xxxx</div>
                <div className="qty-pill">Qty: 00</div>
                 </div>
                <div className="row-price">£00.00</div>
                 </div>
          <div className="order-row">
             <div className="row-left">
             <div className="item-name">Item Name: xxxx</div>
            <div className="qty-pill">Qty: 00</div>
          </div>
            <div className="row-price">£00.00</div>
          </div>
          <div className="order-notes">
             <div>Allergies: -----------</div>
             <div>Preferences: -----------</div>
          </div>
          <div className="order-total">
              <span>Total</span>
              <span>£00.00</span>
          </div>
        <div className="order-footer">
        <div className="order-id">
          <div>Order ID</div>
          <div>000000000</div>
        </div>

        <div className="order-actions">
          <button className="cancel-btn">Cancel</button>
         <button className="prepare-btn">Ready For Service</button>
        </div>
      </div>
       </div>
     </div>

        <div className="kitchen-column">
          <div className="column-header">Ready To Deliver</div>

            <div className="order-card">
             <div className="order-pill">Order ###</div>

            <div className="order-row">
             <div className="row-left">
              <div className="item-name">Item Name: xxxx</div>
              <div className="qty-pill">Qty: 00</div>
             </div>
              <div className="row-price">£00.00</div>
            </div>

            <div className="order-row">
             <div className="row-left">
              <div className="item-name">Item Name: xxxx</div>
              <div className="qty-pill">Qty: 00</div>
             </div>
              <div className="row-price">£00.00</div>
              </div>
           </div>
            </div>
</div>
        {/* Bottom features/stats component */}
        <div className="kitchen-stats">
          <div className="stat-card">
            <div className="stat-label">Completed Orders</div>
            <div className="stat-value">0</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Active Orders</div>
            <div className="stat-value">0</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Urgent Orders</div>
            <div className="stat-value">0</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Average Completion Time</div>
            <div className="stat-value">00:00</div>
          </div>
        </div>
      </div>
    </div>
  );
}