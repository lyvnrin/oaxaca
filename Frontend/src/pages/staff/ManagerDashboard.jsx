import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// STYLE CONSTANTS --------------------------
/**
 * Color palette constants for the manager dashboard UI
 * @constant {Object} C
 * @property {string} bg - Background color
 * @property {string} panel - Panel background color
 * @property {string} dark - Dark text color
 * @property {string} mid - Medium brown color
 * @property {string} warm - Warm orange color
 * @property {string} light - Light beige color
 * @property {string} pale - Pale beige color
 * @property {string} green - Green color
 * @property {string} greenL - Light green color
 * @property {string} red - Red color
 * @property {string} redL - Light red color
 * @property {string} amber - Amber color
 * @property {string} amberL - Light amber color
 * @property {string} text - Text color
 * @property {string} muted - Muted text color
 * @property {string} border - Border color
 */
const C = {
    bg: "#f5f0e8", panel: "#faf7f2", dark: "#2D2218", mid: "#8b4513",
    warm: "#c4763a", light: "#e8d5b7", pale: "#f0e6d3",
    green: "#4a7c59", greenL: "#d4edda",
    red: "#c0392b", redL: "#fde8e6",
    amber: "#d4870e", amberL: "#fef3cd",
    text: "#2c1810", muted: "#7a5c44", border: "#d4b896",
};

/**
 * Returns color scheme for table status tiles
 * @function tileColors
 * @param {string} status - Table status (Free, Ordering, Preparing, Bill Req., Service)
 * @returns {Object} Color scheme with bg, border, num, label colors
 */
const tileColors = (status) => ({
    "Free": { bg: "#f0f7f2", border: "#b8d4c0", num: "#4a7c59", label: "#4a7c59" },
    "Ordering": { bg: "#fff8f0", border: "#f0c97a", num: "#d4870e", label: "#d4870e" },
    "Preparing": { bg: "#f0f4ff", border: "#9db4e8", num: "#3b5fc0", label: "#3b5fc0" },
    "Bill Req.": { bg: "#fde8e6", border: "#e8a09b", num: "#c0392b", label: "#c0392b" },
    "Service": { bg: "#fef9e7", border: "#f7dc6f", num: "#9a7d0a", label: "#9a7d0a" },
}[status] || { bg: "#f0f7f2", border: "#b8d4c0", num: C.green, label: C.green });

// HELPER FUNCTIONS --------------------------
/**
 * Returns color scheme for table status tiles
 * @function tileColors
 * @param {string} status - Table status (Free, Ordering, Preparing, Bill Req., Service)
 * @returns {Object} Color scheme with bg, border, num, label colors
 */
const calcMargin = (cogs, price) => price > 0 ? Math.round((1 - cogs / price) * 100) : 0;
const calcMinPrice = (cogs) => +(cogs / 0.4).toFixed(2);

/**
 * Returns color scheme and label for margin percentage
 * @function marginColor
 * @param {number} m - Margin percentage
 * @returns {Object} Color scheme with bg, text, and label
 */
const marginColor = (m) => {
    if (m >= 60) return { bg: C.greenL, text: C.green, label: `${m}%` };
    if (m >= 50) return { bg: C.amberL, text: C.amber, label: `${m}% !` };
    return { bg: C.redL, text: C.red, label: `${m}% ⚠` };
};

// CUSTOM HOOK : CLICK OUTSIDE --------------------------
/**
 * Custom hook to detect clicks outside a referenced element
 * @function useOutsideClick
 * @param {React.RefObject} ref - React ref of the element to watch
 * @param {Function} cb - Callback function when click outside occurs
 */
function useOutsideClick(ref, cb) {
    useEffect(() => {
        const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) cb(); };
        document.addEventListener("mousedown", fn);
        return () => document.removeEventListener("mousedown", fn);
    }, [ref, cb]);
}

// ICONS --------------------------
/**
 * Bell Icon Component
 * @component
 * @returns {JSX.Element} Bell SVG icon
 */
const IconBell = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;

/**
 * Door Icon Component (for logout)
 * @component
 * @returns {JSX.Element} Door SVG icon
 */
const IconDoor = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;

// MODAL --------------------------
/**
 * Modal Component
 * Reusable modal dialog with title and close button
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - Modal title
 * @param {Function} props.onClose - Close handler
 * @param {React.ReactNode} props.children - Modal content
 * @returns {JSX.Element} Modal dialog
 */
function Modal({ title, onClose, children }) {
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 600 }} onClick={onClose}>
            <div style={{ background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: 24, minWidth: 360, maxWidth: 480, width: "90%", boxShadow: "0 8px 32px rgba(0,0,0,.18)", maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 700, color: C.dark }}>{title}</span>
                    <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: C.muted }}>✕</button>
                </div>
                {children}
            </div>
        </div>
    );
}

// NOTIFS PANEL --------------------------
/**
 * Notifications Panel Component
 * Displays system alerts, stock warnings, and waiter assistance requests
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.notifications - Array of notification objects
 * @param {Function} props.setNotifications - State setter for notifications
 * @returns {JSX.Element} Notifications dropdown panel
 */
