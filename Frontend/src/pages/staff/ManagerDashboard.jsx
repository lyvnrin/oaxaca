import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const C = {
    bg: "#f5f0e8", panel: "#faf7f2", dark: "#3b1f0e", mid: "#8b4513",
    warm: "#c4763a", light: "#e8d5b7", pale: "#f0e6d3",
    green: "#4a7c59", greenL: "#d4edda",
    red: "#c0392b", redL: "#fde8e6",
    amber: "#d4870e", amberL: "#fef3cd",
    text: "#2c1810", muted: "#7a5c44", border: "#d4b896",
};

const INIT_TABLES = [
    { id: 1,  status: "Ordering",  items: 3, bill: null },
    { id: 2,  status: "Eating",    items: 5, bill: null },
    { id: 3,  status: "Bill Req.", items: 0, bill: 62.00 },
    { id: 4,  status: "Free",      items: 0, bill: null },
    { id: 5,  status: "Waiting",   items: 2, bill: null },
    { id: 6,  status: "Service",   items: 0, bill: null },
    { id: 7,  status: "Free",      items: 0, bill: null },
    { id: 8,  status: "Eating",    items: 4, bill: null },
    { id: 9,  status: "Free",      items: 0, bill: null },
    { id: 10, status: "Ordering",  items: 2, bill: null },
    { id: 11, status: "Free",      items: 0, bill: null },
    { id: 12, status: "Eating",    items: 3, bill: null },
    { id: 13, status: "Free",      items: 0, bill: null },
    { id: 14, status: "Waiting",   items: 1, bill: null },
    { id: 15, status: "Free",      items: 0, bill: null },
];
const TABLE_STATUSES = ["Free", "Ordering", "Waiting", "Eating", "Bill Req.", "Service"];

const INIT_REQUESTS = [
    { id: 1, text: "Bill requested",    table: 3, urgency: "urgent", mins: 2 },
    { id: 2, text: "Waiter assistance", table: 6, urgency: "normal", mins: 4 },
    { id: 3, text: "Extra napkins",     table: 8, urgency: "normal", mins: 6 },
    { id: 4, text: "Allergy query",     table: 1, urgency: "info",   mins: 9 },
];

const INIT_NOTIFICATIONS = [
    { id: 1, type: "urgent", title: "Sea Bass critically low",      body: "Stock at 12% — order required today.",         time: "2m ago",  read: false },
    { id: 2, type: "urgent", title: "Bill overdue — Table 03",      body: "Customer has been waiting 8 minutes.",         time: "8m ago",  read: false },
    { id: 3, type: "warn",   title: "Ceviche Verde below margin",   body: "Current price yields only 31% profit margin.", time: "15m ago", read: false },
    { id: 4, type: "warn",   title: "Corn Tortillas running low",   body: "Stock at 35%. Consider restocking soon.",      time: "22m ago", read: true  },
    { id: 5, type: "info",   title: "Sofia R. — top sales today",  body: "£342 in sales, 22 orders handled this shift.", time: "1h ago",  read: true  },
    { id: 6, type: "info",   title: "Veggie Enchiladas marked off", body: "Item currently set to unavailable.",           time: "1h ago",  read: true  },
];

