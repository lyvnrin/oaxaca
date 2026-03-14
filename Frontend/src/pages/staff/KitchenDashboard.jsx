import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#f5f0e8", panel: "#faf7f2", dark: "#3b1f0e", mid: "#8b4513",
  warm: "#c4763a", light: "#e8d5b7", pale: "#f0e6d3",
  green: "#4a7c59", greenL: "#d4edda",
  red: "#c0392b", redL: "#fde8e6",
  amber: "#d4870e",
  text: "#2c1810", muted: "#7a5c44", border: "#d4b896",
};

const now = () => Date.now();

function useOutsideClick(ref, cb) {
  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) cb(); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [ref, cb]);
}

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

function AccountPanel({ addToast }) {
  return (
      <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, width: 240, background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,.2)", zIndex: 900, animation: "dropIn .15s ease" }}>
        <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: C.green, display: "grid", placeItems: "center", color: "white", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>AK</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Aisha K.</div>
            <div style={{ fontSize: 11, color: C.muted }}>aisha.k@oaxaca.com</div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: C.mid, marginTop: 2 }}>Head Chef</div>
          </div>
        </div>
        <div onClick={() => addToast("Signed out (demo)")}
             style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "background .15s", borderRadius: "0 0 10px 10px" }}
             onMouseEnter={e => e.currentTarget.style.background = C.redL}
             onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <IconDoor /><span style={{ fontSize: 13, fontWeight: 600, color: C.red }}>Sign Out</span>
        </div>
      </div>
  );
}

function OrderCard({ order, btnLabel, btnColor, onAction }) {
  const [, tick] = useState(0);
  useEffect(() => { const t = setInterval(() => tick(n => n + 1), 30000); return () => clearInterval(t); }, []);

  return (
      <div style={{ background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", marginBottom: 10, transition: "box-shadow .15s" }}
           onMouseEnter={e => e.currentTarget.style.boxShadow = "0 3px 12px rgba(0,0,0,.08)"}
           onMouseLeave={e => e.currentTarget.style.boxShadow = ""}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, color: C.dark }}>{order.table}</span>
          {/* ⭐ Track order times */}
          <span style={{ fontSize: 11, fontWeight: 700, color: elapsedColor(order.startedAt), display: "flex", alignItems: "center", gap: 3 }}>
          <IconClock />{getElapsed(order.startedAt)}
        </span>
        </div>
        {order.items.map((it, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${C.pale}`, fontSize: 12 }}>
              <span style={{ color: C.text }}>{it.name}</span>
              <span style={{ fontWeight: 600, color: C.muted, fontSize: 11 }}>×{it.qty}</span>
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

export default function App() {
  // CONNECTIONS ROUTING ---------------------------------------
  const [pending, setPending] = useState([]);
  const [preparing, setPreparing] = useState([]);
  const [ready, setReady] = useState([]);

  useEffect(() => {
      const fetchOrders = async () => {
          const res = await fetch('http://127.0.0.1:8000/orders');
          const data = await res.json();
          setPending(data.filter(o => o.status === "Pending").map(o => ({
              id: String(o.order_id),
              table: `Table ${o.table_id}`,
              startedAt: Date.now(),
              items: o.items.map(i => ({ name: i.item_name, qty: i.quantity }))
          })));
          setPreparing(data.filter(o => o.status === "In Progress").map(o => ({
              id: String(o.order_id),
              table: `Table ${o.table_id}`,
              startedAt: Date.now(),
              items: o.items.map(i => ({ name: i.item_name, qty: i.quantity }))
          })));
          setReady(data.filter(o => o.status === "Ready").map(o => ({
              id: String(o.order_id),
              table: `Table ${o.table_id}`,
              startedAt: Date.now(),
              items: o.items.map(i => ({ name: i.item_name, qty: i.quantity }))
          })));
      };
      fetchOrders();
      const poll = setInterval(fetchOrders, 10000);
      return () => clearInterval(poll);
  }, []);

  // ------------------------------------------------------------

  const [toasts, setToasts] = useState([]);
  const [showAccount, setShowAccount] = useState(false);

  const accountRef = useRef(null);
  useOutsideClick(accountRef, () => setShowAccount(false));

  const addToast = msg => { const id = Date.now(); setToasts(p => [...p, { id, msg }]); setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 1800); };

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

  const activeCount = pending.length + preparing.length + ready.length;

  const columns = [
    { title: "Pending Confirmation", accent: C.warm, orders: pending, btnLabel: "Confirm Order", btnColor: C.warm, onAction: confirmOrder, empty: "No pending orders" },
    { title: "Preparing", accent: C.amber, orders: preparing, btnLabel: "Notify Waiter", btnColor: C.green, onAction: notifyWaiter, empty: "Nothing being prepared" },
    { title: "Ready for Service", accent: C.green, orders: ready, btnLabel: null, btnColor: null, onAction: null, empty: "Nothing ready yet" },
  ];

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
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, letterSpacing: ".25em", color: C.bg }}>O A X A C A</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(245,240,232,.5)", fontWeight: 500 }}>Kitchen View</span>
            <div ref={accountRef} style={{ position: "relative" }}>
              <div onClick={() => setShowAccount(v => !v)}
                   style={{ width: 36, height: 36, borderRadius: "50%", background: showAccount ? C.mid : C.green, display: "grid", placeItems: "center", cursor: "pointer", color: "white", fontSize: 11, fontWeight: 700, border: `2px solid ${showAccount ? C.light : "transparent"}`, transition: "all .15s", userSelect: "none" }}>
                AK
              </div>
              {showAccount && <AccountPanel addToast={addToast} />}
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
