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

const TODAY = new Date().toLocaleDateString("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export default function KitchenDashboard() {
  const [pending, setPending] = useState(initialPending);
  const [prepare, setPrepare] = useState([]);
  const [service, setService] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [showProfile, setShowProfile] = useState(false);

  const move = (from, setFrom, to, setTo, orderId, msg) => {
    const order = from.find((o) => o.id === orderId);
    if (!order) return;
    setFrom(from.filter((o) => o.id !== orderId));
    setTo([order, ...to]);
  };

  const confirmOrder = (id) =>
    move(
      pending,
      setPending,
      prepare,
      setPrepare,
      id,
    );

  const prepareOrder = (id) =>
    move(
      prepare,
      setPrepare,
      service,
      setService,
      id
    );

  const deliveredOrder = (id) => {
    const order = service.find((o) => o.id === id);
    if (!order) return;
    setService(service.filter((o) => o.id !== id));
    setCompleted([order, ...completed]);
  };

  const activeCount = pending.length + prepare.length + service.length;

  return (
    <div className="kitchen-page" onClick={() => setShowProfile(false)}>
      {/* NAVBAR */}
      <header className="kitchen-nav">
        <div className="nav-brand">O A X A C A</div>
        <div className="nav-icons">
          <span className="nav-kitchen-label">KITCHEN VIEW</span>
        <div
          className="nav-avatar"
          onClick={(e) => { e.stopPropagation(); setShowProfile(!showProfile); }}
        >
          AK
          {showProfile && (
            <div className="nav-profile-dropdown" onClick={(e) => e.stopPropagation()}>
              <div className="nav-profile-header">
                <div className="nav-profile-avatar">AK</div>
                  <div>
                    <div className="nav-profile-name">Aisha K.</div>
                    <div className="nav-profile-email">aisha.k@oaxaca.com</div>
                    <div className="nav-profile-role">HEAD CHEF</div>
                  </div>
                </div>
                <button className="nav-signout-btn">→ Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="kitchen-content">
        {/* PAGE HEADER */}
        <div className="kitchen-page-header">
            <h1 className="kitchen-title">Kitchen Dashboard</h1>
            <p className="kitchen-date">{TODAY}</p>
        </div>
        <div className="kitchen-header-right">
            <div className="active-orders-box">
              <div className="active-orders-label">ACTIVE ORDERS</div>
              <div className="active-orders-count">{activeCount}</div>
            </div>
            <div className="live-pill">
              <span className="live-dot" /> LIVE
            </div>
          </div>
        </div>


        {/* BOARD */}
        <div className="kitchen-board">
          {/* Pending Confirmation */}
          <div className="kitchen-column kitchen-column--pending">
            <div className="column-header">
              <span>Pending Confirmation</span>
              <span className="column-badge column-badge--amber">
                {pending.length} {pending.length === 1 ? "order" : "orders"}
                </span>
            </div>
            <div className="column-scroll">
              {pending.map((o) => (
                <div className="compact-card" key={o.id}>
                  <div className="compacy-card-header">
                    <span className="table-title">{o.table}</span>
                    <span className="table-time">{o.time}</span>
                  </div>
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
                    CONFIRM ORDER
                  </button>
                </div>
              ))}

              {pending.length === 0 && (
                <div className="empty">No pending orders</div>
              )}
            </div>
          </div>

          {/* Ready to Prepare */}
          <div className="kitchen-column kitchen-column--preparing">
            <div className="column-header">
              <span>Preparing</span>
              <span className="column-badge column-badge--olive">
                {prepare.length} {prepare.length === 1 ? "order" : "orders"}
              </span>
            </div>
            <div className="column-scroll">
              {prepare.map((o) => (
                <div className="compact-card" key={o.id}>
                  <div className= "compact-card-header">
                    <span className="table-title">{o.table}</span>
                    <span className="table-time">⏱ {o.time}</span>
                  </div>
                  {o.items.map((it, idx) => (
                    <div className="compact-row" key={idx}>
                      <span>{it.name}</span>
                      <span className="compact-qty">×{it.qty}</span>
                    </div>
                  ))}

                  <button
                    className="prepare-btn"
                    onClick={() => prepareOrder(o.id)}
                  >
                    NOTIFY WAITER
                  </button>
                </div>
              ))}

              {prepare.length === 0 && (
                <div className="empty">No orders preparing</div>
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