function NotificationsPanel({ notifications, setNotifications }) {
    const [filter, setFilter] = useState("All");
    const unread = notifications.filter(n => !n.read).length;

    /**
     * Marks a notification as read
     * @function markRead
     * @param {number|string} id - Notification ID
     */
    const markRead = (id) => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));

    /**
     * Dismisses (removes) a notification
     * @function dismiss
     * @param {number|string} id - Notification ID
     */
    const dismiss = (id) => setNotifications(p => p.filter(n => n.id !== id));

    /**
     * Marks all notifications as read
     * @function markAll
     */
    const markAll = () => setNotifications(p => p.map(n => ({ ...n, read: true })));

    /**
     * Clears all notifications
     * @function clearAll
     */
    const clearAll = () => setNotifications([]);

    const notifTypeColor = { urgent: C.red, warn: C.amber, info: C.green, alert: C.red };
    const filtered = notifications.filter(n =>
        filter === "Urgent" ? n.type === "urgent" : filter === "Unread" ? !n.read : true
    );
    return (
        <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, width: 380, background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,.2)", zIndex: 800, animation: "dropIn .15s ease" }}>
            <div style={{ padding: "14px 16px 10px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 17, fontWeight: 700, color: C.dark }}>Notifications</span>
                    {unread > 0 && <span style={{ background: C.red, color: "white", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 10 }}>{unread}</span>}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    {unread > 0 && <button onClick={markAll} style={{ fontSize: 10, color: C.mid, background: "none", border: "none", cursor: "pointer", fontFamily: "Jost, sans-serif", fontWeight: 600 }}>Mark all read</button>}
                    {notifications.length > 0 && <button onClick={clearAll} style={{ fontSize: 10, color: C.muted, background: "none", border: "none", cursor: "pointer", fontFamily: "Jost, sans-serif" }}>Clear all</button>}
                </div>
            </div>
            <div style={{ padding: "8px 16px", display: "flex", gap: 6, borderBottom: `1px solid ${C.border}` }}>
                {["All", "Urgent", "Unread"].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 20, border: "none", cursor: "pointer", fontFamily: "Jost, sans-serif", background: filter === f ? C.dark : C.pale, color: filter === f ? C.bg : C.muted, transition: "all .15s" }}>
                        {f}
                    </button>
                ))}
            </div>
            <div style={{ maxHeight: 370, overflowY: "auto" }}>
                {filtered.length === 0 && (
                    <div style={{ padding: "32px 16px", textAlign: "center", color: C.muted, fontSize: 13 }}>
                        {filter === "Urgent" ? "No urgent alerts" : filter === "Unread" ? "All caught up ✓" : "No notifications"}
                    </div>
                )}
                {filtered.map(n => (
                    <div key={n.id} onClick={() => markRead(n.id)}
                        style={{ padding: "11px 16px", borderBottom: `1px solid ${C.pale}`, display: "flex", gap: 10, cursor: "pointer", background: n.read ? "transparent" : "rgba(196,118,58,.04)", transition: "background .15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = C.pale}
                        onMouseLeave={e => e.currentTarget.style.background = n.read ? "transparent" : "rgba(196,118,58,.04)"}>
                        <div style={{ width: 3, borderRadius: 2, background: notifTypeColor[n.type] ?? C.warm, flexShrink: 0, alignSelf: "stretch" }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: n.read ? 400 : 700, color: C.text }}>
                                {n.title ?? `Table ${n.table}${n.order && n.order !== "–" ? ` — Order #${n.order}` : ""}`}
                            </div>
                            <p style={{ fontSize: 11, color: notifTypeColor[n.type] ?? C.warm, marginTop: 3, fontWeight: 600 }}>
                                {n.body ?? n.status}
                            </p>
                            {n.customerMessage && (
                                <p style={{ fontSize: 11, color: C.muted, marginTop: 3, fontStyle: "italic" }}>"{n.customerMessage}"</p>
                            )}
                        </div>
                        {!n.read && <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.warm, flexShrink: 0, marginTop: 4 }} />}
                        <button onClick={e => { e.stopPropagation(); dismiss(n.id); }} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14, flexShrink: 0, padding: "0 2px", alignSelf: "flex-start" }}>✕</button>
                    </div>
                ))}
            </div>
            {filtered.length > 0 && (
                <div style={{ padding: "9px 16px", borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.muted, textAlign: "center" }}>
                    {filtered.filter(n => !n.read).length} unread · {filtered.length} shown
                </div>
            )}
        </div>
    );
}

// ACCOUNT PANEL --------------------------
/**
 * Account Panel Component
 * Displays manager information and logout option
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.staffInfo - Staff information object
 * @param {Function} props.onLogout - Logout handler function
 * @returns {JSX.Element} Account dropdown panel
 */
function AccountPanel({ staffInfo, onLogout }) {
    const initials = staffInfo?.name ? staffInfo.name.slice(0, 2).toUpperCase() : "??";
    const displayName = staffInfo?.name ?? "Unknown";
    const role = staffInfo?.role ?? "Manager";

    return (
        <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, width: 250, background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,.2)", zIndex: 800, animation: "dropIn .15s ease" }}>
            <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: C.warm, display: "grid", placeItems: "center", color: "white", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{displayName}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{staffInfo?.username ?? displayName.toLowerCase()}@oaxaca.com</div>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: C.mid, marginTop: 2 }}>{role}</div>
                </div>
            </div>
            <div onClick={async () => {
                onLogout();
            }}
                style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "background .15s", borderRadius: "0 0 10px 10px" }}
                onMouseEnter={e => e.currentTarget.style.background = C.redL}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <IconDoor /><span style={{ fontSize: 13, fontWeight: 600, color: C.red }}>Sign Out</span>
            </div>
        </div>
    );
}

// OVERVIEW TAB --------------------------
/**
 * Overview Tab Component
 * Displays table status dashboard with occupancy metrics and table details
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.tables - Array of table objects with status and orders
 * @returns {JSX.Element} Overview dashboard with table grid
 */
