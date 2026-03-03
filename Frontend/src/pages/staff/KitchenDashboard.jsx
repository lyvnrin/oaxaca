import "./KitchenDashboard.css";

export default function KitchenDashboard() {
  return (
    <div className="kitchen-page">
      {/* NAVBAR */}
      <header className="kitchen-nav">
        <div className="nav-brand">OAXACA</div>

        <div className="nav-icons">
          <button className="nav-icon">≡</button>
          <button className="nav-icon">👤</button>
          <button className="nav-icon">🔔</button>
        </div>
      </header>

      <div className="kitchen-content">
        <div className="kitchen-board">

          {/* Pending Confirmation */}
<div className="kitchen-column">
  <div className="column-header">Pending Confirmation</div>

  <div className="column-scroll">

    <div className="compact-card">
      <div className="table-title">Table XX</div>
      <div className="table-time">xx minutes ago</div>

      <div className="compact-row">
        <span>Item name</span>
        <span className="compact-qty">Qty: xx</span>
      </div>

      <div className="compact-row">
        <span>Item name</span>
        <span className="compact-qty">Qty: xx</span>
      </div>

      <button className="confirm-btn">Confirm Order</button>
    </div>

    <div className="compact-card">
      <div className="table-title">Table XX</div>
      <div className="table-time">xx minutes ago</div>

      <div className="compact-row">
        <span>Item name</span>
        <span className="compact-qty">Qty: xx</span>
      </div>

      <div className="compact-row">
        <span>Item name</span>
        <span className="compact-qty">Qty: xx</span>
      </div>

      <button className="confirm-btn">Confirm Order</button>
    </div>

    <div className="compact-card">
      <div className="table-title">Table XX</div>
      <div className="table-time">xx minutes ago</div>

      <div className="compact-row">
        <span>Item name</span>
        <span className="compact-qty">Qty: xx</span>
      </div>

      <button className="confirm-btn">Confirm Order</button>
    </div>

  </div>
</div>

          {/* Ready to Prepare */}
          <div className="kitchen-column">
            <div className="column-header">Ready to Prepare</div>

            <div className="column-scroll">

              {/* Card 1 */}
              <div className="compact-card">
                <div className="table-title">Table 01</div>
                <div className="table-time">5 minutes ago</div>

                <div className="compact-row">
                  <span>Tacos</span>
                  <span className="compact-qty">Qty: 2</span>
                </div>

                <div className="compact-row">
                  <span>Nachos</span>
                  <span className="compact-qty">Qty: 1</span>
                </div>

                <button className="prepare-btn">Prepare</button>
              </div>

              {/* Card 2 */}
              <div className="compact-card">
                <div className="table-title">Table 02</div>
                <div className="table-time">8 minutes ago</div>

                <div className="compact-row">
                  <span>Burrito</span>
                  <span className="compact-qty">Qty: 1</span>
                </div>

                <button className="prepare-btn">Prepare</button>
              </div>

              {/* Card 3 */}
              <div className="compact-card">
                <div className="table-title">Table 03</div>
                <div className="table-time">12 minutes ago</div>

                <div className="compact-row">
                  <span>Quesadilla</span>
                  <span className="compact-qty">Qty: 2</span>
                </div>

                <button className="prepare-btn">Prepare</button>
              </div>

              {/* Card 4 */}
              <div className="compact-card">
                <div className="table-title">Table 04</div>
                <div className="table-time">15 minutes ago</div>

                <div className="compact-row">
                  <span>Churros</span>
                  <span className="compact-qty">Qty: 3</span>
                </div>

                <button className="prepare-btn">Prepare</button>
              </div>

            </div>
          </div>

          {/* Ready For Service */}
          <div className="kitchen-column">
            <div className="column-header">Ready For Service</div>

            <div className="column-scroll">

              {/* Card 1 */}
              <div className="compact-card">
                <div className="table-title">Table 05</div>
                <div className="table-time">3 minutes ago</div>

                <div className="compact-row">
                  <span>Tacos</span>
                  <span className="compact-qty">Qty: 2</span>
                </div>

                <button className="delivered-btn">Delivered</button>
              </div>

              {/* Card 2 */}
              <div className="compact-card">
                <div className="table-title">Table 06</div>
                <div className="table-time">6 minutes ago</div>

                <div className="compact-row">
                  <span>Burrito</span>
                  <span className="compact-qty">Qty: 1</span>
                </div>

                <button className="delivered-btn">Delivered</button>
              </div>

              {/* Card 3 */}
              <div className="compact-card">
                <div className="table-title">Table 07</div>
                <div className="table-time">9 minutes ago</div>

                <div className="compact-row">
                  <span>Nachos</span>
                  <span className="compact-qty">Qty: 1</span>
                </div>

                <button className="delivered-btn">Delivered</button>
              </div>

              {/* Card 4 */}
              <div className="compact-card">
                <div className="table-title">Table 08</div>
                <div className="table-time">14 minutes ago</div>

                <div className="compact-row">
                  <span>Quesadilla</span>
                  <span className="compact-qty">Qty: 2</span>
                </div>

                <button className="delivered-btn">Delivered</button>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Stats */}
        <div className="kitchen-stats">
          <div className="stat-card stat-gray">
            <div className="stat-label">Completed Orders</div>
            <div className="stat-value">12</div>
          </div>

          <div className="stat-card stat-green">
            <div className="stat-label">Active Orders</div>
            <div className="stat-value">8</div>
          </div>

          <div className="stat-card stat-red">
            <div className="stat-label">Urgent Orders</div>
            <div className="stat-value">3</div>
          </div>

          <div className="stat-card stat-orange">
            <div className="stat-label">Average Completion Time</div>
            <div className="stat-value">18 min</div>
          </div>
        </div>

      </div>
    </div>
  );
}