const INIT_MENU = [
    { id: 1,  section: "Starters", name: "Guacamole & Chips",    cost: 2.80, price: 7.00,  avail: true,  description: "Hand-mashed avocado, jalapeño, lime zest & Oaxacan pink salt.",                          dietary: ["Vegan", "Gluten-Free"],        allergens: [],                    calories: "350 kcal"               },
    { id: 2,  section: "Starters", name: "Tlayuda Tostada",      cost: 3.60, price: 9.00,  avail: true,  description: "Crispy corn base, black bean, quesillo, chorizo & fresh avocado.",                       dietary: ["Gluten-Free"],                 allergens: ["Milk", "Soy"],       calories: "500 kcal"               },
    { id: 3,  section: "Starters", name: "Ceviche Verde",        cost: 5.50, price: 12.00, avail: true,  description: "Sea bass, tomatillo, cucumber, coriander & tiger's milk.",                               dietary: ["Gluten-Free"],                 allergens: ["Fish"],              calories: "180 kcal"               },
    { id: 4,  section: "Starters", name: "Elote Esquites",       cost: 3.20, price: 8.00,  avail: true,  description: "Charred corn, crema, cotija cheese, ancho chilli & epazote.",                            dietary: ["Vegetarian", "Gluten-Free"],   allergens: ["Milk"],              calories: "250 kcal"               },
    { id: 5,  section: "Mains",    name: "Mole Negro Chicken",   cost: 6.50, price: 18.00, avail: true,  description: "Free-range thigh braised in a 30-ingredient black mole, sesame rice.",                   dietary: [],                              allergens: ["Soy", "Nuts"],       calories: "600 kcal"               },
    { id: 6,  section: "Mains",    name: "Barbacoa Tacos",       cost: 5.50, price: 16.00, avail: true,  description: "Slow-braised beef cheek, white onion, coriander & salsa roja. Three pieces.",            dietary: [],                              allergens: [],                    calories: "300 kcal (per taco)"    },
    { id: 7,  section: "Mains",    name: "Portobello Enchiladas",cost: 4.20, price: 14.00, avail: false, description: "Roasted mushrooms, black bean, chipotle sauce & cashew crema.",                          dietary: ["Vegan"],                       allergens: [],                    calories: "400 kcal"               },
    { id: 8,  section: "Mains",    name: "Snapper Veracruz",     cost: 7.80, price: 22.00, avail: true,  description: "Pan-seared whole snapper, olives, capers & fresh tomato broth.",                         dietary: ["Gluten-Free"],                 allergens: ["Fish"],              calories: "450 kcal"               },
    { id: 9,  section: "Desserts", name: "Churro Sundae",        cost: 2.10, price: 8.00,  avail: true,  description: "Crispy churros, vanilla bean ice cream & dark chocolate mole sauce.",                    dietary: ["Vegetarian"],                  allergens: ["Milk", "Gluten", "Eggs"], calories: "550 kcal"          },
    { id: 10, section: "Desserts", name: "Mezcal Flan",          cost: 2.00, price: 7.00,  avail: true,  description: "Silky caramel custard with a smoky mezcal caramel drizzle.",                             dietary: ["Vegetarian", "Gluten-Free"],   allergens: ["Milk", "Eggs"],      calories: "320 kcal"               },
    { id: 11, section: "Desserts", name: "Mango Sorbet",         cost: 1.40, price: 6.00,  avail: true,  description: "Alphonso mango, chilli salt & fresh lime. Completely dairy free.",                       dietary: ["Vegan", "Gluten-Free"],        allergens: [],                    calories: "120 kcal"               },
    { id: 12, section: "Sides",    name: "Black Bean Pot",       cost: 1.20, price: 4.00,  avail: true,  description: "Slow-cooked with avocado leaf, epazote & lime crema.",                                   dietary: ["Vegan", "Gluten-Free"],        allergens: [],                    calories: "200 kcal"               },
    { id: 13, section: "Sides",    name: "Corn Tortillas",       cost: 0.80, price: 3.00,  avail: true,  description: "Fresh nixtamal masa, made in-house daily. Four pieces.",                                 dietary: ["Vegan", "Gluten-Free"],        allergens: [],                    calories: "60 kcal (per tortilla)" },
    { id: 14, section: "Sides",    name: "Pickled Jalapeños",    cost: 0.60, price: 3.00,  avail: true,  description: "House-pickled chillies, carrots & white onion in apple cider vinegar.",                  dietary: ["Vegan", "Gluten-Free"],        allergens: [],                    calories: "5 kcal (per tbsp)"      },
    { id: 15, section: "Sides",    name: "Mexican Rice",         cost: 0.90, price: 4.00,  avail: true,  description: "Tomato-braised rice with cumin, garlic & fresh coriander.",                              dietary: ["Vegan", "Gluten-Free"],        allergens: [],                    calories: "200 kcal"               },
    { id: 16, section: "Drinks",   name: "Hibiscus Agua Fresca", cost: 1.00, price: 4.00,  avail: true,  description: "House-dried hibiscus, lime, cane sugar & still water.",                                  dietary: ["Vegan", "Gluten-Free"],        allergens: [],                    calories: "70 kcal (per cup)"      },
    { id: 17, section: "Drinks",   name: "Mezcal Margarita",     cost: 3.50, price: 11.00, avail: true,  description: "Joven mezcal, fresh lime juice, agave syrup & smoked salt rim.",                         dietary: ["Vegan", "Gluten-Free"],        allergens: [],                    calories: "250 kcal"               },
    { id: 18, section: "Drinks",   name: "Horchata",             cost: 1.20, price: 4.50,  avail: true,  description: "Rice milk, cinnamon, vanilla & a hint of almond. Served chilled.",                       dietary: ["Vegan", "Gluten-Free"],        allergens: ["Nuts"],              calories: "150 kcal (per cup)"     },
    { id: 19, section: "Drinks",   name: "Mexican Lager",        cost: 1.80, price: 5.00,  avail: true,  description: "Ice-cold bottle served with lime. Ask your server for today's selection.",               dietary: [],                              allergens: [],                    calories: "150 kcal (per bottle)"  },
    { id: 20, section: "Drinks",   name: "Water",                cost: 0.20, price: 2.50,  avail: true,  description: "Ice-cold and refreshing. Ask your server for alternative temperatures.",                 dietary: [],                              allergens: [],                    calories: "0 kcal"                 },
];