function OverviewTab({ tables }) {
    const occupied = tables.filter(t => t.status !== "Free").length;
    const [selectedTable, setSelectedTable] = useState(null);

    return (
        <>
            <div style={{ gridColumn: "1/-1" }}>
                <div style={{ background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "16px 18px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: C.amber }} />
                    <div style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: C.muted, fontWeight: 600 }}>Active Tables</div>
                    <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 34, fontWeight: 700, color: C.dark, lineHeight: 1.1, margin: "4px 0 2px" }}>{occupied}/20</div>
                    <div style={{ fontSize: 11, color: C.green, fontWeight: 500 }}>{occupied} occupied</div>
                </div>
            </div>

            <div style={{ gridColumn: "1/-1", background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 17, fontWeight: 700, color: C.dark }}>Table Overview</span>
                </div>
                <div style={{ height: 1, background: C.border }} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
                    {tables.map(t => {
                        const s = tileColors(t.status);
                        return (
                            <div key={t.id} onClick={() => setSelectedTable(t)}
                                style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 6, padding: "10px 8px", textAlign: "center", cursor: "pointer", transition: "transform .15s, box-shadow .15s" }}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,.08)"; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 700, color: s.num, lineHeight: 1 }}>{String(t.id).padStart(2, "0")}</div>
                                <div style={{ fontSize: 9, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 600, color: s.label, marginTop: 3 }}>{t.status}</div>
                                <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>
                                    {t.status === "Free" ? "—"
                                        : t.status === "Bill Req." ? (t.orders.length > 0 ? `£${t.orders.reduce((s, o) => s + o.price * o.qty, 0).toFixed(2)}` : "—")
                                            : t.orders.length > 0 ? `£${t.orders.reduce((s, o) => s + o.price * o.qty, 0).toFixed(2)}`
                                                : "—"}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
                    {[
                        { label: "Free", val: tables.filter(t => t.status === "Free").length },
                        { label: "Ordering", val: tables.filter(t => t.status === "Ordering").length },
                        { label: "Preparing", val: tables.filter(t => t.status === "Preparing").length },
                        { label: "Service", val: tables.filter(t => t.status === "Service").length },
                        { label: "Bill Req.", val: tables.filter(t => t.status === "Bill Req.").length },
                    ].map((o, i) => (
                        <div key={i} style={{ background: C.pale, borderRadius: 6, padding: "10px 12px", textAlign: "center" }}>
                            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 700, color: C.dark, lineHeight: 1 }}>{o.val}</div>
                            <div style={{ fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: C.muted, fontWeight: 600, marginTop: 3 }}>{o.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedTable && (() => {
                const t = tables.find(t => t.id === selectedTable.id) || selectedTable;
                const total = t.orders.reduce((s, o) => s + o.price * o.qty, 0);
                const sc = tileColors(t.status);
                return (
                    <Modal title={`Table ${String(t.id).padStart(2, "0")}`} onClose={() => setSelectedTable(null)}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 20, padding: "3px 12px", marginBottom: 16 }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: sc.num }} />
                            <span style={{ fontSize: 11, fontWeight: 600, color: sc.label, letterSpacing: ".06em", textTransform: "uppercase" }}>{t.status}</span>
                        </div>
                        {t.orders.length > 0 ? (
                            <div style={{ marginBottom: 18 }}>
                                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: C.muted, marginBottom: 10 }}>Current Order</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    {t.orders.map((o, i) => (
                                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", background: C.bg, borderRadius: 5, border: `1px solid ${C.border}` }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <span style={{ fontSize: 11, color: C.muted, background: C.pale, borderRadius: 3, padding: "1px 6px", fontWeight: 600 }}>{o.qty}×</span>
                                                <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{o.name}</span>
                                            </div>
                                            <span style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>£{(o.price * o.qty).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, padding: "9px 10px", background: C.pale, borderRadius: 5 }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: C.dark, letterSpacing: ".04em" }}>Total</span>
                                    <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 700, color: C.dark }}>£{total.toFixed(2)}</span>
                                </div>
                            </div>
                        ) : (
                            <div style={{ marginBottom: 18, padding: "14px", background: C.bg, borderRadius: 5, border: `1px solid ${C.border}`, textAlign: "center" }}>
                                <p style={{ fontSize: 12, color: C.muted, fontStyle: "italic" }}>No items ordered yet.</p>
                            </div>
                        )}
                    </Modal>
                );
            })()}
        </>
    );
}

// MENU TAB --------------------------
/**
 * Menu Tab Component
 * Manages menu items with availability toggles, price editing, and margin tracking
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.menu - Menu items array
 * @param {Function} props.setMenu - State setter for menu
 * @param {Function} props.addToast - Toast notification handler
 * @param {Array} props.stock - Stock data for low stock warnings
 * @returns {JSX.Element} Menu management interface
 */
