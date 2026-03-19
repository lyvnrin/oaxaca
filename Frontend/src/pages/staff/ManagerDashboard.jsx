import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const C = {
    bg: "#f5f0e8", panel: "#faf7f2", dark: "#2D2218", mid: "#8b4513",
    warm: "#c4763a", light: "#e8d5b7", pale: "#f0e6d3",
    green: "#4a7c59", greenL: "#d4edda",
    red: "#c0392b", redL: "#fde8e6",
    amber: "#d4870e", amberL: "#fef3cd",
    text: "#2c1810", muted: "#7a5c44", border: "#d4b896",
};

const INIT_TABLES = [
    { id: 1, status: "Ordering", bill: null, orders: [{ name: "Guacamole & Chips", qty: 1, price: 7.00 }, { name: "Ceviche Verde", qty: 1, price: 12.00 }, { name: "Mezcal Margarita", qty: 2, price: 11.00 }] },
    { id: 2, status: "Bill Req.", bill: null, orders: [{ name: "Mole Negro Chicken", qty: 2, price: 18.00 }, { name: "Barbacoa Tacos", qty: 1, price: 16.00 }, { name: "Black Bean Pot", qty: 2, price: 4.00 }, { name: "Horchata", qty: 1, price: 4.50 }, { name: "Water", qty: 1, price: 2.50 }] },
    { id: 3, status: "Bill Req.", bill: 62.00, orders: [{ name: "Tlayuda Tostada", qty: 2, price: 9.00 }, { name: "Snapper Veracruz", qty: 1, price: 22.00 }, { name: "Churro Sundae", qty: 1, price: 8.00 }, { name: "Mezcal Margarita", qty: 2, price: 11.00 }] },
    { id: 4, status: "Free", bill: null, orders: [] },
    { id: 5, status: "Preparing", bill: null, orders: [{ name: "Elote Esquites", qty: 1, price: 8.00 }, { name: "Portobello Enchiladas", qty: 1, price: 14.00 }] },
    { id: 6, status: "Service", bill: null, orders: [] },
    { id: 7, status: "Free", bill: null, orders: [] },
    { id: 8, status: "Bill Req.", bill: null, orders: [{ name: "Barbacoa Tacos", qty: 2, price: 16.00 }, { name: "Mexican Rice", qty: 2, price: 4.00 }, { name: "Mango Sorbet", qty: 2, price: 6.00 }, { name: "Mexican Lager", qty: 2, price: 5.00 }] },
    { id: 9, status: "Free", bill: null, orders: [] },
    { id: 10, status: "Ordering", bill: null, orders: [{ name: "Guacamole & Chips", qty: 2, price: 7.00 }, { name: "Hibiscus Agua Fresca", qty: 2, price: 4.00 }] },
    { id: 11, status: "Free", bill: null, orders: [] },
    { id: 12, status: "Bill Req.", bill: null, orders: [{ name: "Mole Negro Chicken", qty: 1, price: 18.00 }, { name: "Snapper Veracruz", qty: 1, price: 22.00 }, { name: "Corn Tortillas", qty: 1, price: 3.00 }] },
    { id: 13, status: "Free", bill: null, orders: [] },
    { id: 14, status: "Preparing", bill: null, orders: [{ name: "Mezcal Flan", qty: 1, price: 7.00 }] },
    { id: 15, status: "Free", bill: null, orders: [] },
];

const INIT_NOTIFICATIONS = [];

