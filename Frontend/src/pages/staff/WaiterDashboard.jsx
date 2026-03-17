import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

const C = {
    bg: "#f5f0e8", panel: "#faf7f2", dark: "#2D2218", mid: "#8b4513",
    warm: "#c4763a", light: "#e8d5b7", pale: "#f0e6d3",
    green: "#4a7c59", greenL: "#d4edda",
    red: "#c0392b", redL: "#fde8e6",
    amber: "#d4870e", amberL: "#fef3cd",
    blue: "#c4763a", blueL: "#f5e6d3",
    text: "#2c1810", muted: "#7a5c44", border: "#d4b896",
};

const MY_TABLES = [3, 7, 12];
const now = () => Date.now();

const ORDER_STATUSES = ["Pending", "In Progress", "Ready", "Completed", "Cancelled"];

const INIT_NOTIFICATIONS = [];

const INIT_UNPAID = [
    { table: 2, order: "1230", total: 34.50, waiting: "12 mins" },
    { table: 6, order: "1231", total: 22.00, waiting: "5 mins" },
    { table: 11, order: "1232", total: 67.00, waiting: "28 mins" },
];

const notifColor = { ready: C.green, alert: C.blue, allergy: C.amber, Help_Needed: C.blue };
const statusColor = {
    "Pending": C.amber,
    "In Progress": C.warm,
    "Ready": C.green,
    "Completed": C.mid,
    "Cancelled": C.red,
};

function useOutsideClick(ref, cb) {
    useEffect(() => {
        const fn = e => { if (ref.current && !ref.current.contains(e.target)) cb(); };
        document.addEventListener("mousedown", fn);
        return () => document.removeEventListener("mousedown", fn);
    }, [ref, cb]);
}

function useElapsed(startedAt) {
    const [, tick] = useState(0);
    useEffect(() => { const t = setInterval(() => tick(n => n + 1), 30000); return () => clearInterval(t); }, []);
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

// HOOK: listens for kitchen "NOTIFY WAITER" events from localStorage (cross-tab)
function useKitchenNotifications(setNotifications, addToast, onNewOrder) {
    useEffect(() => {
        const handler = (e) => {
            if (e.key !== "oaxaca_kitchen_notify" || !e.newValue) return;
            try {
                const incoming = JSON.parse(e.newValue);
                setNotifications(prev => {
                    if (prev.some(n => n.id === incoming.id)) return prev;
                    return [incoming, ...prev];
                });
                addToast(`🍽 Table ${incoming.table} — Order #${incoming.order} is ready for collection!`);
                onNewOrder();
            } catch (_) { }
        };
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, [setNotifications, addToast, onNewOrder]);
}

const IconAlert = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
const IconBell = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
const IconClock = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const IconDoor = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;

function Dropdown({ children, width = 360 }) {
    return (
        <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, width, background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,.2)", zIndex: 900, animation: "dropIn .15s ease" }}>
            {children}
        </div>
    );
}

function NavIcon({ icon, onClick, active, badge, badgeColor }) {
    return (
        <div onClick={onClick}
            style={{ width: 36, height: 36, borderRadius: "50%", border: `1.5px solid ${active ? C.warm : "rgba(245,240,232,.3)"}`, background: active ? "rgba(196,118,58,.3)" : "rgba(245,240,232,.08)", display: "grid", placeItems: "center", cursor: "pointer", color: "rgba(245,240,232,.85)", position: "relative", transition: "all .15s", userSelect: "none" }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = C.warm; e.currentTarget.style.background = "rgba(196,118,58,.25)"; } }}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = "rgba(245,240,232,.3)"; e.currentTarget.style.background = "rgba(245,240,232,.08)"; } }}>
            {icon}
            {badge > 0 && <div style={{ position: "absolute", top: -3, right: -3, minWidth: 16, height: 16, borderRadius: 8, background: badgeColor || C.warm, border: `2px solid ${C.dark}`, display: "grid", placeItems: "center", fontSize: 8, fontWeight: 700, color: "white", padding: "0 3px" }}>{badge > 9 ? "9+" : badge}</div>}
        </div>
    );
}