function MenuTab({ menu, setMenu, addToast, stock }) {
    const sections = ["Starters", "Mains", "Desserts", "Sides", "Drinks"];
    const available = menu.filter(m => m.avail).length;
    const unavailable = menu.filter(m => !m.avail).length;
    const belowMgn = menu.filter(m => calcMargin(m.cogs, m.price) < 60);
    const [editingPrice, setEditingPrice] = useState(null);
    const [priceInput, setPriceInput] = useState("");
    const [priceError, setPriceError] = useState("");

    /**
     * Toggles item availability and syncs with backend
     * @async
     * @function toggleAvail
     * @param {number} id - Menu item ID
     */
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

    /**
     * Starts price editing for a menu item
     * @function startEditPrice
     * @param {Object} item - Menu item to edit
     */
    const startEditPrice = (item) => {
        setEditingPrice(item.id);
        setPriceInput(item.price.toFixed(2));
        setPriceError("");
    };

    /**
     * Saves updated price with margin validation
     * @async
     * @function savePrice
     * @param {Object} item - Menu item to update
     */
    const savePrice = async (item) => {
        const newPrice = parseFloat(priceInput);
        const minPrice = calcMinPrice(item.cogs);
        if (isNaN(newPrice) || newPrice <= 0) {
            setPriceError("Enter a valid price");
            return;
        }
        if (newPrice < minPrice) {
            setPriceError(`Min £${minPrice.toFixed(2)} for 60% margin`);
            return;
        }
        setMenu(p => p.map(m => m.id === item.id ? { ...m, price: newPrice } : m));
        await fetch(`http://127.0.0.1:8000/menu_items/${item.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ price: newPrice }),
        });
        setEditingPrice(null);
        setPriceError("");
        addToast(`${item.name} price updated to £${newPrice.toFixed(2)} ✓`);
    };

    return (
        <div style={{ gridColumn: "1/-1", background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 700, color: C.dark }}>Menu Management</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                    { label: "Total Items", value: menu.length, accent: C.warm },
                    { label: "Available", value: available, accent: C.green },
                    { label: "Unavailable", value: unavailable, accent: C.red },
                ].map((s, i) => (
                    <div key={i} style={{ background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "12px 16px", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.accent }} />
                        <div style={{ fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: C.muted, fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 30, fontWeight: 700, color: C.dark, lineHeight: 1 }}>{s.value}</div>
                    </div>
                ))}
            </div>
            {belowMgn.length > 0 && (
                <div style={{ fontSize: 11, background: C.amberL, border: `1px solid #f0c97a`, color: "#8a5e0a", borderRadius: 5, padding: "9px 14px" }}>
                    ⚠️ <strong>{belowMgn.length} item{belowMgn.length > 1 ? "s" : ""}</strong> ({belowMgn.map(i => i.name).join(", ")}) below 60% margin.
                </div>
            )}
            <div style={{ background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                        <tr style={{ background: C.dark }}>
                            {["Section", "Name", "Price", "Margin", "Dietary", "Allergens", "Calories", "Available"].map(h => (
                                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: C.light, whiteSpace: "nowrap" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sections.flatMap(sec => menu.filter(m => m.section === sec)).map((item, i) => {
                            const m = calcMargin(item.cogs, item.price);
                            const mc = marginColor(m);
                            const lowStock = stock.some(s => s.level < 10 && s.usedIn.includes(item.name));
                            return (
                                <tr key={item.id}
                                    style={{ background: i % 2 === 0 ? C.panel : C.bg, borderBottom: `1px solid ${C.border}`, opacity: item.avail ? (lowStock ? 0.4 : 1) : 0.55, transition: "opacity .2s" }}
                                    onMouseEnter={e => e.currentTarget.style.background = C.pale}
                                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? C.panel : C.bg}>
                                    <td style={{ padding: "10px 14px", fontSize: 11, whiteSpace: "nowrap" }}>
                                        <span style={{ background: C.light, color: C.mid, padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 600 }}>{item.section}</span>
                                    </td>
                                    <td style={{ padding: "10px 14px", fontWeight: 600, color: C.text }}>
                                        {item.name}
                                        {lowStock && <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, color: C.red, background: C.redL, padding: "1px 6px", borderRadius: 8, letterSpacing: ".06em", textTransform: "uppercase" }}>Low Stock</span>}
                                    </td>
                                    <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                                        {editingPrice === item.id ? (
                                            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                    <span style={{ fontSize: 11, color: C.muted }}>£</span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={priceInput}
                                                        onChange={e => { setPriceInput(e.target.value); setPriceError(""); }}
                                                        onKeyDown={e => { if (e.key === "Enter") savePrice(item); if (e.key === "Escape") { setEditingPrice(null); setPriceError(""); } }}
                                                        autoFocus
                                                        style={{ width: 64, fontSize: 12, padding: "2px 5px", border: `1.5px solid ${priceError ? C.red : C.warm}`, borderRadius: 4, fontFamily: "Jost, sans-serif", color: C.text, background: C.bg }}
                                                    />
                                                    <button onClick={() => savePrice(item)} style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, border: "none", background: C.green, color: "white", cursor: "pointer" }}>✓</button>
                                                    <button onClick={() => { setEditingPrice(null); setPriceError(""); }} style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, border: "none", background: C.pale, color: C.muted, cursor: "pointer" }}>✕</button>
                                                </div>
                                                {priceError && <span style={{ fontSize: 9, color: C.red, fontWeight: 600 }}>{priceError}</span>}
                                                <span style={{ fontSize: 9, color: C.muted }}>Min £{calcMinPrice(item.cogs).toFixed(2)} for 60% margin</span>
                                            </div>
                                        ) : (
                                            <span
                                                onClick={() => startEditPrice(item)}
                                                style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, color: C.mid, fontSize: 13, cursor: "pointer", borderBottom: `1px dashed ${C.border}` }}
                                                title="Click to edit price">
                                                £{item.price.toFixed(2)}
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: "10px 14px" }}>
                                        <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 10, background: mc.bg, color: mc.text }}>{mc.label}</span>
                                    </td>
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
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// EMPLOYEES TAB --------------------------
/**
 * Employees Tab Component
 * Displays staff information with shift status, orders handled, and sales data
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.employees - Array of employee objects
 * @returns {JSX.Element} Employee management dashboard
 */