const INIT_MENU = [
    { id: 1, section: "Starters", name: "Guacamole & Chips", cogs: 2.80, price: 7.00, avail: true, description: "Hand-mashed avocado, jalapeño, lime zest & Oaxacan pink salt.", dietary: ["Vegan", "Gluten-Free"], allergens: [], calories: "350 kcal" },
    { id: 2, section: "Starters", name: "Tlayuda Tostada", cogs: 3.60, price: 9.00, avail: true, description: "Crispy corn base, black bean, quesillo, chorizo & fresh avocado.", dietary: ["Gluten-Free"], allergens: ["Milk", "Soy"], calories: "500 kcal" },
    { id: 3, section: "Starters", name: "Ceviche Verde", cogs: 4.80, price: 12.00, avail: true, description: "Sea bass, tomatillo, cucumber, coriander & tiger's milk.", dietary: ["Gluten-Free"], allergens: ["Fish"], calories: "180 kcal" },
    { id: 4, section: "Starters", name: "Elote Esquites", cogs: 3.20, price: 8.00, avail: true, description: "Charred corn, crema, cotija cheese, ancho chilli & epazote.", dietary: ["Vegetarian", "Gluten-Free"], allergens: ["Milk"], calories: "250 kcal" },
    { id: 5, section: "Mains", name: "Mole Negro Chicken", cogs: 6.50, price: 18.00, avail: true, description: "Free-range thigh braised in a 30-ingredient black mole, sesame rice.", dietary: [], allergens: ["Soy", "Nuts"], calories: "600 kcal" },
    { id: 6, section: "Mains", name: "Barbacoa Tacos", cogs: 5.50, price: 16.00, avail: true, description: "Slow-braised beef cheek, white onion, coriander & salsa roja. Three pieces.", dietary: [], allergens: [], calories: "300 kcal (per taco)" },
    { id: 7, section: "Mains", name: "Portobello Enchiladas", cogs: 4.20, price: 14.00, avail: false, description: "Roasted mushrooms, black bean, chipotle sauce & cashew crema.", dietary: ["Vegan"], allergens: [], calories: "400 kcal" },
    { id: 8, section: "Mains", name: "Snapper Veracruz", cogs: 7.80, price: 22.00, avail: true, description: "Pan-seared whole snapper, olives, capers & fresh tomato broth.", dietary: ["Gluten-Free"], allergens: ["Fish"], calories: "450 kcal" },
    { id: 9, section: "Desserts", name: "Churro Sundae", cogs: 2.10, price: 8.00, avail: true, description: "Crispy churros, vanilla bean ice cream & dark chocolate mole sauce.", dietary: ["Vegetarian"], allergens: ["Milk", "Gluten", "Eggs"], calories: "550 kcal" },
    { id: 10, section: "Desserts", name: "Mezcal Flan", cogs: 2.00, price: 7.00, avail: true, description: "Silky caramel custard with a smoky mezcal caramel drizzle.", dietary: ["Vegetarian", "Gluten-Free"], allergens: ["Milk", "Eggs"], calories: "320 kcal" },
    { id: 11, section: "Desserts", name: "Mango Sorbet", cogs: 1.40, price: 6.00, avail: true, description: "Alphonso mango, chilli salt & fresh lime. Completely dairy free.", dietary: ["Vegan", "Gluten-Free"], allergens: [], calories: "120 kcal" },
    { id: 12, section: "Sides", name: "Black Bean Pot", cogs: 1.20, price: 4.00, avail: true, description: "Slow-cooked with avocado leaf, epazote & lime crema.", dietary: ["Vegan", "Gluten-Free"], allergens: [], calories: "200 kcal" },
    { id: 13, section: "Sides", name: "Corn Tortillas", cogs: 0.80, price: 3.00, avail: true, description: "Fresh nixtamal masa, made in-house daily. Four pieces.", dietary: ["Vegan", "Gluten-Free"], allergens: [], calories: "60 kcal (per tortilla)" },
    { id: 14, section: "Sides", name: "Pickled Jalapeños", cogs: 0.60, price: 3.00, avail: true, description: "House-pickled chillies, carrots & white onion in apple cider vinegar.", dietary: ["Vegan", "Gluten-Free"], allergens: [], calories: "5 kcal (per tbsp)" },
    { id: 15, section: "Sides", name: "Mexican Rice", cogs: 0.90, price: 4.00, avail: true, description: "Tomato-braised rice with cumin, garlic & fresh coriander.", dietary: ["Vegan", "Gluten-Free"], allergens: [], calories: "200 kcal" },
    { id: 16, section: "Drinks", name: "Hibiscus Agua Fresca", cogs: 1.00, price: 4.00, avail: true, description: "House-dried hibiscus, lime, cane sugar & still water.", dietary: ["Vegan", "Gluten-Free"], allergens: [], calories: "70 kcal (per cup)" },
    { id: 17, section: "Drinks", name: "Mezcal Margarita", cogs: 3.50, price: 11.00, avail: true, description: "Joven mezcal, fresh lime juice, agave syrup & smoked salt rim.", dietary: ["Vegan", "Gluten-Free"], allergens: [], calories: "250 kcal" },
    { id: 18, section: "Drinks", name: "Horchata", cogs: 1.20, price: 4.50, avail: true, description: "Rice milk, cinnamon, vanilla & a hint of almond. Served chilled.", dietary: ["Vegan", "Gluten-Free"], allergens: ["Nuts"], calories: "150 kcal (per cup)" },
    { id: 19, section: "Drinks", name: "Mexican Lager", cogs: 1.80, price: 5.00, avail: true, description: "Ice-cold bottle served with lime. Ask your server for today's selection.", dietary: [], allergens: [], calories: "150 kcal (per bottle)" },
    { id: 20, section: "Drinks", name: "Water", cogs: 0.20, price: 2.50, avail: true, description: "Ice-cold and refreshing. Ask your server for alternative temperatures.", dietary: [], allergens: [], calories: "0 kcal" },
];