const calcMargin   = (cost, price) => price > 0 ? Math.round((1 - cost / price) * 100) : 0;
const calcMinPrice = (cost) => +(cost / 0.4).toFixed(2);

const marginColor = (m) => {
    if (m >= 60) return { bg: C.greenL, text: C.green, label: `${m}%` };
    if (m >= 50) return { bg: C.amberL, text: C.amber, label: `${m}% !` };
    return { bg: C.redL, text: C.red, label: `${m}% ⚠` };
};

const tileColors = (status) => ({
    "Free":      { bg: "#f0f7f2", border: "#b8d4c0", num: "#4a7c59",  label: "#4a7c59"  },
    "Ordering":  { bg: "#fff8f0", border: "#f0c97a", num: "#d4870e",  label: "#d4870e"  },
    "Waiting":   { bg: "#f0f4ff", border: "#9db4e8", num: "#3b5fc0",  label: "#3b5fc0"  },
    "Eating":    { bg: "#faf0f7", border: "#d4a0c8", num: "#8b3a7a",  label: "#8b3a7a"  },
    "Bill Req.": { bg: "#fde8e6", border: "#e8a09b", num: "#c0392b",  label: "#c0392b"  },
    "Service":   { bg: "#fef9e7", border: "#f7dc6f", num: "#9a7d0a",  label: "#9a7d0a"  },
}[status] || { bg: "#f0f7f2", border: "#b8d4c0", num: C.green, label: C.green });

const urgencyColor   = { urgent: C.red, normal: C.amber, info: C.green };
const notifTypeColor = { urgent: C.red, warn: C.amber,   info: C.green };

function useOutsideClick(ref, cb) {
    useEffect(() => {
        const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) cb(); };
        document.addEventListener("mousedown", fn);
        return () => document.removeEventListener("mousedown", fn);
    }, [ref, cb]);
}