function EmployeesTab({ employees }) {
    const roleStyle = {
        "Waiter": { bg: "#cce3f5", color: "#2e6da4" },
        "Kitchen": { bg: "#ede9f6", color: "#6b3fa0" },
        "Manager": { bg: "#dde3ee", color: "#3d4f6b" },
    };

    const waiters = employees.filter(e => e.role === "Waiter");
    const kitchen = employees.filter(e => e.role === "Kitchen");
    const managers = employees.filter(e => e.role === "Manager");

    const totalSales = waiters.reduce((a, e) => a + (e.sales || 0), 0);
    const totalOrders = waiters.reduce((a, e) => a + (e.orders || 0), 0);

    /**
     * Shift Badge Component
     * @component
     * @param {Object} props - Component props
     * @param {boolean} props.onShift - Whether employee is on shift
     * @returns {JSX.Element} Shift status badge
     */
    const ShiftBadge = ({ onShift }) => (
        <span style={{
            fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
            letterSpacing: ".06em", textTransform: "uppercase",
            background: onShift ? C.greenL : C.redL,
            color: onShift ? C.green : C.red,
        }}>
            {onShift ? "On Shift" : "Off Shift"}
        </span>
    );

    /**
     * Waiter Table Component with sales and orders metrics
     * @component
     * @param {Object} props - Component props
     * @param {Array} props.rows - Waiter employee data
     * @returns {JSX.Element} Table of waiters with metrics
     */
    const WaiterTable = ({ rows }) => (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "fixed" }}>
            <thead>
                <tr>
                    {[["Employee", "30%"], ["Role", "20%"], ["Status", "20%"], ["Orders", "15%"], ["Sales", "15%"]].map(([h, w], i) => (
                        <th key={i} style={{ textAlign: "left", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: C.muted, fontWeight: 600, padding: "0 10px 10px", borderBottom: `1px solid ${C.border}`, width: w }}>{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map(e => {
                    const rs = roleStyle[e.role] || roleStyle["Waiter"];
                    return (
                        <tr key={e.id}
                            onMouseEnter={ev => ev.currentTarget.style.background = C.pale}
                            onMouseLeave={ev => ev.currentTarget.style.background = ""}>
                            <td style={{ padding: "10px", borderBottom: `1px solid ${C.pale}` }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.light, display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700, color: C.mid, flexShrink: 0 }}>{e.initials}</div>
                                    <span style={{ fontWeight: 500 }}>{e.name}</span>
                                </div>
                            </td>
                            <td style={{ padding: "10px", borderBottom: `1px solid ${C.pale}` }}>
                                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 600, background: rs.bg, color: rs.color }}>{e.role}</span>
                            </td>
                            <td style={{ padding: "10px", borderBottom: `1px solid ${C.pale}` }}>
                                <ShiftBadge onShift={e.onShift} />
                            </td>
                            <td style={{ padding: "10px", borderBottom: `1px solid ${C.pale}`, color: C.text }}>{e.orders || "—"}</td>
                            <td style={{ padding: "10px", borderBottom: `1px solid ${C.pale}`, fontFamily: "Cormorant Garamond, serif", fontSize: 15, fontWeight: 700, color: C.mid }}>
                                {e.sales > 0 ? `£${e.sales.toFixed(2)}` : "—"}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );

    /**
     * Basic Table Component for non-waiter staff
     * @component
     * @param {Object} props - Component props
     * @param {Array} props.rows - Employee data for kitchen or managers
     * @returns {JSX.Element} Basic employee table
     */
    const BasicTable = ({ rows }) => (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "fixed" }}>
            <thead>
                <tr>
                    {[["Employee", "30%"], ["Role", "20%"], ["Status", "20%"], ["", "15%"], ["", "15%"]].map(([h, w], i) => (
                        <th key={i} style={{ textAlign: "left", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: C.muted, fontWeight: 600, padding: "0 10px 10px", borderBottom: `1px solid ${C.border}`, width: w }}>{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map(e => {
                    const rs = roleStyle[e.role] || roleStyle["Waiter"];
                    return (
                        <tr key={e.id}
                            onMouseEnter={ev => ev.currentTarget.style.background = C.pale}
                            onMouseLeave={ev => ev.currentTarget.style.background = ""}>
                            <td style={{ padding: "10px", borderBottom: `1px solid ${C.pale}` }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.light, display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700, color: C.mid, flexShrink: 0 }}>{e.initials}</div>
                                    <span style={{ fontWeight: 500 }}>{e.name}</span>
                                </div>
                            </td>
                            <td style={{ padding: "10px", borderBottom: `1px solid ${C.pale}` }}>
                                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 600, background: rs.bg, color: rs.color }}>{e.role}</span>
                            </td>
                            <td style={{ padding: "10px", borderBottom: `1px solid ${C.pale}` }}>
                                <ShiftBadge onShift={e.onShift} />
                            </td>
                            <td style={{ padding: "10px", borderBottom: `1px solid ${C.pale}` }}></td>
                            <td style={{ padding: "10px", borderBottom: `1px solid ${C.pale}` }}></td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );

    return (
        <div style={{ gridColumn: "1/-1", background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 700, color: C.dark }}>Employee Overview</span>
            <div style={{ height: 1, background: C.border }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#2e6da4", marginBottom: 10 }}>Waiters</div>
                    <WaiterTable rows={waiters} />
                </div>
                <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#6b3fa0", marginBottom: 10 }}>Kitchen</div>
                    <BasicTable rows={kitchen} />
                </div>
                <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#3d4f6b", marginBottom: 10 }}>Managers</div>
                    <BasicTable rows={managers} />
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
                {[
                    { label: "Total Sales", val: `£${totalSales.toFixed(2)}` },
                    { label: "Orders Handled", val: totalOrders },
                ].map((s, i) => (
                    <div key={i} style={{ background: C.pale, borderRadius: 6, padding: "12px 14px", textAlign: "center" }}>
                        <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, fontWeight: 700, color: C.dark }}>{s.val}</div>
                        <div style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: C.muted, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// STOCK INPUT --------------------------
/**
 * Returns stock status based on level percentage
 * @function stockStatus
 * @param {number} level - Stock level percentage (0-100)
 * @returns {Object} Status with color, background, and label
 */
const stockStatus = (level) =>
    level >= 50 ? { color: C.green, bg: C.greenL, label: "Good" }
        : level >= 25 ? { color: C.amber, bg: C.amberL, label: "Low" }
            : { color: C.red, bg: C.redL, label: "Critical" };

/**
 * Stock Input Component
 * Editable input for updating stock levels
 * 
 * @component
 * @param {Object} props - Component props
 * @param {number} props.level - Current stock level
 * @param {Function} props.onRestock - Restock handler
 * @returns {JSX.Element} Stock level input field
 */            
function StockInput({ level, onRestock }) {
    const [val, setVal] = useState(Math.round(level));

    useEffect(() => {
        setVal(Math.round(level));
    }, [level]);

    return (
        <input
            type="number"
            min="0"
            max="100"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onBlur={() => {
                const parsed = parseFloat(val);
                if (!isNaN(parsed)) onRestock(Math.min(100, Math.max(0, parsed)));
            }}
            style={{ width: 60, fontSize: 11, padding: "3px 6px", border: `1px solid ${C.border}`, borderRadius: 4, fontFamily: "Jost, sans-serif", background: C.bg, color: C.text }}
        />
    );
}

/**
 * Stock Tab Component
 * Manages inventory levels with real-time monitoring and restocking
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.stock - Stock items array
 * @param {Function} props.fetchStock - Function to refresh stock data
 * @returns {JSX.Element} Stock management dashboard
 */
function StockTab({ stock, fetchStock }) {
    const [search, setSearch] = useState("");

    /**
     * Updates stock level for an ingredient
     * @async
     * @function restock
     * @param {number} stockId - Stock item ID
     * @param {number} level - New stock level
     */
    const restock = async (stockId, level) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/stock/restock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stock_id: stockId, level }),
            });
            
            if (response.ok) {
                await fetchStock();
                addToast(`Stock updated to ${level}%`);
            } else {
                addToast('Failed to update stock');
            }
        } catch (error) {
            addToast('Error updating stock');
        }
    };

    const q = search.trim().toLowerCase();
    const filtered = q
        ? stock.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q) ||
            s.usedIn.some(d => d.toLowerCase().includes(q))
        )
        : stock;

    const categories = [...new Set(filtered.map(s => s.category))];

    return (
        <div style={{ gridColumn: "1/-1", background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: 18, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 700, color: C.dark }}>Stock Levels</span>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button
                        onClick={() => stock.forEach(s => restock(s.id, 100))}
                        style={{ fontSize: 10, fontWeight: 600, padding: "4px 12px", borderRadius: 6, border: `1px solid ${C.green}`, background: C.greenL, color: C.green, cursor: "pointer", fontFamily: "Jost, sans-serif", letterSpacing: ".06em", textTransform: "uppercase" }}>
                        Restock All to 100
                    </button>
                </div>
            </div>
            <div style={{ height: 1, background: C.border }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 240px", gap: 12, alignItems: "stretch" }}>
                {[
                    { label: "Good (≥50%)", val: stock.filter(s => s.level >= 50).length, color: C.green, bg: C.greenL },
                    { label: "Low (25–49%)", val: stock.filter(s => s.level >= 25 && s.level < 50).length, color: C.amber, bg: C.amberL },
                    { label: "Critical (<25%)", val: stock.filter(s => s.level < 25).length, color: C.red, bg: C.redL },
                ].map((s, i) => (
                    <div key={i} style={{ background: s.bg, borderRadius: 6, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 30, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.val}</div>
                        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: s.color }}>{s.label}</div>
                    </div>
                ))}
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.bg, border: `1.5px solid ${q ? C.warm : C.border}`, borderRadius: 6, padding: "0 12px", transition: "border-color .15s" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={q ? C.warm : C.muted} strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search ingredient or dish…"
                        style={{ border: "none", background: "transparent", outline: "none", fontSize: 12, fontFamily: "Jost, sans-serif", color: C.text, width: "100%", padding: "10px 0" }} />
                    {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 14, lineHeight: 1, padding: "0 2px" }}>✕</button>}
                </div>
            </div>
            {q && (
                <div style={{ fontSize: 11, color: C.muted }}>
                    {filtered.length === 0 ? `No items match "${search}".` : `${filtered.length} item${filtered.length !== 1 ? "s" : ""} found for "${search}"`}
                </div>
            )}
            {categories.map(cat => (
                <div key={cat}>
                    <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: C.muted, fontWeight: 600, paddingBottom: 6, borderBottom: `1px solid ${C.border}`, marginBottom: 10 }}>{cat}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                        {filtered.filter(s => s.category === cat).map(s => {
                            const st = stockStatus(s.level);
                            const belowReorder = s.level <= s.reorderAt;
                            return (
                                <div key={s.id} style={{ background: C.bg, border: `1px solid ${belowReorder ? st.color + "66" : C.border}`, borderRadius: 7, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{s.name}</span>
                                        <span style={{ fontSize: 10, fontWeight: 700, color: st.color, background: st.bg, padding: "2px 8px", borderRadius: 10 }}>{st.label}</span>
                                    </div>
                                    <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.5 }}>{s.usedIn.join(" · ")}</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{ flex: 1, height: 8, background: C.pale, borderRadius: 4, overflow: "hidden" }}>
                                            <div style={{ height: "100%", width: `${s.level}%`, background: st.color, borderRadius: 4 }} />
                                        </div>
                                        <span style={{ fontSize: 12, color: C.muted, width: 34, textAlign: "right", flexShrink: 0 }}>{s.level}%</span>
                                    </div>
                                    {belowReorder && (
                                        <div style={{ fontSize: 10, color: st.color, fontWeight: 600 }}>
                                            ⚠ Below reorder point ({s.reorderAt}%)
                                        </div>
                                    )}
                                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                        <StockInput level={s.level} onRestock={(newLevel) => restock(s.id, newLevel)} />
                                        <button
                                            onClick={() => restock(s.id, 100)}
                                            style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 4, border: `1px solid ${C.green}`, background: C.greenL, color: C.green, cursor: "pointer", fontFamily: "Jost, sans-serif" }}>
                                            Restock to 100
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
            {filtered.length === 0 && q && (
                <div style={{ textAlign: "center", padding: "32px 0", color: C.muted, fontSize: 13 }}>
                    No ingredients found for <strong>"{search}"</strong>
                </div>
            )}
        </div>
    );
}