const INIT_EMPLOYEES = [
    { id: 1, initials: "SR", name: "Sofia R.", role: "Waiter", tables: 6, orders: 22, sales: 342, avgTime: "6m 40s", status: "Active" },
    { id: 2, initials: "JM", name: "James M.", role: "Waiter", tables: 5, orders: 18, sales: 268, avgTime: "7m 20s", status: "Active" },
    { id: 3, initials: "AK", name: "Aisha K.", role: "Kitchen", tables: 0, orders: 31, sales: 0, avgTime: "8m 10s", status: "Active" },
    { id: 4, initials: "TL", name: "Tom L.", role: "Kitchen", tables: 0, orders: 28, sales: 0, avgTime: "9m 05s", status: "Active" },
    { id: 5, initials: "PR", name: "Priya R.", role: "Waiter", tables: 4, orders: 14, sales: 210, avgTime: "6m 55s", status: "On Break" },
    { id: 6, initials: "CN", name: "Carlos N.", role: "Kitchen", tables: 0, orders: 19, sales: 0, avgTime: "7m 30s", status: "Active" },
    { id: 7, initials: "EM", name: "Eve M.", role: "Waiter", tables: 3, orders: 11, sales: 174, avgTime: "8m 00s", status: "Active" },
];

const calcMargin = (cogs, price) => price > 0 ? Math.round((1 - cogs / price) * 100) : 0;
const calcMinPrice = (cogs) => +(cogs / 0.4).toFixed(2);

const marginColor = (m) => {
    if (m >= 60) return { bg: C.greenL, text: C.green, label: `${m}%` };
    if (m >= 50) return { bg: C.amberL, text: C.amber, label: `${m}% !` };
    return { bg: C.redL, text: C.red, label: `${m}% ⚠` };
};

const tileColors = (status) => ({
    "Free": { bg: "#f0f7f2", border: "#b8d4c0", num: "#4a7c59", label: "#4a7c59" },
    "Ordering": { bg: "#fff8f0", border: "#f0c97a", num: "#d4870e", label: "#d4870e" },
    "Preparing": { bg: "#f0f4ff", border: "#9db4e8", num: "#3b5fc0", label: "#3b5fc0" },
    "Bill Req.": { bg: "#fde8e6", border: "#e8a09b", num: "#c0392b", label: "#c0392b" },
    "Service": { bg: "#fef9e7", border: "#f7dc6f", num: "#9a7d0a", label: "#9a7d0a" },
}[status] || { bg: "#f0f7f2", border: "#b8d4c0", num: C.green, label: C.green });

const urgencyColor = { urgent: C.red, normal: C.amber, info: C.green };
const notifTypeColor = { urgent: C.red, warn: C.amber, info: C.green };

function useOutsideClick(ref, cb) {
    useEffect(() => {
        const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) cb(); };
        document.addEventListener("mousedown", fn);
        return () => document.removeEventListener("mousedown", fn);
    }, [ref, cb]);
}

const IconBell = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
const IconDoor = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;

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

function NotificationsPanel({ notifications, setNotifications }) {
    const [filter, setFilter] = useState("All");
    const unread = notifications.filter(n => !n.read).length;
    const markRead = (id) => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
    const dismiss = (id) => setNotifications(p => p.filter(n => n.id !== id));
    const markAll = () => setNotifications(p => p.map(n => ({ ...n, read: true })));
    const clearAll = () => setNotifications([]);
    const notifTypeColor = { urgent: C.red, warn: C.amber, info: C.green };
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
                                {n.title ?? `Table ${n.table} — Order #${n.order}`}
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

function AccountPanel({ staffInfo }) {
    const navigate = useNavigate();
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
                if (staffInfo?.staff_id) {
                    await fetch(`http://127.0.0.1:8000/auth/logout/${staffInfo.staff_id}`, { method: 'POST' }).catch(() => { });
                }
                navigate('/');
            }}
                style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "background .15s", borderRadius: "0 0 10px 10px" }}
                onMouseEnter={e => e.currentTarget.style.background = C.redL}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <IconDoor /><span style={{ fontSize: 13, fontWeight: 600, color: C.red }}>Sign Out</span>
            </div>
        </div>
    );
}