const IconBell = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const IconDoor = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

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
    const unread   = notifications.filter(n => !n.read).length;
    const markRead = (id) => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
    const dismiss  = (id) => setNotifications(p => p.filter(n => n.id !== id));
    const markAll  = ()   => setNotifications(p => p.map(n => ({ ...n, read: true })));
    const clearAll = ()   => setNotifications([]);
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
                        <div style={{ width: 3, borderRadius: 2, background: notifTypeColor[n.type], flexShrink: 0, alignSelf: "stretch" }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
                                <span style={{ fontSize: 12, fontWeight: n.read ? 400 : 700, color: C.text, lineHeight: 1.3 }}>{n.title}</span>
                                <span style={{ fontSize: 10, color: C.muted, whiteSpace: "nowrap", flexShrink: 0 }}>{n.time}</span>
                            </div>
                            <p style={{ fontSize: 11, color: C.muted, marginTop: 3, lineHeight: 1.4 }}>{n.body}</p>
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

function AccountPanel() {
    const navigate = useNavigate();
    return (
        <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, width: 250, background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,.2)", zIndex: 800, animation: "dropIn .15s ease" }}>
            <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: C.warm, display: "grid", placeItems: "center", color: "white", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>MG</div>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Maria G.</div>
                    <div style={{ fontSize: 11, color: C.muted }}>maria.g@oaxaca.com</div>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: C.mid, marginTop: 2 }}>Manager</div>
                </div>
            </div>
            <div onClick={() => navigate('/')}
                 style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "background .15s", borderRadius: "0 0 10px 10px" }}
                 onMouseEnter={e => e.currentTarget.style.background = C.redL}
                 onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <IconDoor /><span style={{ fontSize: 13, fontWeight: 600, color: C.red }}>Sign Out</span>
            </div>
        </div>
    );
}

function OverviewTab({ tables, setTables, requests, setRequests, addToast }) {
    const occupied     = tables.filter(t => t.status !== "Free").length;
    const serviceCount = tables.filter(t => t.status === "Service" || t.status === "Bill Req.").length;
    const [selectedTable, setSelectedTable] = useState(null);

    const resolveRequest    = (id) => { setRequests(p => p.filter(r => r.id !== id)); addToast("Request resolved ✓"); };
    const updateTableStatus = (id, status) => { setTables(p => p.map(t => t.id === id ? { ...t, status } : t)); setSelectedTable(null); addToast(`Table ${String(id).padStart(2, "0")} → ${status}`); };

    const statCards = [
        { label: "Active Tables",    val: `${occupied}/15`, delta: `${occupied} occupied`,                                         up: true,              accent: C.amber },
        { label: "Service Requests", val: requests.length,  delta: requests.length > 0 ? `${requests.length} need attention` : "All clear", up: requests.length === 0, accent: C.red },
    ];

    return (
        <>
            <div style={{ gridColumn: "1/-1", display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
                {statCards.map((s, i) => (
                    <div key={i} style={{ background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "16px 18px", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.accent }} />
                        <div style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: C.muted, fontWeight: 600 }}>{s.label}</div>
                        <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 34, fontWeight: 700, color: C.dark, lineHeight: 1.1, margin: "4px 0 2px" }}>{s.val}</div>
                        <div style={{ fontSize: 11, color: s.up ? C.green : C.red, fontWeight: 500 }}>{s.delta}</div>
                    </div>
                ))}
            </div>

            <div style={{ gridColumn: "span 2", background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 17, fontWeight: 700, color: C.dark }}>Table Overview</span>
                    <div style={{ display: "flex", gap: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 20, background: C.greenL, color: C.green }}>{occupied} Occupied</span>
                        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 20, background: C.amberL, color: C.amber }}>{serviceCount} Service</span>
                    </div>
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
                                    {t.status === "Free" ? "—" : t.status === "Bill Req." ? `£${t.bill?.toFixed(2)}` : `${t.items} item${t.items !== 1 ? "s" : ""}`}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                    {[
                        { label: "Ordering", val: tables.filter(t => t.status === "Ordering").length },
                        { label: "Waiting",  val: tables.filter(t => t.status === "Waiting").length  },
                        { label: "Eating",   val: tables.filter(t => t.status === "Eating").length   },
                        { label: "Service",  val: tables.filter(t => t.status === "Service" || t.status === "Bill Req.").length },
                    ].map((o, i) => (
                        <div key={i} style={{ background: C.pale, borderRadius: 6, padding: "10px 12px", textAlign: "center" }}>
                            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 700, color: C.dark, lineHeight: 1 }}>{o.val}</div>
                            <div style={{ fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: C.muted, fontWeight: 600, marginTop: 3 }}>{o.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 17, fontWeight: 700, color: C.dark }}>Service Requests</span>
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 20, background: C.redL, color: C.red }}>{requests.length} Active</span>
                </div>
                <div style={{ height: 1, background: C.border }} />
                {requests.length === 0 && <div style={{ textAlign: "center", padding: "16px 0", color: C.muted, fontSize: 13 }}>All requests resolved ✓</div>}
                {requests.map(r => (
                    <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: C.bg, borderRadius: 6, border: `1px solid ${C.border}` }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: urgencyColor[r.urgency], flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: C.text, flex: 1, fontWeight: 500 }}>{r.text}</span>
                        <span style={{ fontSize: 10, color: C.muted }}>T{String(r.table).padStart(2, "0")}</span>
                        <span style={{ fontSize: 10, color: C.muted }}>{r.mins}m ago</span>
                        <button onClick={() => resolveRequest(r.id)} style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: C.mid, cursor: "pointer", padding: "3px 8px", border: `1px solid ${C.light}`, borderRadius: 4, background: "white", fontFamily: "Jost, sans-serif" }}>Resolve</button>
                    </div>
                ))}
            </div>

            {selectedTable && (
                <Modal title={`Table ${String(selectedTable.id).padStart(2, "0")}`} onClose={() => setSelectedTable(null)}>
                    <p style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>Update status:</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        {TABLE_STATUSES.map(s => (
                            <button key={s} onClick={() => updateTableStatus(selectedTable.id, s)}
                                    style={{ padding: "10px 12px", borderRadius: 6, border: `1.5px solid ${selectedTable.status === s ? C.warm : C.border}`, background: selectedTable.status === s ? C.pale : "white", color: C.text, fontSize: 12, fontWeight: selectedTable.status === s ? 600 : 400, cursor: "pointer", fontFamily: "Jost, sans-serif" }}>
                                {s}
                            </button>
                        ))}
                    </div>
                </Modal>
            )}
        </>
    );
}

