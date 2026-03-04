import { useState } from "react";
import "./KitchenDashboard.css";

const initialPending = [
  {
    id: 1,
    table: "Table 01",
    time: "5 minutes ago",
    items: [
      { name: "Tacos", qty: 2 },
      { name: "Nachos", qty: 1 },
    ],
  },
  {
    id: 2,
    table: "Table 02",
    time: "8 minutes ago",
    items: [{ name: "Burrito", qty: 1 }],
  },
  {
    id: 3,
    table: "Table 03",
    time: "12 minutes ago",
    items: [{ name: "Quesadilla", qty: 2 }],
  },
  {
    id: 4,
    table: "Table 04",
    time: "15 minutes ago",
    items: [{ name: "Churros", qty: 3 }],
  },
];

export default function KitchenDashboard() {
  const [pending, setPending] = useState(initialPending);
  const [prepare, setPrepare] = useState([]);
  const [service, setService] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(""), 1800);
  };

  const move = (from, setFrom, to, setTo, orderId, msg) => {
    const order = from.find((o) => o.id === orderId);
    if (!order) return;

    setFrom(from.filter((o) => o.id !== orderId));
    setTo([order, ...to]);
    showToast(msg);
  };

  const confirmOrder = (id) =>
    move(
      pending,
      setPending,
      prepare,
      setPrepare,
      id,
      "Confirmed → Ready to Prepare"
    );

  const prepareOrder = (id) =>
    move(
      prepare,
      setPrepare,
      service,
      setService,
      id,
      "Prepared → Ready for Service"
    );

  const deliveredOrder = (id) => {
    const order = service.find((o) => o.id === id);
    if (!order) return;

    setService(service.filter((o) => o.id !== id));
    setCompleted([order, ...completed]);
    showToast("Delivered ✅");
  };

  const activeCount = pending.length + prepare.length + service.length;

  return (
    <div className="kitchen-page">
      {/* NAVBAR */}
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
       
        {toast && <div className="toast">{toast}</div>}

        {/* BOARD */}
        <div className="kitchen-board">
          {/* Pending Confirmation */}
          <div className="kitchen-column">
            <div className="column-header">Pending Confirmation</div>

            <div className="column-scroll">
              {pending.map((o) => (
                <div className="compact-card" key={o.id}>
                  <div className="table-title">{o.table}</div>
                  <div className="table-time">{o.time}</div>

                  {o.items.map((it, idx) => (
                    <div className="compact-row" key={idx}>
                      <span>{it.name}</span>
                      <span className="compact-qty">Qty: {it.qty}</span>
                    </div>
                  ))}

                  <button
                    className="confirm-btn"
                    onClick={() => confirmOrder(o.id)}
                  >
                    Confirm Order
                  </button>
                </div>
              ))}

              {pending.length === 0 && (
                <div className="empty">No pending orders</div>
              )}
            </div>
          </div>

          {/* Ready to Prepare */}
          <div className="kitchen-column">
            <div className="column-header">Ready to Prepare</div>

            <div className="column-scroll">
              {prepare.map((o) => (
                <div className="compact-card" key={o.id}>
                  <div className="table-title">{o.table}</div>
                  <div className="table-time">{o.time}</div>

                  {o.items.map((it, idx) => (
                    <div className="compact-row" key={idx}>
                      <span>{it.name}</span>
                      <span className="compact-qty">Qty: {it.qty}</span>
                    </div>
                  ))}

                  <button
                    className="prepare-btn"
                    onClick={() => prepareOrder(o.id)}
                  >
                    Prepare
                  </button>
                </div>
              ))}

              {prepare.length === 0 && (
                <div className="empty">No orders to prepare</div>
              )}
            </div>
          </div>

          {/* Ready For Service */}
          <div className="kitchen-column">
            <div className="column-header">Ready For Service</div>

            <div className="column-scroll">
              {service.map((o) => (
                <div className="compact-card" key={o.id}>
                  <div className="table-title">{o.table}</div>
                  <div className="table-time">{o.time}</div>

                  {o.items.map((it, idx) => (
                    <div className="compact-row" key={idx}>
                      <span>{it.name}</span>
                      <span className="compact-qty">Qty: {it.qty}</span>
                    </div>
                  ))}

                  <button
                    className="delivered-btn"
                    onClick={() => deliveredOrder(o.id)}
                  >
                    Delivered
                  </button>
                </div>
              ))}

              {service.length === 0 && (
                <div className="empty">Nothing ready for service</div>
              )}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="kitchen-stats">
          <div className="stat-card stat-green">
            <div className="stat-label">Completed Orders</div>
            <div className="stat-value">{completed.length}</div>
          </div>

          <div className="stat-card stat-green">
            <div className="stat-label">Active Orders</div>
            <div className="stat-value">{activeCount}</div>
          </div>

          <div className="stat-card stat-green">
            <div className="stat-label">Urgent Orders</div>
            <div className="stat-value">0</div>
          </div>

          <div className="stat-card stat-green">
            <div className="stat-label">Average Completion Time</div>
            <div className="stat-value">00:00</div>
          </div>
        </div>
      </div>
    </div>
  );
}