function OverviewTab({ tables }) {
    const occupied = tables.filter(t => t.status !== "Free").length;
    const serviceCount = tables.filter(t => t.status === "Service" || t.status === "Bill Req.").length;
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

function MenuTab({ menu, setMenu, addToast, stock }) {
    const sections = ["Starters", "Mains", "Desserts", "Sides", "Drinks"];
    const available = menu.filter(m => m.avail).length;
    const unavailable = menu.filter(m => !m.avail).length;
    const belowMgn = menu.filter(m => calcMargin(m.cogs, m.price) < 60);
    const [editingPrice, setEditingPrice] = useState(null);
    const [priceInput, setPriceInput] = useState("");
    const [priceError, setPriceError] = useState("");

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

    const startEditPrice = (item) => {
        setEditingPrice(item.id);
        setPriceInput(item.price.toFixed(2));
        setPriceError("");
    };

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

const INIT_STOCK = [
    { id: 1, name: "Avocado", category: "Produce", level: 75, unit: "units", reorderAt: 30, usedIn: ["Guacamole & Chips", "Tlayuda Tostada", "+ Extra Guacamole"] },
    { id: 2, name: "Lime", category: "Produce", level: 85, unit: "units", reorderAt: 25, usedIn: ["Guacamole & Chips", "Ceviche Verde", "Barbacoa Tacos", "Hibiscus Agua Fresca", "Mezcal Margarita", "Mango Sorbet"] },
    { id: 3, name: "Jalapeño", category: "Produce", level: 60, unit: "units", reorderAt: 20, usedIn: ["Guacamole & Chips", "Pickled Jalapeños", "+ Extra Jalapeños"] },
    { id: 4, name: "Corn (fresh)", category: "Produce", level: 55, unit: "kg", reorderAt: 25, usedIn: ["Elote Esquites"] },
    { id: 5, name: "Tomatillo", category: "Produce", level: 48, unit: "kg", reorderAt: 20, usedIn: ["Ceviche Verde"] },
    { id: 6, name: "Mango (Alphonso)", category: "Produce", level: 50, unit: "units", reorderAt: 20, usedIn: ["Mango Sorbet"] },
    { id: 7, name: "Portobello Mushrooms", category: "Produce", level: 40, unit: "kg", reorderAt: 20, usedIn: ["Portobello Enchiladas"] },
    { id: 8, name: "White Onion", category: "Produce", level: 65, unit: "kg", reorderAt: 15, usedIn: ["Barbacoa Tacos", "Pickled Jalapeños"] },
    { id: 9, name: "Red Onion", category: "Produce", level: 70, unit: "kg", reorderAt: 15, usedIn: ["Cochinita Pibil", "+ Pickled Onion"] },
    { id: 10, name: "Cucumber", category: "Produce", level: 55, unit: "units", reorderAt: 15, usedIn: ["Ceviche Verde"] },
    { id: 11, name: "Coriander", category: "Produce", level: 72, unit: "bunches", reorderAt: 20, usedIn: ["Ceviche Verde", "Barbacoa Tacos", "Mexican Rice"] },
    { id: 12, name: "Hibiscus (dried)", category: "Produce", level: 58, unit: "kg", reorderAt: 20, usedIn: ["Hibiscus Agua Fresca"] },
    { id: 13, name: "Mint", category: "Produce", level: 65, unit: "bunches", reorderAt: 15, usedIn: ["Horchata"] },
    { id: 14, name: "Tomatoes", category: "Produce", level: 62, unit: "kg", reorderAt: 20, usedIn: ["Snapper Veracruz", "Mexican Rice"] },
    { id: 15, name: "Olives", category: "Produce", level: 44, unit: "kg", reorderAt: 15, usedIn: ["Snapper Veracruz"] },
    { id: 16, name: "Capers", category: "Produce", level: 50, unit: "kg", reorderAt: 15, usedIn: ["Snapper Veracruz"] },
    { id: 17, name: "Chilli Salt (Mango)", category: "Produce", level: 68, unit: "units", reorderAt: 15, usedIn: ["Mango Sorbet"] },
    { id: 18, name: "Sea Bass / Snapper", category: "Protein", level: 12, unit: "kg", reorderAt: 30, usedIn: ["Ceviche Verde", "Snapper Veracruz"] },
    { id: 19, name: "Beef Cheek", category: "Protein", level: 60, unit: "kg", reorderAt: 25, usedIn: ["Barbacoa Tacos", "+ Extra Beef"] },
    { id: 20, name: "Chicken (free-range)", category: "Protein", level: 55, unit: "kg", reorderAt: 25, usedIn: ["Mole Negro Chicken"] },
    { id: 21, name: "Pork Shoulder", category: "Protein", level: 50, unit: "kg", reorderAt: 20, usedIn: ["Cochinita Pibil"] },
    { id: 22, name: "Chorizo", category: "Protein", level: 55, unit: "kg", reorderAt: 25, usedIn: ["Tlayuda Tostada", "+ Extra Chorizo"] },
    { id: 23, name: "Cotija Cheese", category: "Dairy", level: 40, unit: "kg", reorderAt: 30, usedIn: ["Elote Esquites", "Tlayuda Tostada", "+ Extra Cheese"] },
    { id: 24, name: "Quesillo", category: "Dairy", level: 35, unit: "kg", reorderAt: 25, usedIn: ["Tlayuda Tostada", "+ Extra Quesillo"] },
    { id: 25, name: "Crema / Sour Cream", category: "Dairy", level: 68, unit: "kg", reorderAt: 25, usedIn: ["Elote Esquites", "Black Bean Pot", "+ Extra Sour Cream"] },
    { id: 26, name: "Eggs", category: "Dairy", level: 80, unit: "units", reorderAt: 30, usedIn: ["Churro Sundae", "Mezcal Flan"] },
    { id: 27, name: "Vanilla Ice Cream", category: "Dairy", level: 55, unit: "litres", reorderAt: 20, usedIn: ["Churro Sundae"] },
    { id: 28, name: "Oat Milk", category: "Dairy", level: 60, unit: "litres", reorderAt: 20, usedIn: ["Mexican Hot Chocolate"] },
    { id: 29, name: "Corn Masa (nixtamal)", category: "Dry Goods", level: 35, unit: "kg", reorderAt: 40, usedIn: ["Corn Tortillas", "Tlayuda Tostada"] },
    { id: 30, name: "Black Beans (dried)", category: "Dry Goods", level: 90, unit: "kg", reorderAt: 20, usedIn: ["Black Bean Pot", "Tlayuda Tostada", "Portobello Enchiladas"] },
    { id: 31, name: "Rice", category: "Dry Goods", level: 78, unit: "kg", reorderAt: 20, usedIn: ["Mexican Rice", "Mole Negro Chicken", "Horchata"] },
    { id: 32, name: "Ancho Chilli", category: "Dry Goods", level: 22, unit: "units", reorderAt: 25, usedIn: ["Elote Esquites", "Mole Negro Chicken", "+ Extra Chilli"] },
    { id: 33, name: "Achiote Paste", category: "Dry Goods", level: 45, unit: "kg", reorderAt: 20, usedIn: ["Cochinita Pibil"] },
    { id: 34, name: "Epazote", category: "Dry Goods", level: 50, unit: "bunches", reorderAt: 15, usedIn: ["Elote Esquites", "Black Bean Pot"] },
    { id: 35, name: "Sesame Seeds", category: "Dry Goods", level: 60, unit: "kg", reorderAt: 15, usedIn: ["Mole Negro Chicken"] },
    { id: 36, name: "Chipotle Sauce", category: "Dry Goods", level: 42, unit: "kg", reorderAt: 15, usedIn: ["Portobello Enchiladas"] },
    { id: 37, name: "Dark Chocolate", category: "Dry Goods", level: 48, unit: "kg", reorderAt: 20, usedIn: ["Churro Sundae", "+ Extra Chocolate Sauce"] },
    { id: 38, name: "Cashew Crema", category: "Dry Goods", level: 38, unit: "kg", reorderAt: 20, usedIn: ["Portobello Enchiladas"] },
    { id: 39, name: "Cinnamon", category: "Dry Goods", level: 70, unit: "units", reorderAt: 15, usedIn: ["Horchata"] },
    { id: 40, name: "Vanilla Extract", category: "Dry Goods", level: 65, unit: "units", reorderAt: 15, usedIn: ["Horchata", "Churro Sundae"] },
    { id: 41, name: "Habanero Salsa", category: "Dry Goods", level: 55, unit: "kg", reorderAt: 15, usedIn: ["Cochinita Pibil", "+ Extra Habanero"] },
    { id: 42, name: "Salsa Verde", category: "Dry Goods", level: 60, unit: "kg", reorderAt: 15, usedIn: ["Barbacoa Tacos", "+ Salsa Verde"] },
    { id: 43, name: "Apple Cider Vinegar", category: "Dry Goods", level: 72, unit: "litres", reorderAt: 15, usedIn: ["Pickled Jalapeños"] },
    { id: 44, name: "Cumin", category: "Dry Goods", level: 80, unit: "units", reorderAt: 15, usedIn: ["Mexican Rice"] },
    { id: 45, name: "Almond (extract)", category: "Dry Goods", level: 55, unit: "units", reorderAt: 15, usedIn: ["Horchata"] },
    { id: 46, name: "Caramel", category: "Dry Goods", level: 48, unit: "kg", reorderAt: 20, usedIn: ["Mezcal Flan"] },
    { id: 47, name: "Mezcal (Joven)", category: "Bar", level: 45, unit: "bottles", reorderAt: 30, usedIn: ["Mezcal Margarita", "Mezcal Flan"] },
    { id: 48, name: "Agave Syrup", category: "Bar", level: 55, unit: "litres", reorderAt: 20, usedIn: ["Mezcal Margarita"] },
    { id: 49, name: "Smoked Salt", category: "Bar", level: 70, unit: "units", reorderAt: 15, usedIn: ["Mezcal Margarita"] },
    { id: 50, name: "Mexican Lager", category: "Bar", level: 70, unit: "bottles", reorderAt: 30, usedIn: ["Mexican Lager"] },
    { id: 51, name: "Still / Sparkling Water", category: "Bar", level: 80, unit: "bottles", reorderAt: 20, usedIn: ["Water"] },
    { id: 52, name: "Cane Sugar", category: "Bar", level: 75, unit: "kg", reorderAt: 15, usedIn: ["Hibiscus Agua Fresca"] },
];

const stockStatus = (level) =>
    level >= 50 ? { color: C.green, bg: C.greenL, label: "Good" }
        : level >= 25 ? { color: C.amber, bg: C.amberL, label: "Low" }
            : { color: C.red, bg: C.redL, label: "Critical" };

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

function StockTab({ stock, fetchStock }) {
    const [search, setSearch] = useState("");
    const restock = (stockId, level) => {
        fetch('http://127.0.0.1:8000/stock/restock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stock_id: stockId, level }),
        }).then(() => fetchStock());
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
    const lowCount = stock.filter(s => s.level < 50).length;
    const critCount = stock.filter(s => s.level < 25).length;

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


export default function ManagerDashboard() {
    const [tab, setTab] = useState("Overview");
    const [tables, setTables] = useState(INIT_TABLES);
    const [menu, setMenu] = useState(INIT_MENU);
    const [employees, setEmployees] = useState([]);
    const [staffInfo, setStaffInfo] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.role !== 'manager' && sessionStorage.getItem('role') !== 'manager') {
            navigate('/');
        }
    }, []);


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
    const [stock, setStock] = useState(INIT_STOCK);

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

    const prevStockRef = useRef({});

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
    const [notifications, setNotifications] = useState(INIT_NOTIFICATIONS);
    const [toasts, setToasts] = useState([]);
    const [showNotifs, setShowNotifs] = useState(false);
    const [showAccount, setShowAccount] = useState(false);

    useEffect(() => {
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

    const addToast = (msg) => {
        const id = Date.now();
        setToasts(p => [...p, { id, msg }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 2800);
    };

    useWaiterAlerts(setNotifications, addToast);

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
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
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
                        {showAccount && <AccountPanel staffInfo={staffInfo} />}
                    </div>
                </div>
            </nav>

            <div style={{ padding: "22px 28px 0" }}>
                <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 700, color: C.dark }}>Manager Dashboard</h1>
            </div>

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
        </div>
    );
}