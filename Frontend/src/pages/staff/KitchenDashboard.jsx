import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

// COLOUR PALETTE --------------------------
const C = {
  bg: "#f5f0e8", panel: "#faf7f2", dark: "#2D2218", mid: "#8b4513",
  warm: "#c4763a", light: "#e8d5b7", pale: "#f0e6d3",
  green: "#4a7c59", greenL: "#d4edda",
  red: "#c0392b", redL: "#fde8e6",
  amber: "#d4870e",
  text: "#2c1810", muted: "#7a5c44", border: "#d4b896",
};

const now = () => Date.now();

// HOOKS --------------------------
function useOutsideClick(ref, cb) {
  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) cb(); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [ref, cb]);
}

// ELASPED TIME HELPERS --------------------------
function getElapsed(startedAt) {
  const mins = Math.floor((Date.now() - startedAt) / 60000);
  if (mins < 1) return "< 1 min";
  if (mins < 60) return `${mins} min${mins !== 1 ? "s" : ""}`;
  const h = Math.floor(mins / 60), m = mins % 60;
  return `${h}h ${m}m`;
}

function elapsedColor(startedAt) {
  const mins = Math.floor((Date.now() - startedAt) / 60000);
  return mins > 20 ? C.red : mins > 10 ? C.amber : C.green;
}

// ICONS --------------------------
const IconClock = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconDoor = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// NOTIFICATIONS PANEL --------------------------
const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

function NotificationsPanel({ notifications, setNotifications }) {
  const unread = notifications.filter(n => !n.read).length;
  const markRead = id => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  const dismiss = id => setNotifications(p => p.filter(n => n.id !== id));
  const markAll = () => setNotifications(p => p.map(n => ({ ...n, read: true })));
  const clearAll = () => setNotifications([]);

  const typeColor = { alert: C.red, customer: C.warm };

  return (
    <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, width: 360, background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,.2)", zIndex: 900, animation: "dropIn .15s ease" }}>
      <div style={{ padding: "13px 16px 10px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, color: C.dark }}>Alerts</span>
          {unread > 0 && <span style={{ background: C.red, color: "white", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 10 }}>{unread}</span>}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {unread > 0 && <button onClick={markAll} style={{ fontSize: 10, color: C.mid, background: "none", border: "none", cursor: "pointer", fontFamily: "Jost, sans-serif", fontWeight: 600 }}>Mark all read</button>}
          {notifications.length > 0 && <button onClick={clearAll} style={{ fontSize: 10, color: C.muted, background: "none", border: "none", cursor: "pointer", fontFamily: "Jost, sans-serif" }}>Clear all</button>}
        </div>
      </div>
      <div style={{ maxHeight: 340, overflowY: "auto" }}>
        {notifications.length === 0 && (
          <div style={{ padding: "28px 16px", textAlign: "center", color: C.muted, fontSize: 13 }}>No alerts</div>
        )}
        {notifications.map(n => (
          <div key={n.id} onClick={() => markRead(n.id)}
            style={{ padding: "11px 16px", borderBottom: `1px solid ${C.pale}`, display: "flex", gap: 10, cursor: "pointer", background: n.read ? "transparent" : "rgba(196,118,58,.04)" }}
            onMouseEnter={e => e.currentTarget.style.background = C.pale}
            onMouseLeave={e => e.currentTarget.style.background = n.read ? "transparent" : "rgba(196,118,58,.04)"}>
            <div style={{ width: 3, borderRadius: 2, background: typeColor[n.type] ?? C.warm, flexShrink: 0, alignSelf: "stretch" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: n.read ? 400 : 700, color: C.text }}>Table {n.table} — Order #{n.order}</div>
              <p style={{ fontSize: 11, color: typeColor[n.type] ?? C.warm, marginTop: 3, fontWeight: 600 }}>{n.status}</p>
              {n.customerMessage && (
                <p style={{ fontSize: 11, color: C.muted, marginTop: 3, fontStyle: "italic" }}>"{n.customerMessage}"</p>
              )}
            </div>
            {!n.read && <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.warm, flexShrink: 0, marginTop: 4 }} />}
            <button onClick={e => { e.stopPropagation(); dismiss(n.id); }} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14, flexShrink: 0 }}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ACCOUNT PANEL --------------------------
function AccountPanel({ addToast, staffInfo }) {
  const initials = staffInfo?.name ? staffInfo.name.slice(0, 2).toUpperCase() : "??";
  const displayName = staffInfo?.name ?? "Unknown";
  const role = staffInfo?.role ?? "Kitchen Staff";

  return (
    <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, width: 240, background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,.2)", zIndex: 900, animation: "dropIn .15s ease" }}>
      <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: C.green, display: "grid", placeItems: "center", color: "white", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{displayName}</div>
          <div style={{ fontSize: 11, color: C.muted }}>{staffInfo?.username ?? displayName.toLowerCase()}@oaxaca.com</div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: C.mid, marginTop: 2 }}>{role}</div>
        </div>
      </div>
      <div onClick={async () => {
        if (staffInfo?.staff_id) {
          await fetch(`http://127.0.0.1:8000/auth/logout/${staffInfo.staff_id}`, { method: 'POST' }).catch(() => { });
        }
        window.location.href = "/";
      }}
        style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "background .15s", borderRadius: "0 0 10px 10px" }}
        onMouseEnter={e => e.currentTarget.style.background = C.redL}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
        <IconDoor /><span style={{ fontSize: 13, fontWeight: 600, color: C.red }}>Sign Out</span>
      </div>
    </div>
  );
}