// WAITER ASSISTANCE ALERT --------------------------
/**
 * Custom hook to listen for waiter assistance alerts from localStorage
 * @function useWaiterAlerts
 * @param {Function} setNotifications - State setter for notifications
 * @param {Function} addToast - Toast notification handler
 */
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

// MAIN DASHBOARD --------------------------
/**
 * Manager Dashboard Main Component
 * Provides comprehensive management interface with tabs for:
 * - Table Overview: Real-time table status and occupancy
 * - Menu Management: Item availability, pricing, margin tracking
 * - Employee Management: Staff shifts, performance metrics
 * - Stock Management: Inventory levels, restocking, alerts
 * 
 * @module ManagerDashboard
 * @component
 * @returns {JSX.Element} Complete manager dashboard with all management tools
 */
export default function ManagerDashboard() {
    const [tab, setTab] = useState("Overview");
    const [tables, setTables] = useState([]);
    const [menu, setMenu] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [staffInfo, setStaffInfo] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.role !== 'manager' && sessionStorage.getItem('role') !== 'manager') {
            navigate('/');
        }
    }, []);

    // FETCH EMPLOYEES --------------------------
    useEffect(() => {
        const fetchEmployees = () => {
            fetch('http://127.0.0.1:8000/staff')
                .then(r => r.json())
                .then(data => setEmployees(data.map(s => ({
                    id: s.staff_id,
                    initials: s.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(),
                    name: s.name.replace(/([A-Z])/g, ' $1').trim().replace(/^./, c => c.toUpperCase()),
                    role: s.role === "Kitchen Staff" ? "Kitchen" : s.role === "Manager" ? "Manager" : "Waiter",
                    onShift: s.on_shift === 1,
                    orders: s.orders_handled,
                    sales: s.total_sales,
                }))))
                .catch(() => { });
        };
        fetchEmployees();
        const poll = setInterval(fetchEmployees, 3000);
        return () => clearInterval(poll);
    }, []);


    // FETCH STAFF INFO : FOR LOGGED-IN MANAGER --------------------------
    useEffect(() => {
        const staffId = location.state?.staff_id;
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
    }, [location]);

    // STOCK MANAGEMENT --------------------------
    const [stock, setStock] = useState([]);
    const prevStockRef = useRef({});

    /**
     * Fetches stock data from backend and triggers alerts for low stock
     * @async
     * @function fetchStock
     */
    const fetchStock = () => {
        fetch('http://127.0.0.1:8000/stock')
            .then(r => r.json())
            .then(data => {
                const mapped = data.map(s => ({
                    id: s.stock_id,
                    name: s.name,
                    category: s.category,
                    level: s.level,
                    unit: s.unit,
                    reorderAt: s.reorder_at,
                    usedIn: s.used_in.split(', '),
                }));

                mapped.forEach(s => {
                    const prev = prevStockRef.current[s.id] ?? 100;
                    if (prev > s.level) {
                        if (prev >= 25 && s.level < 25) {
                            setNotifications(n => [{
                                id: Date.now() + s.id,
                                title: `${s.name} is critically low`,
                                body: `Stock has dropped to ${s.level.toFixed(0)}% — reorder soon.`,
                                type: "urgent",
                                time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
                                read: false,
                            }, ...n]);
                        } else if (prev >= 50 && s.level < 50 && s.level >= 25) {
                            setNotifications(n => [{
                                id: Date.now() + s.id,
                                title: `${s.name} is running low`,
                                body: `Stock has dropped to ${s.level.toFixed(0)}% — consider restocking.`,
                                type: "warn",
                                time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
                                read: false,
                            }, ...n]);
                        }
                    }
                    if (s.level >= 50) {
                        setNotifications(n => n.filter(notif => !notif.title?.includes(s.name)));
                    } else if (s.level >= 25 && s.level < 50) {
                        setNotifications(n => n.filter(notif => !(notif.title?.includes(s.name) && notif.type === "urgent")));
                        if (prev < 25) {
                            setNotifications(n => [{
                                id: Date.now() + s.id,
                                title: `${s.name} is running low`,
                                body: `Stock is at ${s.level.toFixed(0)}% — consider restocking.`,
                                type: "warn",
                                time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
                                read: false,
                            }, ...n]);
                        }
                    } else if (s.level < 25) {
                        setNotifications(n => n.filter(notif => !(notif.title?.includes(s.name) && notif.type === "warn")));
                    }
                    prevStockRef.current[s.id] = s.level;
                });

                setStock(mapped);
            })
            .catch(() => { });
    };

    useEffect(() => {
        fetchStock();
        const poll = setInterval(fetchStock, 3000);
        return () => clearInterval(poll);
    }, []);

    // NOTIFS --------------------------
    const [notifications, setNotifications] = useState(() => {
        try { return JSON.parse(localStorage.getItem("oaxaca_manager_notifications") ?? "[]"); }
        catch { return []; }
    });
    const [toasts, setToasts] = useState([]);
    const [showNotifs, setShowNotifs] = useState(false);
    const [showAccount, setShowAccount] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    // FETCH MENU FROM API --------------------------
    useEffect(() => {
    fetch('http://127.0.0.1:8000/menu_items')
        .then(r => r.json())
        .then(data => setMenu(data.map(item => ({
            id: item.item_id,
            name: item.item_name,
            price: item.price,
            cogs: item.cogs,
            section: item.section,
            avail: item.available === 1,
            dietary: item.dietary ? item.dietary.split(',').map(s => s.trim()) : [],
            allergens: item.allergens ? item.allergens.split(',').map(s => s.trim()) : [],
            calories: item.calories,
            description: item.description,
        }))))
        .catch(() => { });
}, []);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const [tablesRes, ordersRes] = await Promise.all([
                    fetch('http://127.0.0.1:8000/tables'),
                    fetch('http://127.0.0.1:8000/orders'),
                ]);
                const tablesData = await tablesRes.json();
                const ordersData = await ordersRes.json();

                const activeOrders = ordersData.filter(o => o.status !== "Cancelled");

                setTables(tablesData.map(t => {
                    const tableOrders = activeOrders.filter(o => o.table_id === t.table_id);
                    const hasOrders = tableOrders.length > 0;
                    const latestOrder = tableOrders[tableOrders.length - 1];
                    const status = !hasOrders ? "Free"
                        : latestOrder.status === "Pending" ? "Ordering"
                            : latestOrder.status === "Waiter Confirmed" ? "Ordering"
                                : latestOrder.status === "In Progress" ? "Preparing"
                                    : latestOrder.status === "Ready" ? "Service"
                                        : latestOrder.status === "Completed" ? "Bill Req."
                                            : latestOrder.status === "Paid" ? "Free"
                                                : "Free";

                    return {
                        id: t.table_id,
                        status,
                        bill: null,
                        orders: tableOrders.flatMap(o =>
                            o.items.map(i => ({ name: i.item_name, qty: i.quantity, price: i.price }))
                        ),
                    };
                }));
            } catch (_) { }
        };
        fetchTables();
        const poll = setInterval(fetchTables, 3000);
        return () => clearInterval(poll);
    }, []);

    const notifRef = useRef(null);
    const accountRef = useRef(null);
    useOutsideClick(notifRef, () => setShowNotifs(false));
    useOutsideClick(accountRef, () => setShowAccount(false));

    /**
     * Adds a toast notification that auto-dismisses
     * @function addToast
     * @param {string} msg - Toast message
     */
    const addToast = (msg) => {
        const id = Date.now();
        setToasts(p => [...p, { id, msg }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 2800);
    };
    useEffect(() => {
        localStorage.setItem("oaxaca_manager_notifications", JSON.stringify(notifications));
    }, [notifications]);
    useWaiterAlerts(setNotifications, addToast);

    // UPDATE MENU
    useEffect(() => {
        const handler = (e) => {
            if (e.key !== 'oaxaca_menu_update') return;
            fetch('http://127.0.0.1:8000/menu_items')
                .then(r => r.json())
                .then(data => setMenu(data.map(item => ({
                    id: item.item_id,
                    name: item.item_name,
                    price: item.price,
                    cogs: item.cogs,
                    section: INIT_MENU.find(m => m.id === item.item_id)?.section ?? "Mains",
                    avail: item.available === 1,
                    dietary: INIT_MENU.find(m => m.id === item.item_id)?.dietary ?? [],
                    allergens: INIT_MENU.find(m => m.id === item.item_id)?.allergens ?? [],
                    calories: INIT_MENU.find(m => m.id === item.item_id)?.calories ?? "",
                    description: INIT_MENU.find(m => m.id === item.item_id)?.description ?? "",
                }))));
        };
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, []);

    const unread = notifications.filter(n => !n.read).length;
    
    return (
        <div style={{ fontFamily: "Jost, sans-serif", background: C.bg, color: C.text, minHeight: "100vh" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500;600&display=swap');
                @keyframes fadeInUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
                @keyframes dropIn   { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
                * { box-sizing:border-box; margin:0; padding:0; }
            `}</style>

            <nav style={{ background: C.dark, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", height: 56, position: "relative", zIndex: 700 }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, letterSpacing: ".25em", color: C.bg, fontWeight: 600 }}>OAXACA</span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(245,240,232,.55)", fontWeight: 500 }}>Manager View</span>
                    <div ref={notifRef} style={{ position: "relative" }}>
                        <div onClick={() => { setShowNotifs(v => !v); setShowAccount(false); }}
                            style={{ width: 36, height: 36, borderRadius: "50%", border: `1.5px solid ${showNotifs ? C.warm : "rgba(245,240,232,.3)"}`, background: showNotifs ? "rgba(196,118,58,.3)" : "rgba(245,240,232,.08)", display: "grid", placeItems: "center", cursor: "pointer", color: C.bg, position: "relative", transition: "all .15s", userSelect: "none" }}>
                            <IconBell />
                            {unread > 0 && <div style={{ position: "absolute", top: -3, right: -3, minWidth: 16, height: 16, borderRadius: 8, background: C.red, border: `2px solid ${C.dark}`, display: "grid", placeItems: "center", fontSize: 8, fontWeight: 700, color: "white", padding: "0 3px" }}>{unread > 9 ? "9+" : unread}</div>}
                        </div>
                        {showNotifs && <NotificationsPanel notifications={notifications} setNotifications={setNotifications} />}
                    </div>
                    <div ref={accountRef} style={{ position: "relative" }}>
                        <div onClick={() => { setShowAccount(v => !v); setShowNotifs(false); }}
                            style={{ width: 36, height: 36, borderRadius: "50%", background: showAccount ? C.mid : C.warm, display: "grid", placeItems: "center", cursor: "pointer", color: "white", fontSize: 11, fontWeight: 700, border: `2px solid ${showAccount ? C.light : "transparent"}`, transition: "all .15s", userSelect: "none" }}>
                            {staffInfo?.name ? staffInfo.name.slice(0, 2).toUpperCase() : "??"}
                        </div>
                        {showAccount && <AccountPanel staffInfo={staffInfo} onLogout={async () => {
                            if (staffInfo?.staff_id) {
                                await fetch(`http://127.0.0.1:8000/auth/logout/${staffInfo.staff_id}`, { method: 'POST' }).catch(() => { });
                            }
                            localStorage.removeItem("oaxaca_manager_notifications");
                            setShowAccount(false);
                            setLoggingOut(true);
                            setTimeout(() => { navigate('/'); }, 2500);
                        }} />}
                    </div>
                </div>
            </nav>

            {notifications.filter(n => !n.read).length > 0 && (
                <div style={{ background: "#c4763a", color: "white", padding: "9px 28px", display: "flex", alignItems: "center", gap: 10, fontSize: 12, fontWeight: 600, letterSpacing: ".04em" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white", animation: "pulse 1.4s infinite", flexShrink: 0 }} />
                    {notifications.filter(n => !n.read).length} unread notification{notifications.filter(n => !n.read).length > 1 ? "s" : ""} — check alerts
                </div>
            )}

            <div style={{ padding: "16px 28px 0", display: "flex", gap: 4, borderBottom: `1.5px solid ${C.border}` }}>
                {["Overview", "Menu", "Employees", "Stock"].map(t => (
                    <div key={t} onClick={() => setTab(t)}
                        style={{ padding: "9px 18px", fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 500, cursor: "pointer", borderBottom: `2.5px solid ${tab === t ? C.mid : "transparent"}`, marginBottom: -1.5, color: tab === t ? C.mid : C.muted, transition: "color .2s", userSelect: "none" }}>
                        {t}
                    </div>
                ))}
            </div>

            <div style={{ padding: "20px 28px 40px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {tab === "Overview" && <OverviewTab tables={tables} />}
                {tab === "Employees" && <EmployeesTab employees={employees} />}
                {tab === "Menu" && <MenuTab menu={menu} setMenu={setMenu} addToast={addToast} stock={stock} />}
                {tab === "Stock" && <StockTab stock={stock} fetchStock={fetchStock} />}
            </div>

            <div style={{ position: "fixed", bottom: 24, right: 24, display: "flex", flexDirection: "column", gap: 8, zIndex: 9999, pointerEvents: "none" }}>
                {toasts.map(t => (
                    <div key={t.id} style={{ background: C.dark, color: C.bg, padding: "10px 18px", borderRadius: 6, fontSize: 12, fontFamily: "Jost, sans-serif", fontWeight: 500, boxShadow: "0 4px 16px rgba(0,0,0,.25)", animation: "fadeInUp .2s ease" }}>{t.msg}</div>
                ))}
            </div>
            {loggingOut && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ background: "#faf7f2", border: "1.5px solid #d4b896", borderRadius: 12, padding: "40px 48px", textAlign: "center", boxShadow: "0 12px 40px rgba(0,0,0,.25)", animation: "dropIn .2s ease" }}>
                        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#d4edda", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" />
                                <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" />
                            </svg>
                        </div>
                        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: "#2D2218", marginBottom: 8 }}>See you soon!</h2>
                        <p style={{ fontSize: 13, color: "#7a5c44", marginBottom: 6 }}>You have been signed out successfully.</p>
                        <p style={{ fontSize: 11, color: "#8b4513" }}>Returning to home...</p>
                    </div>
                </div>
            )}
        </div>
    );
}