import { useState, useEffect, useRef } from "react";

const C = {
    bg: "#f5f0e8", panel: "#faf7f2", dark: "#3b1f0e", mid: "#8b4513",
    warm: "#c4763a", light: "#e8d5b7", pale: "#f0e6d3",
    green: "#4a7c59", greenL: "#d4edda",
    red: "#c0392b", redL: "#fde8e6",
    amber: "#d4870e", amberL: "#fef3cd",
    blue: "#c4763a", blueL: "#f5e6d3",
    text: "#2c1810", muted: "#7a5c44", border: "#d4b896",
};

const MY_TABLES = [3, 7, 12];
const now = () => Date.now();

const ORDER_STATUSES = [
    "Pending Confirmation",
    "Confirmed",
    "In Progress",
    "Ready for Delivery",
    "Delivered",
];

const INIT_NOTIFICATIONS = [
    { id: 1, order: "1234", table: 12, status: "Ready For Service", type: "ready",   read: false },
    { id: 2, order: "1235", table: 7,  status: "Ready For Service", type: "ready",   read: false },
    { id: 3, order: "1236", table: 4,  status: "Needs Assistance",  type: "alert",   read: false },
    { id: 4, order: "1237", table: 9,  status: "Has Nut Allergy",   type: "allergy", read: false },
    { id: 5, order: "1238", table: 3,  status: "Ready For Service", type: "ready",   read: true  },
];