// ORDER CARD --------------------------
function OrderCard({ order, btnLabel, btnColor, onAction }) {
  const [, tick] = useState(0);
  useEffect(() => { const t = setInterval(() => tick(n => n + 1), 30000); return () => clearInterval(t); }, []);

  const elapsedMins = Math.floor((Date.now() - order.startedAt) / 60000);
  const remaining = Math.max(0, (order.estMins ?? 15) - elapsedMins);
  const overdue = elapsedMins > (order.estMins ?? 15);

  return (
    <div style={{ background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", marginBottom: 10, transition: "box-shadow .15s" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 3px 12px rgba(0,0,0,.08)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = ""}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, color: C.dark }}>{order.table}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: elapsedColor(order.startedAt), display: "flex", alignItems: "center", gap: 3 }}>
          <IconClock />{getElapsed(order.startedAt)}
        </span>
      </div>

      {/* PREP TIME INDICATOR */}
      <div style={{
        fontSize: 10, fontWeight: 600, marginBottom: 8,
        color: overdue ? C.red : remaining <= 5 ? C.amber : C.green, }}>
        {overdue ? `⚠ ${elapsedMins - order.estMins}m overdue (est. ${order.estMins}m)` : `~${remaining}m remaining · est. ${order.estMins}m total`}
      </div>

      {order.items.map((it, i) => (
        <div key={i} style={{ padding: "6px 0", borderBottom: `1px solid ${C.pale}`, fontSize: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ color: C.text }}>{it.name}</span>
            <span style={{ fontWeight: 600, color: C.muted, fontSize: 11 }}>×{it.qty}</span>
          </div>
          {it.note && (
            <p style={{ marginTop: 4, fontSize: 11, color: C.amber, fontStyle: "italic" }}>
              {it.note}
            </p>
          )}
        </div>
      ))}

      {btnLabel && (
        <button onClick={() => onAction(order.id)}
          style={{ marginTop: 10, width: "100%", padding: "8px 12px", border: "none", borderRadius: 6, background: btnColor, color: "white", fontFamily: "Jost, sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", cursor: "pointer", transition: "opacity .15s" }}
          onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
          {btnLabel}
        </button>
      )}
      {!btnLabel && (
        <div style={{ marginTop: 10, fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: C.green, textAlign: "center", padding: "6px 0" }}>
          Awaiting collection by waiter
        </div>
      )}
    </div>
  );
}

// CUSTOMER ASSISTANCE ALERT
function useCustomerAlerts(setNotifications, addToast) {
  const cbRef = useRef({ setNotifications, addToast });
  useEffect(() => { cbRef.current = { setNotifications, addToast }; });

  useEffect(() => {
    const handler = (e) => {
      if (e.key !== "oaxaca_customer_alert" || !e.newValue) return;
      try {
        const incoming = JSON.parse(e.newValue);
        cbRef.current.setNotifications(prev => {
          if (prev.some(n => n.id === incoming.id)) return prev;
          return [incoming, ...prev];
        });
        addToast(`Table ${incoming.table} needs assistance!`);
      } catch (_) { }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);
}

function useWaiterAlerts(setNotifications, addToast) {
  const cbRef = useRef({ setNotifications, addToast });
  useEffect(() => { cbRef.current = { setNotifications, addToast }; });

  useEffect(() => {
    const handler = (e) => {
      if (e.key !== "oaxaca_waiter_alert" || !e.newValue) return;
      try {
        const incoming = JSON.parse(e.newValue);
        cbRef.current.setNotifications(prev => {
          if (prev.some(n => n.id === incoming.id)) return prev;
          return [incoming, ...prev];
        });
        cbRef.current.addToast(`🚨 Table ${incoming.table} — ${incoming.raisedBy ?? "A waiter"} needs team assistance!`);
      } catch (_) { }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);
}


// APP ROOT --------------------------
export default function App() {
  // AUTH GUARD --------------------------
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.role !== 'kitchen' && sessionStorage.getItem('role') !== 'kitchen') {
      navigate('/');
    }
  }, []);

  // DB CONNECTIONS + POLLING --------------------------
  const [pending, setPending] = useState([]);
  const [preparing, setPreparing] = useState([]);
  const [ready, setReady] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch('http://127.0.0.1:8000/orders');
      const data = await res.json();

      const mapItems = (o) => o.items.map(i => {
        const mods = JSON.parse(
            localStorage.getItem(`oaxaca_customisations_${o.order_id}`) || '{}'
        );
        return {
            name: i.item_name,
            qty: i.quantity,
            price: i.price,
            note: mods[i.item_name] || null,
            prepTime: i.prep_time_mins,
        };
      });

      setPending(data.filter(o => o.status === "Waiter Confirmed").map(o => ({
        id: String(o.order_id),
        table: `Table ${o.table_id}`,
        startedAt: Date.now(),
        estMins: o.est_mins ?? 15,
        items: mapItems(o),
      })));

      setPreparing(data.filter(o => o.status === "In Progress").map(o => ({
        id: String(o.order_id),
        table: `Table ${o.table_id}`,
        startedAt: Date.now(),
         estMins: o.est_mins ?? 15,
        items: mapItems(o),
      })));

      setReady(data.filter(o => o.status === "Ready").map(o => ({
        id: String(o.order_id),
        table: `Table ${o.table_id}`,
        startedAt: Date.now(),
        estMins: o.est_mins ?? 15,
        items: mapItems(o),
      })));
    };
    fetchOrders();
    const poll = setInterval(fetchOrders, 3000);
    return () => clearInterval(poll);
  }, []);

  // UI STATE --------------------------
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const accountRef = useRef(null);
  const notifRef = useRef(null);
  useOutsideClick(accountRef, () => setShowAccount(false));
  useOutsideClick(notifRef, () => setShowNotifs(false));

  // TOAST NOTIFS --------------------------
  const addToast = msg => { const id = Date.now(); setToasts(p => [...p, { id, msg }]); setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 1800); };
  useWaiterAlerts(setNotifications, addToast);

  // ORDER ACTIONS --------------------------
  const confirmOrder = async (id) => {
    const order = pending.find(o => o.id === id);
    if (!order) return;
    setPending(p => p.filter(o => o.id !== id));
    setPreparing(p => [order, ...p]);
    await fetch(`http://127.0.0.1:8000/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: "In Progress" }),
    });
    addToast(`${order.table} confirmed`);
  };

  const notifyWaiter = async (id) => {
    const order = preparing.find(o => o.id === id);
    if (!order) return;
    setPreparing(p => p.filter(o => o.id !== id));
    setReady(p => [order, ...p]);
    await fetch(`http://127.0.0.1:8000/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: "Ready" }),
    });

    // CROSS-TAB NOTIFS TO WAITER DASH --------------------------
    localStorage.setItem("oaxaca_kitchen_notify", JSON.stringify({
      id: Date.now(),
      order: id,
      table: parseInt(order.table.replace("Table ", "")),
      status: "Ready for Collection",
      type: "ready",
      read: false,
    }));
    addToast(`${order.table} — waiter notified`);
  };

  // 3-COLUMN LAYOUT (KANBAN)
  const activeCount = pending.length + preparing.length + ready.length;
  const columns = [
    { title: "Pending Confirmation", accent: C.warm, orders: pending, btnLabel: "Confirm Order", btnColor: C.warm, onAction: confirmOrder, empty: "No pending orders" },
    { title: "Preparing", accent: C.amber, orders: preparing, btnLabel: "Notify Waiter", btnColor: C.green, onAction: notifyWaiter, empty: "Nothing being prepared" },
    { title: "Ready for Service", accent: C.green, orders: ready, btnLabel: null, btnColor: null, onAction: null, empty: "Nothing ready yet" },
  ];

  // LOGIN VALIDATION
  const [staffInfo, setStaffInfo] = useState(null);
  const staffId = location.state?.staff_id ?? sessionStorage.getItem('staff_id');

  useEffect(() => {
    if (!staffId) return;
    fetch(`http://127.0.0.1:8000/staff/${staffId}`)
      .then(r => r.json())
      .then(data => {
        const raw = data.name ?? "";
        const formatted = raw
          .replace(/([A-Z])/g, ' $1')
          .trim()
          .replace(/^./, c => c.toUpperCase());
        setStaffInfo({ ...data, name: formatted, username: data.name });
      })
      .catch(() => { });
  }, []);

  return (
    <div style={{ fontFamily: "Jost, sans-serif", background: C.bg, color: C.text, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500;600&display=swap');
        @keyframes fadeInUp { from{opacity:0;transform:translateY(8px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes dropIn   { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.3)} }
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:#f0e6d3; } ::-webkit-scrollbar-thumb { background:#e8d5b7; border-radius:2px; }
      `}</style>

      {/* NAV */}
      <nav style={{ background: C.dark, height: 56, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", position: "relative", zIndex: 800 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, letterSpacing: ".25em", color: C.bg }}>OAXACA</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(245,240,232,.5)", fontWeight: 500 }}>Kitchen View</span>

          <div ref={notifRef} style={{ position: "relative" }}>
            <div onClick={() => { setShowNotifs(v => !v); setShowAccount(false); }}
              style={{ width: 36, height: 36, borderRadius: "50%", border: `1.5px solid ${showNotifs ? C.warm : "rgba(245,240,232,.3)"}`, background: showNotifs ? "rgba(196,118,58,.3)" : "rgba(245,240,232,.08)", display: "grid", placeItems: "center", cursor: "pointer", color: "rgba(245,240,232,.85)", position: "relative", transition: "all .15s", userSelect: "none" }}>
              <IconBell />
              {notifications.filter(n => !n.read).length > 0 && (
                <div style={{ position: "absolute", top: -3, right: -3, minWidth: 16, height: 16, borderRadius: 8, background: C.red, border: `2px solid ${C.dark}`, display: "grid", placeItems: "center", fontSize: 8, fontWeight: 700, color: "white", padding: "0 3px" }}>
                  {notifications.filter(n => !n.read).length > 9 ? "9+" : notifications.filter(n => !n.read).length}
                </div>
              )}
            </div>
            {showNotifs && <NotificationsPanel notifications={notifications} setNotifications={setNotifications} />}
          </div>

          <div ref={accountRef} style={{ position: "relative" }}>
            <div onClick={() => { setShowAccount(v => !v); setShowNotifs(false); }}
              style={{ width: 36, height: 36, borderRadius: "50%", background: showAccount ? C.mid : C.green, display: "grid", placeItems: "center", cursor: "pointer", color: "white", fontSize: 11, fontWeight: 700, border: `2px solid ${showAccount ? C.light : "transparent"}`, transition: "all .15s", userSelect: "none" }}>
              {staffInfo?.name ? staffInfo.name.slice(0, 2).toUpperCase() : "??"}
            </div>
            {showAccount && <AccountPanel addToast={addToast} staffInfo={staffInfo} />}
          </div>
        </div>
      </nav>

      {/* PAGE HEADER */}
      <div style={{ padding: "18px 28px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: C.dark }}>Kitchen Dashboard</h1>
          <p style={{ fontSize: 12, color: C.muted, marginTop: 2, letterSpacing: ".05em" }}>
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "8px 18px", textAlign: "center" }}>
            <div style={{ fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: C.muted, fontWeight: 600 }}>Active Orders</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: C.dark, lineHeight: 1.2 }}>{activeCount}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: C.green, fontWeight: 600, background: C.greenL, padding: "5px 12px", borderRadius: 20 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, animation: "pulse 1.6s infinite" }} />
            Live
          </div>
        </div>
      </div>

      {/* KANBAN BOARD */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, padding: "16px 28px 24px", overflow: "hidden", minHeight: 0 }}>
        {columns.map(col => (
          <div key={col.title} style={{ background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 10, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ height: 3, background: col.accent, flexShrink: 0 }} />
            <div style={{ padding: "14px 16px 10px", borderBottom: `1.5px solid ${C.border}`, flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, color: C.dark }}>{col.title}</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: col.orders.length > 0 ? C.pale : C.greenL, color: col.orders.length > 0 ? C.muted : C.green }}>
                {col.orders.length} {col.orders.length === 1 ? "order" : "orders"}
              </span>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px" }}>
              {col.orders.length === 0
                ? <div style={{ textAlign: "center", padding: "32px 8px", color: C.muted, fontSize: 12 }}>{col.empty}</div>
                : col.orders.map(order => (
                  <OrderCard key={order.id} order={order} btnLabel={col.btnLabel} btnColor={col.btnColor} onAction={col.onAction} />
                ))
              }
            </div>
          </div>
        ))}
      </div>

      {/* NOTIFICATIONS */}
      <div style={{ position: "fixed", bottom: 24, right: 24, display: "flex", flexDirection: "column", gap: 8, zIndex: 9999, pointerEvents: "none" }}>
        {toasts.map(t => (
          <div key={t.id} style={{ background: C.dark, color: C.bg, padding: "10px 18px", borderRadius: 6, fontSize: 12, fontWeight: 500, boxShadow: "0 4px 16px rgba(0,0,0,.25)", animation: "fadeInUp .2s ease" }}>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