function MenuTab({ menu, setMenu, addToast }) {
    const [editPrices, setEditPrices] = useState({});
    const [editNames,  setEditNames]  = useState({});
    const [showAdd,    setShowAdd]    = useState(false);
    const [newItem,    setNewItem]    = useState({ section: "Starters", name: "", cost: "", price: "" });
    const [savedIds,   setSavedIds]   = useState({});

    const sections = [...new Set(menu.map(m => m.section))];
    const getPrice = (item) => editPrices[item.id] !== undefined ? editPrices[item.id] : item.price;
    const getName  = (item) => editNames[item.id]  !== undefined ? editNames[item.id]  : item.name;
    const belowMgn = menu.filter(m => calcMargin(m.cost, m.price) < 60);

    const handleSave = (item) => {
        const p = parseFloat(getPrice(item)); const n = getName(item);
        if (isNaN(p) || p <= 0) { addToast("Invalid price"); return; }
        if (calcMargin(item.cost, p) < 60) addToast(`⚠ ${n} is below 60% margin`);
        setMenu(prev => prev.map(i => i.id === item.id ? { ...i, price: p, name: n } : i));
        setSavedIds(s => ({ ...s, [item.id]: true }));
        setTimeout(() => setSavedIds(s => { const n = { ...s }; delete n[item.id]; return n; }), 1500);
        addToast(`${n} saved ✓`);
    };

    const fieldStyle = { width: "100%", padding: "8px 10px", border: `1px solid ${C.border}`, borderRadius: 5, fontSize: 12, fontFamily: "Jost, sans-serif", background: C.bg, color: C.text };
    const labelStyle = { fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", display: "block", marginBottom: 4 };

    return (
        <div style={{ gridColumn: "1/-1", background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 700, color: C.dark }}>Menu Management</span>
                <button onClick={() => setShowAdd(true)} style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", padding: "7px 14px", borderRadius: 5, border: "none", background: C.mid, color: "white", cursor: "pointer", fontFamily: "Jost, sans-serif" }}>+ Add Item</button>
            </div>

            {belowMgn.length > 0 && (
                <div style={{ fontSize: 11, background: C.amberL, border: `1px solid #f0c97a`, color: "#8a5e0a", borderRadius: 5, padding: "9px 14px" }}>
                    ⚠️ <strong>{belowMgn.length} item{belowMgn.length > 1 ? "s" : ""}</strong> ({belowMgn.map(i => i.name).join(", ")}) below 60% margin.
                </div>
            )}

            {sections.map(sec => (
                <div key={sec}>
                    <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: C.muted, fontWeight: 600, paddingBottom: 6, borderBottom: `1px solid ${C.border}`, marginBottom: 4 }}>{sec}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1.2fr 0.9fr 0.8fr auto", gap: 8, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: C.muted, fontWeight: 600, padding: "2px 0 8px" }}>
                        <span>Item</span><span>Cost</span><span>Sell Price</span><span>Margin</span><span>Avail.</span><span>Actions</span>
                    </div>
                    {menu.filter(m => m.section === sec).map(item => {
                        const p  = parseFloat(getPrice(item)) || 0;
                        const m  = calcMargin(item.cost, p);
                        const mc = marginColor(m);
                        const mn = calcMinPrice(item.cost);
                        return (
                            <div key={item.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1.2fr 0.9fr 0.8fr auto", gap: 8, alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${C.pale}`, opacity: item.avail ? 1 : 0.5 }}>
                                <input value={getName(item)} onChange={e => setEditNames(prev => ({ ...prev, [item.id]: e.target.value }))}
                                       style={{ border: `1px solid ${C.border}`, borderRadius: 4, padding: "4px 8px", fontSize: 12, fontFamily: "Jost, sans-serif", background: C.bg, color: C.text, width: "100%" }} />
                                <span style={{ fontSize: 11, color: C.muted }}>£{item.cost.toFixed(2)}<br /><span style={{ fontSize: 9 }}>min £{mn.toFixed(2)}</span></span>
                                <div style={{ display: "flex", alignItems: "center", border: `1px solid ${p < mn ? C.red : C.border}`, borderRadius: 4, padding: "4px 6px", background: C.bg }}>
                                    £<input value={getPrice(item)} onChange={e => setEditPrices(prev => ({ ...prev, [item.id]: e.target.value }))}
                                            style={{ border: "none", background: "transparent", width: 46, fontSize: 12, fontFamily: "Jost, sans-serif", color: C.text }} />
                                </div>
                                <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 10, background: mc.bg, color: mc.text, textAlign: "center" }}>{mc.label}</span>
                                <button onClick={() => setMenu(prev => prev.map(i => i.id === item.id ? { ...i, avail: !i.avail } : i))}
                                        style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 10, background: item.avail ? C.greenL : C.pale, color: item.avail ? C.green : C.muted, border: "none", cursor: "pointer", fontFamily: "Jost, sans-serif" }}>
                                    {item.avail ? "On" : "Off"}
                                </button>
                                <div style={{ display: "flex", gap: 4 }}>
                                    <button onClick={() => handleSave(item)} style={{ fontSize: 10, fontWeight: 600, padding: "5px 10px", borderRadius: 4, border: "none", background: savedIds[item.id] ? C.green : C.mid, color: "white", cursor: "pointer", fontFamily: "Jost, sans-serif", transition: "background .3s" }}>{savedIds[item.id] ? "✓" : "Save"}</button>
                                    <button onClick={() => { setMenu(prev => prev.filter(i => i.id !== item.id)); addToast(`${item.name} removed`); }}
                                            style={{ fontSize: 10, fontWeight: 600, padding: "5px 10px", borderRadius: 4, border: "none", background: C.redL, color: C.red, cursor: "pointer", fontFamily: "Jost, sans-serif" }}>Del</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}

            {showAdd && (
                <Modal title="Add Menu Item" onClose={() => setShowAdd(false)}>
                    {[
                        { label: "Item Name",      key: "name",    type: "text"   },
                        { label: "Section",        key: "section", type: "select", options: ["Starters", "Mains", "Desserts", "Sides", "Drinks"] },
                        { label: "Cost Price (£)", key: "cost",    type: "number" },
                        { label: "Sell Price (£)", key: "price",   type: "number" },
                    ].map(f => (
                        <div key={f.key} style={{ marginBottom: 12 }}>
                            <label style={labelStyle}>{f.label}</label>
                            {f.type === "select"
                                ? <select value={newItem[f.key]} onChange={e => setNewItem(p => ({ ...p, [f.key]: e.target.value }))} style={fieldStyle}>
                                    {f.options.map(o => <option key={o}>{o}</option>)}
                                </select>
                                : <input type={f.type} value={newItem[f.key]} onChange={e => setNewItem(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.type === "number" ? "0.00" : ""} style={fieldStyle} />
                            }
                        </div>
                    ))}
                    {newItem.cost && newItem.price && (
                        <div style={{ fontSize: 11, color: C.muted, marginBottom: 12 }}>
                            Margin: <strong style={{ color: calcMargin(+newItem.cost, +newItem.price) >= 60 ? C.green : C.red }}>{calcMargin(+newItem.cost, +newItem.price)}%</strong> · Min price: £{calcMinPrice(+newItem.cost || 0).toFixed(2)}
                        </div>
                    )}
                    <button onClick={() => {
                        if (!newItem.name || !newItem.cost || !newItem.price) { addToast("Fill all fields"); return; }
                        const cost = parseFloat(newItem.cost), price = parseFloat(newItem.price);
                        if (isNaN(cost) || isNaN(price)) { addToast("Invalid numbers"); return; }
                        setMenu(prev => [...prev, { id: Date.now(), section: newItem.section, name: newItem.name, cost, price, avail: true }]);
                        setNewItem({ section: "Starters", name: "", cost: "", price: "" });
                        setShowAdd(false);
                        addToast(`${newItem.name} added ✓`);
                    }} style={{ width: "100%", padding: 10, background: C.mid, color: "white", border: "none", borderRadius: 5, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Jost, sans-serif" }}>
                        Add to Menu
                    </button>
                </Modal>
            )}
        </div>
    );
}
function EmployeesTab() { return <div style={{ gridColumn: "1/-1", background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: 18 }}><span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 700, color: C.dark }}>Employee Performance</span></div>; }
function StockTab()     { return <div style={{ gridColumn: "1/-1", background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: 18 }}><span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 700, color: C.dark }}>Stock Levels</span></div>; }

export default function ManagerDashboard() {
    const [tab,           setTab]           = useState("Overview");
    const [tables,        setTables]        = useState(INIT_TABLES);
    const [requests,      setRequests]      = useState(INIT_REQUESTS);
    const [menu,          setMenu]          = useState(INIT_MENU);
    const [notifications, setNotifications] = useState(INIT_NOTIFICATIONS);
    const [toasts,        setToasts]        = useState([]);
    const [showNotifs,    setShowNotifs]    = useState(false);
    const [showAccount,   setShowAccount]   = useState(false);

    const notifRef   = useRef(null);
    const accountRef = useRef(null);
    useOutsideClick(notifRef,   () => setShowNotifs(false));
    useOutsideClick(accountRef, () => setShowAccount(false));

    const addToast = (msg) => {
        const id = Date.now();
        setToasts(p => [...p, { id, msg }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 2800);
    };

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
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, letterSpacing: ".25em", color: C.bg, fontWeight: 600 }}>O A X A C A</span>
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
                            MG
                        </div>
                        {showAccount && <AccountPanel />}
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
                {tab === "Overview"  && <OverviewTab tables={tables} setTables={setTables} requests={requests} setRequests={setRequests} addToast={addToast} />}
                {tab === "Menu"      && <MenuTab menu={menu} setMenu={setMenu} addToast={addToast} />}
                {tab === "Employees" && <EmployeesTab />}
                {tab === "Stock"     && <StockTab />}
            </div>

            <div style={{ position: "fixed", bottom: 24, right: 24, display: "flex", flexDirection: "column", gap: 8, zIndex: 9999, pointerEvents: "none" }}>
                {toasts.map(t => (
                    <div key={t.id} style={{ background: C.dark, color: C.bg, padding: "10px 18px", borderRadius: 6, fontSize: 12, fontFamily: "Jost, sans-serif", fontWeight: 500, boxShadow: "0 4px 16px rgba(0,0,0,.25)", animation: "fadeInUp .2s ease" }}>{t.msg}</div>
                ))}
            </div>
        </div>
    );
}