const INIT_MENU = [
    // ── Starters ──
    { id: 1,  section: "Starters", name: "Guacamole & Chips",     price: 7.00,  avail: true,  dietary: ["Vegan","Gluten-Free"],              allergens: [],                    calories: "350 kcal",               description: "Hand-mashed avocado, jalapeño, lime zest & Oaxacan pink salt." },
    { id: 2,  section: "Starters", name: "Tlayuda Tostada",       price: 9.00,  avail: true,  dietary: ["Gluten-Free"],                      allergens: ["Milk","Soy"],         calories: "500 kcal",               description: "Crispy corn base, black bean, quesillo, chorizo & fresh avocado." },
    { id: 3,  section: "Starters", name: "Ceviche Verde",         price: 12.00, avail: true,  dietary: ["Gluten-Free"],                      allergens: ["Fish"],               calories: "180 kcal",               description: "Sea bass, tomatillo, cucumber, coriander & tiger's milk." },
    { id: 4,  section: "Starters", name: "Elote Esquites",        price: 8.00,  avail: true,  dietary: ["Vegetarian","Gluten-Free"],         allergens: ["Milk"],               calories: "250 kcal",               description: "Charred corn, crema, cotija cheese, ancho chilli & epazote." },
    // ── Mains ──
    { id: 5,  section: "Mains",    name: "Mole Negro Chicken",    price: 18.00, avail: true,  dietary: [],                                   allergens: ["Soy","Nuts"],         calories: "600 kcal",               description: "Free-range thigh braised in a 30-ingredient black mole, sesame rice." },
    { id: 6,  section: "Mains",    name: "Barbacoa Tacos",        price: 16.00, avail: true,  dietary: [],                                   allergens: [],                    calories: "300 kcal (per taco)",    description: "Slow-braised beef cheek, white onion, coriander & salsa roja. Three pieces." },
    { id: 7,  section: "Mains",    name: "Portobello Enchiladas", price: 14.00, avail: true,  dietary: ["Vegan"],                            allergens: [],                    calories: "400 kcal",               description: "Roasted mushrooms, black bean, chipotle sauce & cashew crema." },
    { id: 8,  section: "Mains",    name: "Snapper Veracruz",      price: 22.00, avail: true,  dietary: ["Gluten-Free"],                      allergens: ["Fish"],               calories: "450 kcal",               description: "Pan-seared whole snapper, olives, capers & fresh tomato broth." },
    // ── Dessert ──
    { id: 9,  section: "Dessert",  name: "Churro Sundae",         price: 8.00,  avail: true,  dietary: ["Vegetarian"],                       allergens: ["Milk","Gluten","Eggs"],calories: "550 kcal",              description: "Crispy churros, vanilla bean ice cream & dark chocolate mole sauce." },
    { id: 10, section: "Dessert",  name: "Mezcal Flan",           price: 7.00,  avail: true,  dietary: ["Vegetarian","Gluten-Free"],         allergens: ["Milk","Eggs"],        calories: "320 kcal",               description: "Silky caramel custard with a smoky mezcal caramel drizzle." },
    { id: 11, section: "Dessert",  name: "Mango Sorbet",          price: 6.00,  avail: true,  dietary: ["Vegan","Gluten-Free"],              allergens: [],                    calories: "120 kcal",               description: "Alphonso mango, chilli salt & fresh lime. Completely dairy free." },
    // ── Sides ──
    { id: 12, section: "Sides",    name: "Black Bean Pot",        price: 4.00,  avail: true,  dietary: ["Vegan","Gluten-Free"],              allergens: [],                    calories: "200 kcal",               description: "Slow-cooked with avocado leaf, epazote & lime crema." },
    { id: 13, section: "Sides",    name: "Corn Tortillas",        price: 3.00,  avail: true,  dietary: ["Vegan","Gluten-Free"],              allergens: [],                    calories: "60 kcal (per tortilla)", description: "Fresh nixtamal masa, made in-house daily. Four pieces." },
    { id: 14, section: "Sides",    name: "Pickled Jalapeños",     price: 3.00,  avail: true,  dietary: ["Vegan","Gluten-Free"],              allergens: [],                    calories: "5 kcal (per tbsp)",      description: "House-pickled chillies, carrots & white onion in apple cider vinegar." },
    { id: 15, section: "Sides",    name: "Mexican Rice",          price: 4.00,  avail: true,  dietary: ["Vegan","Gluten-Free"],              allergens: [],                    calories: "200 kcal",               description: "Tomato-braised rice with cumin, garlic & fresh coriander." },
    // ── Drinks ──
    { id: 16, section: "Drinks",   name: "Hibiscus Agua Fresca",  price: 4.00,  avail: true,  dietary: ["Vegan","Gluten-Free"],              allergens: [],                    calories: "70 kcal (per cup)",      description: "House-dried hibiscus, lime, cane sugar & still water." },
    { id: 17, section: "Drinks",   name: "Mezcal Margarita",      price: 11.00, avail: true,  dietary: ["Vegan","Gluten-Free"],              allergens: [],                    calories: "250 kcal",               description: "Joven mezcal, fresh lime juice, agave syrup & smoked salt rim." },
    { id: 18, section: "Drinks",   name: "Horchata",              price: 4.50,  avail: true,  dietary: ["Vegan","Gluten-Free"],              allergens: ["Nuts"],               calories: "150 kcal (per cup)",     description: "Rice milk, cinnamon, vanilla & a hint of almond. Served chilled." },
    { id: 19, section: "Drinks",   name: "Mexican Lager",         price: 5.00,  avail: true,  dietary: [],                                   allergens: [],                    calories: "150 kcal (per 12 oz)",   description: "Ice-cold bottle served with lime. Ask your server for today's selection." },
    { id: 20, section: "Drinks",   name: "Water",                 price: 2.50,  avail: true,  dietary: [],                                   allergens: [],                    calories: "0 kcal",                 description: "Ice-cold and refreshing. Ask your server for alternative temperatures." },
];

const INIT_ORDERS = [
    { id: "1234", table: 12, status: "Confirmed",            startedAt: now() - 8*60000,  items: [{ menuId: 6,  name: "Barbacoa Tacos",       qty: 2, price: 16.00 }, { menuId: 4,  name: "Elote Esquites",    qty: 1, price: 8.00  }] },
    { id: "1235", table: 7,  status: "Pending Confirmation", startedAt: now() - 3*60000,  items: [{ menuId: 5,  name: "Mole Negro Chicken",   qty: 1, price: 18.00 }, { menuId: 18, name: "Horchata",          qty: 2, price: 4.50  }] },
    { id: "1238", table: 3,  status: "In Progress",          startedAt: now() - 14*60000, items: [{ menuId: 7,  name: "Portobello Enchiladas",qty: 2, price: 14.00 }, { menuId: 9,  name: "Churro Sundae",     qty: 1, price: 8.00  }] },
    { id: "1240", table: 5,  status: "Ready for Delivery",   startedAt: now() - 20*60000, items: [{ menuId: 8,  name: "Snapper Veracruz",     qty: 1, price: 22.00 }, { menuId: 17, name: "Mezcal Margarita",  qty: 2, price: 11.00 }] },
];