function SectionCard({ accentColor, title, badge, children, action }) {
    return (
        <div style={{ background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ height: 3, background: accentColor }} />
            <div style={{ padding: "14px 18px 10px", borderBottom: `1.5px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: C.dark }}>{title}</span>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {badge}
                    {action}
                </div>
            </div>
            {children}
        </div>
    );
}

function NotificationsPanel({ notifications, setNotifications }) {
    const [filter, setFilter] = useState("All");
    const unread = notifications.filter(n => !n.read).length;
    const markRead = id => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
    const dismiss = id => setNotifications(p => p.filter(n => n.id !== id));
    const markAll = () => setNotifications(p => p.map(n => ({ ...n, read: true })));
    const clearAll = () => setNotifications([]);
    const filtered = notifications.filter(n =>
        filter === "Alerts" ? n.type === "alert" || n.type === "allergy" :
            filter === "Ready" ? n.type === "ready" : true
    );
    return (
        <Dropdown width={370}>
            <div style={{ padding: "13px 16px 10px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, color: C.dark }}>Notifications</span>
                    {unread > 0 && <span style={{ background: C.warm, color: "white", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 10 }}>{unread}</span>}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    {unread > 0 && <button onClick={markAll} style={{ fontSize: 10, color: C.mid, background: "none", border: "none", cursor: "pointer", fontFamily: "Jost, sans-serif", fontWeight: 600 }}>Mark all read</button>}
                    {notifications.length > 0 && <button onClick={clearAll} style={{ fontSize: 10, color: C.muted, background: "none", border: "none", cursor: "pointer", fontFamily: "Jost, sans-serif" }}>Clear all</button>}
                </div>
            </div>
            <div style={{ padding: "8px 16px", display: "flex", gap: 6, borderBottom: `1px solid ${C.border}` }}>
                {["All", "Alerts", "Ready"].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 20, border: "none", cursor: "pointer", fontFamily: "Jost, sans-serif", background: filter === f ? C.dark : C.pale, color: filter === f ? C.bg : C.muted, transition: "all .15s" }}>{f}</button>
                ))}
            </div>
            <div style={{ maxHeight: 320, overflowY: "auto" }}>
                {filtered.length === 0 && <div style={{ padding: "24px 16px", textAlign: "center", color: C.muted, fontSize: 13 }}>No notifications</div>}
                {filtered.map(n => (
                    <div key={n.id} onClick={() => markRead(n.id)}
                        style={{ padding: "11px 16px", borderBottom: `1px solid ${C.pale}`, display: "flex", gap: 10, cursor: "pointer", background: n.read ? "transparent" : "rgba(196,118,58,.04)", transition: "background .15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = C.pale}
                        onMouseLeave={e => e.currentTarget.style.background = n.read ? "transparent" : "rgba(196,118,58,.04)"}>
                        <div style={{ width: 3, borderRadius: 2, background: notifColor[n.type], flexShrink: 0, alignSelf: "stretch" }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, fontWeight: n.read ? 400 : 700, color: C.text }}>Table {n.table} — Order #{n.order}</div>
                            <p style={{ fontSize: 11, color: notifColor[n.type], marginTop: 3, fontWeight: 600 }}>{n.status}</p>
                        </div>
                        {!n.read && <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.warm, flexShrink: 0, marginTop: 4 }} />}
                        <button onClick={e => { e.stopPropagation(); dismiss(n.id); }} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14, flexShrink: 0 }}>✕</button>
                    </div>
                ))}
            </div>
            {filtered.length > 0 && <div style={{ padding: "9px 16px", borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.muted, textAlign: "center" }}>{filtered.filter(n => !n.read).length} unread · {filtered.length} shown</div>}
        </Dropdown>
    );
}

function AccountPanel({ addToast }) {
    return (
        <Dropdown width={240}>
            <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: C.mid, display: "grid", placeItems: "center", color: "white", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>JD</div>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Jamie D.</div>
                    <div style={{ fontSize: 11, color: C.muted }}>jamie.d@oaxaca.com</div>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: C.mid, marginTop: 2 }}>Waiter</div>
                </div>
            </div>
            <div onClick={() => { window.location.href = "/"; }}
                style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "background .15s", borderRadius: "0 0 10px 10px" }}
                onMouseEnter={e => e.currentTarget.style.background = C.redL}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <IconDoor /><span style={{ fontSize: 13, fontWeight: 600, color: C.red }}>Sign Out</span>
            </div>
        </Dropdown>
    );
}

function Modal({ title, subtitle, onClose, children, footer }) {
    return (
        <>
            <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 998 }} />
            <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 460, maxHeight: "80vh", background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 12, zIndex: 999, boxShadow: "0 12px 40px rgba(0,0,0,.25)", display: "flex", flexDirection: "column", animation: "dropIn .2s ease" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1.5px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                    <div>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: C.dark }}>{title}</span>
                        {subtitle && <span style={{ fontSize: 12, color: C.muted, marginLeft: 8 }}>{subtitle}</span>}
                    </div>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 18 }}>✕</button>
                </div>
                <div style={{ overflowY: "auto", flex: 1 }}>{children}</div>
                {footer && <div style={{ padding: "12px 20px", borderTop: `1.5px solid ${C.border}`, flexShrink: 0 }}>{footer}</div>}
            </div>
        </>
    );
}

function UnpaidModal({ unpaidTables, onClose }) {
    return (
        <Modal title="Unpaid Tables" onClose={onClose}>
            <p style={{ fontSize: 12, color: C.muted, padding: "10px 20px 0" }}>Tables that have been served but have not yet paid.</p>
            <div style={{ padding: "10px 20px 20px" }}>
                {unpaidTables.length === 0
                    ? <div style={{ textAlign: "center", color: C.green, fontWeight: 600, padding: "24px 0" }}>All tables are settled ✓</div>
                    : unpaidTables.map((t, i) => (
                        <div key={i} style={{ background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, color: C.dark }}>Table {t.table}</div>
                                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Order #{t.order} · Waiting {t.waiting}</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: C.warm }}>£{t.total.toFixed(2)}</div>
                                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em", color: C.red, textTransform: "uppercase" }}>Unpaid</div>
                            </div>
                        </div>
                    ))}
            </div>
        </Modal>
    );
}

function AddItemsModal({ order, menu, onAdd, onClose }) {
    const [selected, setSelected] = useState({});
    const [search, setSearch] = useState("");

    const availMenu = menu.filter(m => m.avail);
    const q = search.trim().toLowerCase();
    const filtered = q ? availMenu.filter(m => m.name.toLowerCase().includes(q) || m.section.toLowerCase().includes(q)) : availMenu;

    const toggle = item => setSelected(p => { const n = { ...p }; if (n[item.id]) delete n[item.id]; else n[item.id] = { ...item, qty: 1 }; return n; });
    const changeQty = (id, delta) => setSelected(p => { const n = { ...p }; if (!n[id]) return n; const q = n[id].qty + delta; if (q < 1) { delete n[id]; return n; } n[id] = { ...n[id], qty: q }; return n; });
    const totalAdded = Object.values(selected).reduce((s, i) => s + i.price * i.qty, 0);
    const hasSelected = Object.keys(selected).length > 0;

    return (
        <Modal title="Add Items" subtitle={`Table ${order.table} · Order #${order.id}`} onClose={onClose}
            footer={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 700, color: C.dark }}>{hasSelected ? `+£${totalAdded.toFixed(2)} to add` : "Select items above"}</span>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={onClose} style={{ padding: "8px 14px", border: `1px solid ${C.border}`, borderRadius: 6, background: "transparent", fontSize: 11, cursor: "pointer", fontFamily: "Jost, sans-serif", color: C.muted }}>Cancel</button>
                        <button onClick={() => { if (hasSelected) { onAdd(order.id, Object.values(selected)); onClose(); } }} disabled={!hasSelected}
                            style={{ padding: "8px 16px", border: "none", borderRadius: 6, background: hasSelected ? C.dark : C.light, color: hasSelected ? C.bg : C.muted, fontSize: 11, fontWeight: 600, cursor: hasSelected ? "pointer" : "not-allowed", fontFamily: "Jost, sans-serif", letterSpacing: ".06em", textTransform: "uppercase" }}>
                            Add to Order
                        </button>
                    </div>
                </div>
            }>
            <div style={{ padding: "10px 20px 0" }}>
                <div style={{ position: "relative", marginBottom: 10 }}>
                    <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.muted, fontSize: 13, pointerEvents: "none" }}>🔍</span>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search menu…"
                        style={{ width: "100%", padding: "8px 30px 8px 30px", border: `1.5px solid ${q ? C.warm : C.border}`, borderRadius: 7, fontSize: 12, fontFamily: "Jost, sans-serif", background: C.bg, color: C.text, outline: "none" }} />
                    {q && (
                        <button onClick={() => setSearch("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 13 }}>✕</button>
                    )}
                </div>
                {filtered.length === 0 && (
                    <div style={{ textAlign: "center", padding: "16px 0", color: C.muted, fontSize: 12 }}>No items match "{search}"</div>
                )}
            </div>
            <div style={{ padding: "0 20px 10px" }}>
                {filtered.map(item => {
                    const sel = selected[item.id];
                    return (
                        <div key={item.id} onClick={() => !sel && toggle(item)}
                            style={{ background: sel ? C.pale : C.bg, border: `1.5px solid ${sel ? C.warm : C.border}`, borderRadius: 8, padding: "10px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: sel ? "default" : "pointer", transition: "all .15s" }}>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{item.name}</div>
                                <div style={{ fontSize: 11, color: C.muted }}>£{item.price.toFixed(2)} · {item.section}</div>
                            </div>
                            {sel ? (
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <button onClick={e => { e.stopPropagation(); changeQty(item.id, -1); }} style={{ width: 26, height: 26, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.bg, cursor: "pointer", fontSize: 14, display: "grid", placeItems: "center" }}>−</button>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: C.dark, minWidth: 16, textAlign: "center" }}>{sel.qty}</span>
                                    <button onClick={e => { e.stopPropagation(); changeQty(item.id, +1); }} style={{ width: 26, height: 26, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.bg, cursor: "pointer", fontSize: 14, display: "grid", placeItems: "center" }}>+</button>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: C.warm, minWidth: 42, textAlign: "right" }}>£{(sel.price * sel.qty).toFixed(2)}</span>
                                </div>
                            ) : (
                                <span style={{ fontSize: 11, fontWeight: 600, color: C.warm }}>+ Add</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </Modal>
    );
}

function OrderCard({ order, onConfirm, onCancel, onDeliver, onAddItems, onStatusChange, onRemoveItem }) {
    const [showStatusMenu, setShowStatusMenu] = useState(false);
    const elapsed = useElapsed(order.startedAt);
    const isMine = MY_TABLES.includes(order.table);
    const rowTotal = order.items.reduce((s, i) => s + i.price * i.qty, 0);
    const isPending = order.status === "Pending";
    const isReady = order.status === "Ready";
    const isDelivered = order.status === "Completed";

    return (
        <div style={{ background: C.bg, border: `1.5px solid ${isMine ? C.warm : C.border}`, borderRadius: 8, padding: "12px 14px", marginBottom: 10, opacity: isDelivered ? .65 : 1, transition: "box-shadow .15s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 3px 12px rgba(0,0,0,.08)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = ""}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, color: C.dark }}>Table {order.table}</span>
                        {isMine && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", background: C.warm, color: "white", borderRadius: 4, padding: "2px 6px" }}>My Table</span>}
                    </div>
                    <div style={{ fontSize: 11, marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ color: elapsedColor(order.startedAt), fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}><IconClock />{elapsed}</span>
                        <span style={{ color: C.muted }}>· Order #{order.id}</span>
                    </div>
                </div>
                <div style={{ position: "relative" }}>
                    <div
                        onClick={() => !isDelivered && setShowStatusMenu(v => !v)}
                        style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", background: statusColor[order.status] + "22", color: statusColor[order.status], border: `1px solid ${statusColor[order.status]}44`, borderRadius: 5, padding: "3px 8px", whiteSpace: "nowrap", cursor: isDelivered ? "default" : "pointer", userSelect: "none", display: "flex", alignItems: "center", gap: 4 }}>
                        {order.status}
                        {!isDelivered && <span style={{ fontSize: 8 }}>▾</span>}
                    </div>
                    {showStatusMenu && (
                        <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 8, boxShadow: "0 6px 20px rgba(0,0,0,.15)", zIndex: 50, minWidth: 190, overflow: "hidden", animation: "dropIn .12s ease" }}>
                            <div style={{ padding: "8px 12px 6px", fontSize: 9, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: C.muted, borderBottom: `1px solid ${C.pale}` }}>Change Status</div>
                            {ORDER_STATUSES.filter(s => s !== order.status).map(s => (
                                <div key={s}
                                    onClick={() => { onStatusChange(order.id, s); setShowStatusMenu(false); }}
                                    style={{ padding: "9px 14px", fontSize: 12, color: statusColor[s], cursor: "pointer", fontWeight: 600, borderBottom: `1px solid ${C.pale}`, display: "flex", alignItems: "center", gap: 8, transition: "background .12s" }}
                                    onMouseEnter={e => e.currentTarget.style.background = C.pale}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor[s], flexShrink: 0, display: "inline-block" }} />
                                    {s}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
    {order.items.map((item, ii) => {
        const customisations = JSON.parse(
                localStorage.getItem(`oaxaca_customisations_${order.id}`) || '{}'
        );
        const note = customisations[item.name] || null;
        return (
            <div key={ii} style={{ borderBottom: `1px solid ${C.pale}`, padding: "5px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, gap: 6, alignItems: "center" }}>
                    <span style={{ color: C.text, flex: 1 }}>{item.name}</span>
                    <span style={{ color: C.muted, fontSize: 11 }}>×{item.qty}</span>
                    <span style={{ fontWeight: 600, color: C.mid, fontSize: 11, minWidth: 48, textAlign: "right" }}>
                        £{(item.price * item.qty).toFixed(2)}
                    </span>
                    {!isDelivered && (
                        <button onClick={() => onRemoveItem(order.id, ii)}
                            style={{ marginLeft: 4, width: 18, height: 18, borderRadius: "50%", border: "none", background: C.redL, color: C.red, fontSize: 11, cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0 }}>
                            ✕
                        </button>
                    )}
                </div>
                {note && (
                    <div style={{ fontSize: 10, color: C.amber, marginTop: 2, paddingLeft: 2, fontStyle: "italic" }}>
                        {note}
                    </div>
                )}
            </div>
        );
    })}
            <div style={{ textAlign: "right", marginTop: 6, fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontWeight: 700, color: C.dark }}>Total: £{rowTotal.toFixed(2)}</div>
            <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {isPending && (
                    <button onClick={() => onConfirm(order.id)} style={{ flex: 1, padding: "7px 10px", border: "none", borderRadius: 6, background: C.green, color: "white", fontSize: 10, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", cursor: "pointer", fontFamily: "Jost, sans-serif" }}>
                        ✓ Confirm Order
                    </button>
                )}
                {isReady && (
                    <button onClick={() => onDeliver(order.id)} style={{ flex: 1, padding: "7px 10px", border: "none", borderRadius: 6, background: C.mid, color: "white", fontSize: 10, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", cursor: "pointer", fontFamily: "Jost, sans-serif" }}>
                        Mark Delivered
                    </button>
                )}
                {!isDelivered && (
                    <button onClick={() => onAddItems(order)} style={{ padding: "7px 10px", border: `1px solid ${C.border}`, borderRadius: 6, background: C.panel, color: C.mid, fontSize: 10, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", cursor: "pointer", fontFamily: "Jost, sans-serif" }}>
                        + Add Items
                    </button>
                )}
                {!isDelivered && (
                    <button onClick={() => onCancel(order.id)} style={{ padding: "7px 10px", border: "none", borderRadius: 6, background: C.redL, color: C.red, fontSize: 10, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", cursor: "pointer", fontFamily: "Jost, sans-serif" }}>
                        ✕ Cancel
                    </button>
                )}
            </div>
        </div>
    );
}

function OrdersTab({ orders, setOrders, menu, addToast }) {
    const [addItemsOrder, setAddItemsOrder] = useState(null);

    const confirmOrder = async (id) => {
        setOrders(p => p.map(o => o.id === id ? { ...o, status: "In Progress" } : o));
        await fetch(`http://127.0.0.1:8000/orders/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: "In Progress" }),
        });
        addToast("Order confirmed ✓");
    };

    const deliverOrder = async (id) => {
        setOrders(p => p.map(o => o.id === id ? { ...o, status: "Completed" } : o));
        await fetch(`http://127.0.0.1:8000/orders/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: "Completed" }),
        });
        addToast("Order marked as delivered");
    };

    const cancelOrder = async (id) => {
        setOrders(p => p.filter(o => o.id !== id));
        await fetch(`http://127.0.0.1:8000/orders/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: "Cancelled" }),
        });
        addToast("Order cancelled");
    };

    const changeStatus = async (id, status) => {
        setOrders(p => p.map(o => o.id === id ? { ...o, status } : o));

        await fetch(`http://127.0.0.1:8000/orders/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        addToast(`Status updated to "${status}"`);
    };


    const removeItem = (orderId, itemIndex) => {
        setOrders(p => p.map(o => {
            if (o.id !== orderId) return o;
            const items = o.items.filter((_, i) => i !== itemIndex);
            return items.length === 0 ? null : { ...o, items };
        }).filter(Boolean));
        addToast("Item removed from order");
    };
    const addItemsToOrder = (orderId, newItems) => {
        setOrders(p => p.map(o => {
            if (o.id !== orderId) return o;
            const merged = [...o.items];
            newItems.forEach(ni => {
                const ex = merged.find(i => i.menuId === ni.id);
                if (ex) ex.qty += ni.qty;
                else merged.push({ menuId: ni.id, name: ni.name, qty: ni.qty, price: ni.price });
            });
            return { ...o, items: merged };
        }));
        addToast("Items added to order ✓");
    };

    const active = orders.filter(o => o.status !== "Completed" && o.status !== "Cancelled");
    const statCards = [
        { label: "Pending", value: orders.filter(o => o.status === "Pending").length, accent: C.amber },
        { label: "In Progress", value: orders.filter(o => o.status === "In Progress").length, accent: C.warm },
        { label: "Ready", value: orders.filter(o => o.status === "Ready").length, accent: C.green },
    ];

    return (
        <div style={{ padding: "20px 28px 32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
                {statCards.map((s, i) => (
                    <div key={i} style={{ background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "12px 16px", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.accent }} />
                        <div style={{ fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: C.muted, fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: C.dark, lineHeight: 1 }}>{s.value}</div>
                    </div>
                ))}
            </div>

            {/* 3-COLUMN STYLE FOR ORDERS : better than elongated stacks */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                    { title: "Pending", accent: C.amber, orders: active.filter(o => o.status === "Pending") },
                    { title: "In Progress", accent: C.warm, orders: active.filter(o => o.status === "In Progress") },
                    { title: "Ready", accent: C.green, orders: active.filter(o => o.status === "Ready") },
                ].map(col => (
                    <div key={col.title} style={{ background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
                        <div style={{ height: 3, background: col.accent }} />
                        <div style={{ padding: "14px 16px 10px", borderBottom: `1.5px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, color: C.dark }}>{col.title}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: C.pale, color: C.muted }}>{col.orders.length} orders</span>
                        </div>

                        <div style={{ padding: "12px 14px" }}>
                            {col.orders.length === 0
                                ? <div style={{ textAlign: "center", padding: "24px 0", color: C.muted, fontSize: 12 }}>No orders</div>
                                : col.orders.map(order => (
                                    <OrderCard key={order.id} order={order}
                                        onConfirm={confirmOrder} onCancel={cancelOrder}
                                        onDeliver={deliverOrder} onAddItems={o => setAddItemsOrder(o)}
                                        onStatusChange={changeStatus} onRemoveItem={removeItem} />
                                ))
                            }
                        </div>
                    </div>
                ))}
            </div>

            {addItemsOrder && (
                <AddItemsModal order={addItemsOrder} menu={menu} onAdd={addItemsToOrder} onClose={() => setAddItemsOrder(null)} />
            )}
        </div>
    );
}

function TablesTab({ unpaidTables, addToast, raiseAlert }) {
    const [showUnpaidModal, setShowUnpaidModal] = useState(false);
    const [alertTable, setAlertTable] = useState("");
    const [customTable, setCustomTable] = useState("");

    return (
        <div style={{ padding: "20px 28px 32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <SectionCard accentColor={C.warm} title="Assigned Tables"
                    badge={<span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: C.pale, color: C.muted }}>{MY_TABLES.length} tables</span>}>
                    <div style={{ padding: "12px 16px 16px" }}>
                        <p style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>You are responsible for these tables during your shift.</p>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            {MY_TABLES.map(t => (
                                <div key={t} style={{ background: C.bg, border: `2px solid ${C.warm}`, borderRadius: 8, padding: "14px 20px", textAlign: "center", minWidth: 80 }}>
                                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: C.dark }}>T{t}</div>
                                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: C.warm, marginTop: 2 }}>Active</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </SectionCard>
                <SectionCard accentColor={C.blue} title="Team Alerts">
                    <div style={{ padding: "12px 16px 16px" }}>
                        <p style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>Select a table and raise an alert to notify all staff on shift.</p>
                        <div style={{ marginBottom: 12 }}>
                            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: C.muted, display: "block", marginBottom: 6 }}>Table Number</label>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {MY_TABLES.map(t => (
                                    <button key={t}
                                        onClick={() => setAlertTable(alertTable === t ? "" : t)}
                                        style={{ padding: "6px 14px", borderRadius: 6, border: `1.5px solid ${alertTable === t ? C.warm : C.border}`, background: alertTable === t ? C.pale : C.bg, color: alertTable === t ? C.dark : C.muted, fontSize: 12, fontWeight: alertTable === t ? 700 : 500, cursor: "pointer", fontFamily: "Jost, sans-serif", transition: "all .15s" }}>
                                        T{t}
                                    </button>
                                ))}
                                <input
                                    type="number" min="1" max="20" placeholder="Other…"
                                    value={customTable}
                                    onChange={e => {
                                        const val = parseInt(e.target.value);
                                        setCustomTable(e.target.value);
                                        if (!e.target.value) { setAlertTable(""); return; }
                                        if (val >= 1 && val <= 20) { setAlertTable(val); }
                                    }}
                                    style={{ width: 72, padding: "6px 10px", borderRadius: 6, border: `1.5px solid ${C.border}`, background: C.bg, fontSize: 12, fontFamily: "Jost, sans-serif", color: C.text }} />
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                if (!alertTable) { addToast("Please select a table first"); return; }
                                raiseAlert(alertTable);
                                addToast(`Alert raised for Table ${alertTable} — team notified`);
                                setAlertTable(""); setCustomTable("");
                            }}
                            style={{ width: "100%", padding: "12px", background: alertTable ? C.dark : C.light, color: alertTable ? C.bg : C.muted, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", cursor: alertTable ? "pointer" : "not-allowed", fontFamily: "Jost, sans-serif", transition: "all .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                            onMouseEnter={e => { if (alertTable) e.currentTarget.style.opacity = ".85"; }}
                            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                            <IconAlert /> Raise Team Alert{alertTable ? ` · T${alertTable}` : ""}
                        </button>
                        <div style={{ marginTop: 10, padding: "10px 12px", background: C.blueL, border: `1px solid ${C.warm}40`, borderRadius: 6, fontSize: 11, color: C.mid }}>
                            Alert will appear in notifications for all staff on shift.
                        </div>
                    </div>
                </SectionCard>
                <div style={{ gridColumn: "1 / -1" }}>
                    <SectionCard
                        accentColor={unpaidTables.length > 0 ? C.amber : C.green}
                        title="Unpaid Tables"
                        badge={unpaidTables.length > 0 ? <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: C.amberL, color: C.amber }}>{unpaidTables.length} pending</span> : null}
                        action={unpaidTables.length > 0 ? (
                            <button onClick={() => setShowUnpaidModal(true)} style={{ padding: "5px 14px", background: C.dark, color: C.bg, border: "none", borderRadius: 5, fontSize: 10, fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase", cursor: "pointer", fontFamily: "Jost, sans-serif" }}>View All</button>
                        ) : null}>
                        <div style={{ padding: "12px 16px 16px" }}>
                            {unpaidTables.length === 0
                                ? <div style={{ fontSize: 13, color: C.green, fontWeight: 600, padding: "6px 0" }}>✓ All tables are settled</div>
                                : (
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                                        {unpaidTables.map((t, i) => (
                                            <div key={i} style={{ background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "12px 14px" }}>
                                                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: C.dark }}>Table {t.table}</div>
                                                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Waiting {t.waiting}</div>
                                                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: C.warm, marginTop: 6 }}>£{t.total.toFixed(2)}</div>
                                                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".08em", color: C.red, textTransform: "uppercase", marginTop: 2 }}>Unpaid</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                        </div>
                    </SectionCard>
                </div>
            </div>
            {showUnpaidModal && <UnpaidModal unpaidTables={unpaidTables} onClose={() => setShowUnpaidModal(false)} />}
        </div>
    );
}

function MenuTab({ menu, setMenu, addToast, lowStockDishes }) {
    const toggleAvail = async (id) => {
        const item = menu.find(m => m.id === id);
        const newAvail = !item.avail;
        setMenu(p => p.map(m => m.id === id ? { ...m, avail: newAvail } : m));
        await fetch(`http://127.0.0.1:8000/menu_items/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ available: newAvail }),
        });
        localStorage.setItem('oaxaca_menu_update', Date.now().toString());
        addToast(`${item.name} marked ${newAvail ? "available" : "unavailable"} ✓`);
    };

    const sections = ["Starters", "Mains", "Dessert", "Sides", "Drinks"];
    const available = menu.filter(m => m.avail).length;
    const unavailable = menu.filter(m => !m.avail).length;

    return (
        <div style={{ padding: "20px 28px 32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
                {[
                    { label: "Total Items", value: menu.length, accent: C.warm },
                    { label: "Available", value: available, accent: C.green },
                    { label: "Unavailable", value: unavailable, accent: C.red },
                ].map((s, i) => (
                    <div key={i} style={{ background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "12px 16px", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.accent }} />
                        <div style={{ fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: C.muted, fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: C.dark, lineHeight: 1 }}>{s.value}</div>
                    </div>
                ))}
            </div>
            <div style={{ background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                        <tr style={{ background: C.dark }}>
                            {["Section", "Name", "Price", "Dietary", "Allergens", "Calories", "Available"].map(h => (
                                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: C.light, whiteSpace: "nowrap" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sections.flatMap(sec => menu.filter(m => m.section === sec)).map((item, i) => (
                            <tr key={item.id}
                                style={{ background: i % 2 === 0 ? C.bg : C.panel, borderBottom: `1px solid ${C.border}`, opacity: item.avail ? (lowStockDishes.has(item.name) ? 0.4 : 1) : 0.55, transition: "opacity .2s" }}
                                onMouseEnter={e => e.currentTarget.style.background = C.pale}
                                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? C.bg : C.panel}>
                                <td style={{ padding: "10px 14px", color: C.muted, fontSize: 11, whiteSpace: "nowrap" }}>
                                    <span style={{ background: C.light, color: C.mid, padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 600 }}>{item.section}</span>
                                </td>
                                <td style={{ padding: "10px 14px", fontWeight: 600, color: C.text }}>
                                    {item.name}
                                    {lowStockDishes.has(item.name) && <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, color: C.red, background: C.redL, padding: "1px 6px", borderRadius: 8, letterSpacing: ".06em", textTransform: "uppercase" }}>Low Stock</span>}
                                </td>
                                <td style={{ padding: "10px 14px", fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: C.mid, whiteSpace: "nowrap" }}>£{Number(item.price).toFixed(2)}</td>
                                <td style={{ padding: "10px 14px", fontSize: 11, color: C.green }}>{item.dietary?.join(", ") || "—"}</td>
                                <td style={{ padding: "10px 14px", fontSize: 11, color: C.amber }}>{item.allergens?.length > 0 ? `⚠ ${item.allergens.join(", ")}` : "—"}</td>
                                <td style={{ padding: "10px 14px", fontSize: 11, color: C.muted, whiteSpace: "nowrap" }}>{item.calories || "—"}</td>
                                <td style={{ padding: "10px 14px" }}>
                                    <div onClick={() => toggleAvail(item.id)} style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}>
                                        <div style={{ width: 36, height: 20, borderRadius: 10, background: item.avail ? C.green : C.light, position: "relative", transition: "background .2s", flexShrink: 0 }}>
                                            <div style={{ width: 16, height: 16, borderRadius: "50%", background: "white", position: "absolute", top: 2, left: item.avail ? 18 : 2, transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,.2)" }} />
                                        </div>
                                        <span style={{ fontSize: 11, color: item.avail ? C.green : C.muted, fontWeight: 600, whiteSpace: "nowrap" }}>{item.avail ? "Available" : "Unavailable"}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function MenuItemCard({ item, onToggle }) {
    return (
        <div
            style={{ background: C.bg, border: `1.5px solid ${item.avail ? C.border : C.red + "55"}`, borderRadius: 8, padding: "12px 14px", opacity: item.avail ? 1 : .75, transition: "box-shadow .15s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.06)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = ""}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.text, flex: 1, paddingRight: 8 }}>{item.name}</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 700, color: C.mid, flexShrink: 0 }}>£{item.price.toFixed(2)}</span>
            </div>
            <p style={{ fontSize: 11, color: C.muted, marginBottom: 6, lineHeight: 1.45 }}>{item.description}</p>
            <p style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>{item.calories}</p>
            {item.allergens.length > 0 && (
                <p style={{ fontSize: 10, color: C.amber, fontWeight: 700, marginBottom: 6 }}>⚠ Contains: {item.allergens.join(", ")}</p>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <div onClick={() => onToggle(item.id)} style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}>
                    <div style={{ width: 36, height: 20, borderRadius: 10, background: item.avail ? C.green : C.light, position: "relative", transition: "background .2s" }}>
                        <div style={{ width: 16, height: 16, borderRadius: "50%", background: "white", position: "absolute", top: 2, left: item.avail ? 18 : 2, transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,.2)" }} />
                    </div>
                    <span style={{ fontSize: 11, color: item.avail ? C.green : C.muted, fontWeight: 600 }}>{item.avail ? "Available" : "Unavailable"}</span>
                </div>
                {item.dietary.length > 0 && (
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "flex-end" }}>
                        {item.dietary.map(d => (
                            <span key={d} style={{ fontSize: 9, fontWeight: 600, padding: "1px 6px", borderRadius: 8, background: C.pale, color: C.muted }}>{d}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// CUSTOMER ASSISTANCE ALERT
function useCustomerAlerts(setNotifications, addToast) {
    useEffect(() => {
        const handler = (e) => {
            console.log("storage event fired:", e.key, e.newValue);
            if (e.key !== "oaxaca_customer_alert" || !e.newValue) return;
            try {
                const incoming = JSON.parse(e.newValue);
                setNotifications(prev => {
                    if (prev.some(n => n.id === incoming.id)) return prev;
                    return [incoming, ...prev];
                });
                addToast(`🔔 Table ${incoming.table} needs assistance!`);
            } catch (_) { }
        };
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, [setNotifications, addToast]);
}

const MENU_META = {
    1: { section: "Starters", dietary: ["Vegan", "Gluten-Free"], allergens: [], calories: "350" },
    2: { section: "Starters", dietary: ["Gluten-Free"], allergens: ["Milk", "Soy"], calories: "500" },
    3: { section: "Starters", dietary: ["Gluten-Free"], allergens: ["Fish"], calories: "180" },
    4: { section: "Starters", dietary: ["Vegetarian", "Gluten-Free"], allergens: ["Milk"], calories: "250" },
    5: { section: "Mains", dietary: [], allergens: ["Soy", "Nuts"], calories: "600" },
    6: { section: "Mains", dietary: [], allergens: [], calories: "300 (per taco)" },
    7: { section: "Mains", dietary: ["Vegan"], allergens: [], calories: "400" },
    8: { section: "Mains", dietary: ["Gluten-Free"], allergens: ["Fish"], calories: "450" },
    9: { section: "Dessert", dietary: ["Vegetarian"], allergens: ["Milk", "Gluten", "Eggs"], calories: "550" },
    10: { section: "Dessert", dietary: ["Vegetarian", "Gluten-Free"], allergens: ["Milk", "Eggs"], calories: "320" },
    11: { section: "Dessert", dietary: ["Vegan", "Gluten-Free"], allergens: [], calories: "120" },
    12: { section: "Sides", dietary: ["Vegan", "Gluten-Free"], allergens: [], calories: "200" },
    13: { section: "Sides", dietary: ["Vegan", "Gluten-Free"], allergens: [], calories: "60 (per tortilla)" },
    14: { section: "Sides", dietary: ["Vegan", "Gluten-Free"], allergens: [], calories: "5 (per tbsp)" },
    15: { section: "Sides", dietary: ["Vegan", "Gluten-Free"], allergens: [], calories: "200" },
    16: { section: "Drinks", dietary: ["Vegan", "Gluten-Free"], allergens: [], calories: "70 (per cup)" },
    17: { section: "Drinks", dietary: ["Vegan", "Gluten-Free"], allergens: [], calories: "250" },
    18: { section: "Drinks", dietary: ["Vegan", "Gluten-Free"], allergens: ["Nuts"], calories: "150 (per cup)" },
    19: { section: "Drinks", dietary: [], allergens: [], calories: "150 (per 12 oz bottle)" },
    20: { section: "Drinks", dietary: [], allergens: [], calories: "0" },
};

export default function App() {
    // AUTH GUARD
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.role !== 'waiter') {
            navigate('/');
        }
    }, []);

    const [tab, setTab] = useState("Orders");

    const [notifications, setNotifications] = useState(INIT_NOTIFICATIONS);
    const [toasts, setToasts] = useState([]);
    const [showNotifs, setShowNotifs] = useState(false);
    const [showAccount, setShowAccount] = useState(false);

    const notifRef = useRef(null);
    const accountRef = useRef(null);
    useOutsideClick(notifRef, () => setShowNotifs(false));
    useOutsideClick(accountRef, () => setShowAccount(false));

    const addToast = msg => { const id = Date.now(); setToasts(p => [...p, { id, msg }]); setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000); };
    const raiseAlert = (table) => { const id = Date.now(); setNotifications(p => [{ id, order: "–", table, status: `Table ${table} needs assistance`, type: "alert", read: false }, ...p]); };

    // LISTENING FOR KITCHEN NOTIFY EVENTS
    useKitchenNotifications(setNotifications, addToast, () => { });

    const unread = notifications.filter(n => !n.read).length;
    const alertCount = notifications.filter(n => n.type === "alert" || n.type === "Help_Needed").length;

    const TABS = ["Orders", "Tables", "Menu"];

    const [orders, setOrders] = useState([]);
    useEffect(() => {
        const fetchOrders = async () => {
            const res = await fetch('http://127.0.0.1:8000/orders');
            const data = await res.json();
            setOrders(prev => {
                return data.map(o => {
                    const existing = prev.find(p => p.id === String(o.order_id));
                    return existing
                      ? {
                          ...existing,
                          items: o.items.map(i => ({
                          menuId: null,
                          name: i.item_name,
                          qty: i.quantity,
                          price: i.price,
                          removedIngredients: i.removed_ingredients || [],
                          extras: i.extras || [],
                         specialRequest: i.special_request || "",
                        }))
 }
                        : {
                            id: String(o.order_id),
                            table: o.table_id,
                            status: o.status ?? "Pending",
                            startedAt: Date.now(),
                            items: o.items.map(i => ({
                               menuId: null,
                               name: i.item_name,
                               qty: i.quantity,
                               price: i.price,
                               removedIngredients: i.removed_ingredients || [],
                              extras: i.extras || [],
                              specialRequest: i.special_request || "",
                            }))
                        };
                }).reverse();
            });
        };
        fetchOrders();
        const poll = setInterval(fetchOrders, 10000);
        return () => clearInterval(poll);
    }, []);

    useCustomerAlerts(setNotifications, addToast);

    useEffect(() => {
        const handler = (e) => {
            if (e.key !== 'oaxaca_menu_update') return;
            fetch('http://127.0.0.1:8000/menu_items')
                .then(r => r.json())
                .then(data => setMenu(data.map(item => ({
                    id: item.item_id,
                    name: item.item_name,
                    price: item.price,
                    section: MENU_META[item.item_id]?.section ?? "Mains",
                    avail: item.available === 1,
                    dietary: MENU_META[item.item_id]?.dietary ?? [],
                    allergens: MENU_META[item.item_id]?.allergens ?? [],
                    calories: MENU_META[item.item_id]?.calories ?? "",
                }))));
        };
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, []);


    const [menu, setMenu] = useState([]);
    useEffect(() => {
        fetch('http://127.0.0.1:8000/menu_items')
            .then(r => r.json())
            .then(data => setMenu(data.map(item => ({
                id: item.item_id,
                name: item.item_name,
                price: item.price,
                section: MENU_META[item.item_id]?.section ?? "Mains",
                avail: item.available === 1,
                dietary: MENU_META[item.item_id]?.dietary ?? [],
                allergens: MENU_META[item.item_id]?.allergens ?? [],
                calories: MENU_META[item.item_id]?.calories ?? "",
            }))));
    }, []);
    const [lowStockDishes, setLowStockDishes] = useState(new Set());

    useEffect(() => {
        const fetchStock = () => {
            fetch('http://127.0.0.1:8000/stock')
                .then(r => r.json())
                .then(data => {
                    const low = new Set();
                    data.forEach(s => {
                        if (s.level < 10) s.used_in.split(', ').forEach(d => low.add(d));
                    });
                    setLowStockDishes(low);
                })
                .catch(() => { });
        };
        fetchStock();
        const poll = setInterval(fetchStock, 3000);
        return () => clearInterval(poll);
    }, []);

    const unpaidTables = orders
        .filter(o => o.status === "Completed")
        .map(o => ({
            table: o.table,
            order: o.id,
            total: o.items.reduce((s, i) => s + i.price * i.qty, 0),
            waiting: "—"
        }));

    return (
        <div style={{ fontFamily: "Jost, sans-serif", background: C.bg, color: C.text, minHeight: "100vh" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500;600&display=swap');
            @keyframes fadeInUp { from{opacity:0;transform:translateY(8px)}  to{opacity:1;transform:translateY(0)} }
            @keyframes dropIn   { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
            @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.3)} }
            * { box-sizing:border-box; margin:0; padding:0; }
            ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:#f0e6d3; } ::-webkit-scrollbar-thumb { background:#e8d5b7; border-radius:2px; }
            select:focus, input:focus { outline: 2px solid #c4763a; outline-offset: 1px; }
            `}</style>

            {/* NAV BAR */}
            <nav style={{ background: C.dark, height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", position: "sticky", top: 0, zIndex: 800 }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, letterSpacing: ".25em", color: C.bg }}>OAXACA</span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(245,240,232,.5)", fontWeight: 500 }}>Waiter View</span>
                    <div ref={notifRef} style={{ position: "relative" }}>
                        <NavIcon icon={<IconBell />} onClick={() => { setShowNotifs(v => !v); setShowAccount(false); }} active={showNotifs} badge={unread} badgeColor={alertCount > 0 ? C.blue : C.warm} />
                        {showNotifs && <NotificationsPanel notifications={notifications} setNotifications={setNotifications} />}
                    </div>

                    <div ref={accountRef} style={{ position: "relative" }}>
                        <div onClick={() => { setShowAccount(v => !v); setShowNotifs(false); }}
                            style={{ width: 36, height: 36, borderRadius: "50%", background: showAccount ? C.mid : C.green, display: "grid", placeItems: "center", cursor: "pointer", color: "white", fontSize: 11, fontWeight: 700, border: `2px solid ${showAccount ? C.light : "transparent"}`, transition: "all .15s", userSelect: "none" }}>
                            JD
                        </div>
                        {showAccount && <AccountPanel addToast={addToast} />}
                    </div>
                </div>
            </nav>

            {/* ALERT BANNER */}
            {alertCount > 0 && (
                <div style={{ background: C.blue, color: "white", padding: "9px 28px", display: "flex", alignItems: "center", gap: 10, fontSize: 12, fontWeight: 600, letterSpacing: ".04em" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white", animation: "pulse 1.4s infinite", flexShrink: 0 }} />
                    {alertCount} table{alertCount > 1 ? "s" : ""} need{alertCount === 1 ? "s" : ""} assistance - check notifications
                </div>
            )}

            {/* PAGE HEADER + TABS */}
            <div style={{ background: C.panel, borderBottom: `1.5px solid ${C.border}` }}>
                <div style={{ padding: "18px 28px 0", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                    <div>
                        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: C.dark }}>Waiter Dashboard</h1>
                        <p style={{ fontSize: 12, color: C.muted, marginTop: 2, letterSpacing: ".05em" }}>
                            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} · Tables: {MY_TABLES.join(", ")}
                        </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: C.green, fontWeight: 600, background: C.greenL, padding: "5px 12px", borderRadius: 20, marginBottom: 4 }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, animation: "pulse 1.6s infinite" }} />
                        On Shift
                    </div>
                </div>
                <div style={{ display: "flex", padding: "0 28px", marginTop: 12 }}>
                    {TABS.map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            style={{ padding: "9px 18px", fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 500, cursor: "pointer", color: tab === t ? C.mid : C.muted, transition: "color .2s", userSelect: "none", background: "none", border: "none", borderBottom: `2.5px solid ${tab === t ? C.mid : "transparent"}`, fontFamily: "Jost, sans-serif" }}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* TAB CONTENT */}
            {tab === "Orders" && <OrdersTab orders={orders} setOrders={setOrders} menu={menu} addToast={addToast} />}
            {tab === "Tables" && <TablesTab unpaidTables={unpaidTables} addToast={addToast} raiseAlert={raiseAlert} />}
            {tab === "Menu" && <MenuTab menu={menu} setMenu={setMenu} addToast={addToast} lowStockDishes={lowStockDishes} />}

            {/* TOASTS */}
            <div style={{ position: "fixed", bottom: 24, right: 24, display: "flex", flexDirection: "column", gap: 8, zIndex: 9999, pointerEvents: "none" }}>
                {toasts.map(t => <div key={t.id} style={{ background: C.dark, color: C.bg, padding: "10px 18px", borderRadius: 6, fontSize: 12, fontWeight: 500, boxShadow: "0 4px 16px rgba(0,0,0,.25)", animation: "fadeInUp .2s ease" }}>{t.msg}</div>)}
            </div>
        </div>
    );
}