const INIT_UNPAID = [
    { table: 2,  order: "1230", total: 34.50, waiting: "12 mins" },
    { table: 6,  order: "1231", total: 22.00, waiting: "5 mins"  },
    { table: 11, order: "1232", total: 67.00, waiting: "28 mins" },
];

const notifColor  = { ready: C.green, alert: C.blue, allergy: C.amber };
const statusColor = {
    "Pending Confirmation": C.amber,
    "Confirmed":            C.blue,
    "In Progress":          C.warm,
    "Ready for Delivery":   C.green,
    "Delivered":            C.mid,
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
    if (mins < 1)  return "< 1 min";
    if (mins < 60) return `${mins} min${mins !== 1 ? "s" : ""}`;
    const h = Math.floor(mins / 60), m = mins % 60;
    return `${h}h ${m}m`;
}

function elapsedColor(startedAt) {
    const mins = Math.floor((Date.now() - startedAt) / 60000);
    return mins > 20 ? C.red : mins > 10 ? C.amber : C.green;
}

const IconAlert = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const IconBell  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const IconClock = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconDoor  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

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
    const unread   = notifications.filter(n => !n.read).length;
    const markRead = id => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
    const dismiss  = id => setNotifications(p => p.filter(n => n.id !== id));
    const markAll  = ()  => setNotifications(p => p.map(n => ({ ...n, read: true })));
    const clearAll = ()  => setNotifications([]);
    const filtered = notifications.filter(n =>
        filter === "Alerts" ? n.type === "alert" || n.type === "allergy" :
            filter === "Ready"  ? n.type === "ready" : true
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
                {["All","Alerts","Ready"].map(f => (
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
    const [search,   setSearch]   = useState("");

    const q         = search.trim().toLowerCase();
    const availMenu = menu.filter(m => m.avail);
    const filtered  = q ? availMenu.filter(m => m.name.toLowerCase().includes(q) || m.section.toLowerCase().includes(q)) : availMenu;

    const toggle    = item => setSelected(p => { const n = { ...p }; if (n[item.id]) delete n[item.id]; else n[item.id] = { ...item, qty: 1 }; return n; });
    const changeQty = (id, delta) => setSelected(p => { const n = { ...p }; if (!n[id]) return n; const q = n[id].qty + delta; if (q < 1) { delete n[id]; return n; } n[id] = { ...n[id], qty: q }; return n; });
    const totalAdded  = Object.values(selected).reduce((s, i) => s + i.price * i.qty, 0);
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
                {/* Search */}
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

function AddMenuItemModal({ onAdd, onClose }) {
    const [name, setName] = useState(""); const [price, setPrice] = useState("");
    const IS = { width: "100%", padding: "8px 10px", border: `1px solid ${C.border}`, borderRadius: 5, fontSize: 13, fontFamily: "Jost, sans-serif", background: C.bg, color: C.text, marginTop: 4 };
    const LS = { fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", display: "block", marginTop: 10 };
    const valid = name.trim() && parseFloat(price) > 0;
    return (
        <Modal title="Add Menu Item" onClose={onClose}>
            <div style={{ padding: "14px 20px 20px" }}>
                <label style={LS}>Item Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Elote" style={IS} />
                <label style={LS}>Price (£)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" min="0" step="0.50" style={IS} />
                <button onClick={() => { if (valid) { onAdd(name.trim(), parseFloat(price)); onClose(); } }} disabled={!valid}
                        style={{ marginTop: 16, width: "100%", padding: 10, border: "none", borderRadius: 6, background: valid ? C.dark : C.light, color: valid ? C.bg : C.muted, fontSize: 12, fontWeight: 600, cursor: valid ? "pointer" : "not-allowed", fontFamily: "Jost, sans-serif", letterSpacing: ".08em", textTransform: "uppercase", transition: "background .2s" }}>
                    Add Item
                </button>
            </div>
        </Modal>
    );
}