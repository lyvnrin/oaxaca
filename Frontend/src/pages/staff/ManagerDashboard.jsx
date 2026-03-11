import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ManagerDashboard.css";

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

const tileColors = (status) => ({
    "Free":      { bg: "#f0f7f2", border: "#b8d4c0", num: "#4a7c59", label: "#4a7c59" },
    "Ordering":  { bg: "#fff8f0", border: "#f0c97a", num: "#d4870e", label: "#d4870e" },
    "Waiting":   { bg: "#f0f4ff", border: "#9db4e8", num: "#3b5fc0", label: "#3b5fc0" },
    "Eating":    { bg: "#faf0f7", border: "#d4a0c8", num: "#8b3a7a", label: "#8b3a7a" },
    "Bill Req.": { bg: "#fde8e6", border: "#e8a09b", num: "#c0392b", label: "#c0392b" },
    "Service":   { bg: "#fef9e7", border: "#f7dc6f", num: "#9a7d0a", label: "#9a7d0a" },
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

const IconBell = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
);
const IconDoor = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
);

function Modal({ title, onClose, children }) {
    return (
        <div className="manager-modal-overlay" onClick={onClose}>
            <div className="manager-modal" onClick={e => e.stopPropagation()}>
                <div className="manager-modal__header">
                    <span className="manager-modal__title">{title}</span>
                    <button className="manager-modal__close" onClick={onClose}>✕</button>
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
        <div className="manager-dropdown manager-notifs">
            <div className="manager-notifs__header">
                <div className="manager-notifs__title-row">
                    <span className="manager-notifs__title">Notifications</span>
                    {unread > 0 && <span className="manager-notifs__unread-badge">{unread}</span>}
                </div>
                <div className="manager-notifs__actions">
                    {unread > 0 && <button className="manager-notifs__action-btn" onClick={markAll}>Mark all read</button>}
                    {notifications.length > 0 && <button className="manager-notifs__action-btn manager-notifs__action-btn--muted" onClick={clearAll}>Clear all</button>}
                </div>
            </div>
            <div className="manager-notifs__filters">
                {["All", "Urgent", "Unread"].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                            className={`manager-notifs__filter-btn${filter === f ? " manager-notifs__filter-btn--active" : ""}`}>
                        {f}
                    </button>
                ))}
            </div>
            <div className="manager-notifs__list">
                {filtered.length === 0 && (
                    <div className="manager-notifs__empty">
                        {filter === "Urgent" ? "No urgent alerts" : filter === "Unread" ? "All caught up ✓" : "No notifications"}
                    </div>
                )}
                {filtered.map(n => (
                    <div key={n.id} onClick={() => markRead(n.id)}
                         className={`manager-notifs__item${!n.read ? " manager-notifs__item--unread" : ""}`}>
                        <div className="manager-notifs__stripe" style={{ background: notifTypeColor[n.type] }} />
                        <div className="manager-notifs__item-body">
                            <div className="manager-notifs__item-row">
                                <span className={`manager-notifs__item-title${!n.read ? " manager-notifs__item-title--unread" : ""}`}>
                                    {n.title}
                                </span>
                                <span className="manager-notifs__item-time">{n.time}</span>
                            </div>
                            <p className="manager-notifs__item-desc">{n.body}</p>
                        </div>
                        {!n.read && <div className="manager-notifs__item-dot" />}
                        <button className="manager-notifs__dismiss" onClick={e => { e.stopPropagation(); dismiss(n.id); }}>✕</button>
                    </div>
                ))}
            </div>
            {filtered.length > 0 && (
                <div className="manager-notifs__footer">
                    {filtered.filter(n => !n.read).length} unread · {filtered.length} shown
                </div>
            )}
        </div>
    );
}

function AccountPanel() {
    const navigate = useNavigate();

    return (
        <div className="manager-dropdown manager-account">
            <div className="manager-account__profile">
                <div className="manager-account__avatar">MG</div>
                <div>
                    <div className="manager-account__name">Maria G.</div>
                    <div className="manager-account__email">maria.g@oaxaca.com</div>
                    <div className="manager-account__role">Manager</div>
                </div>
            </div>
            <div className="manager-account__signout" onClick={() => navigate('/')}>
                <IconDoor />
                <span className="manager-account__signout-label">Sign Out</span>
            </div>
        </div>
    );
}

function OverviewTab({ tables, setTables, requests, setRequests, addToast }) {
    const occupied     = tables.filter(t => t.status !== "Free").length;
    const serviceCount = tables.filter(t => t.status === "Service" || t.status === "Bill Req.").length;
    const [selectedTable, setSelectedTable] = useState(null);

    const resolveRequest = (id) => { setRequests(p => p.filter(r => r.id !== id)); addToast("Request resolved ✓"); };
    const updateTableStatus = (id, status) => {
        setTables(p => p.map(t => t.id === id ? { ...t, status } : t));
        setSelectedTable(null);
        addToast(`Table ${String(id).padStart(2, "0")} → ${status}`);
    };

    const statCards = [
        { label: "Active Tables",    val: `${occupied}/15`, delta: `${occupied} occupied`, up: true, accent: C.amber },
        { label: "Service Requests", val: requests.length, delta: requests.length > 0 ? `${requests.length} need attention` : "All clear", up: requests.length === 0, accent: C.red },
    ];

    return (
        <>
            <div className="manager-stats">
                {statCards.map((s, i) => (
                    <div key={i} className="manager-stat-card">
                        <div className="manager-stat-card__accent" style={{ background: s.accent }} />
                        <div className="manager-stat-card__label">{s.label}</div>
                        <div className="manager-stat-card__value">{s.val}</div>
                        <div className={`manager-stat-card__delta manager-stat-card__delta--${s.up ? "up" : "down"}`}>{s.delta}</div>
                    </div>
                ))}
            </div>

            <div className="manager-section manager-section--span2">
                <div className="manager-section__header">
                    <h2 className="manager-section__title">Table Overview</h2>
                    <div className="manager-section__badges">
                        <span className="manager-badge" style={{ background: C.greenL, color: C.green }}>{occupied} Occupied</span>
                        <span className="manager-badge" style={{ background: C.amberL, color: C.amber }}>{serviceCount} Service</span>
                    </div>
                </div>
                <div className="manager-divider" />
                <div className="manager-table-grid">
                    {tables.map(t => {
                        const s = tileColors(t.status);
                        return (
                            <div key={t.id} className="manager-table-tile"
                                 style={{ background: s.bg, borderColor: s.border }}
                                 onClick={() => setSelectedTable(t)}>
                                <div className="manager-table-tile__num" style={{ color: s.num }}>{String(t.id).padStart(2, "0")}</div>
                                <div className="manager-table-tile__status" style={{ color: s.label }}>{t.status}</div>
                                <div className="manager-table-tile__info">
                                    {t.status === "Free" ? "—" : t.status === "Bill Req." ? `£${t.bill?.toFixed(2)}` : `${t.items} item${t.items !== 1 ? "s" : ""}`}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="manager-table-summary">
                    {[
                        { label: "Ordering", val: tables.filter(t => t.status === "Ordering").length },
                        { label: "Waiting",  val: tables.filter(t => t.status === "Waiting").length },
                        { label: "Eating",   val: tables.filter(t => t.status === "Eating").length },
                        { label: "Service",  val: tables.filter(t => t.status === "Service" || t.status === "Bill Req.").length },
                    ].map((o, i) => (
                        <div key={i} className="manager-summary-card">
                            <div className="manager-summary-card__val">{o.val}</div>
                            <div className="manager-summary-card__label">{o.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="manager-section">
                <div className="manager-section__header">
                    <h2 className="manager-section__title">Service Requests</h2>
                    <span className="manager-badge" style={{ background: C.redL, color: C.red }}>{requests.length} Active</span>
                </div>
                <div className="manager-divider" />
                {requests.length === 0 && <p className="manager-empty">All requests resolved ✓</p>}
                {requests.map(r => (
                    <div key={r.id} className="manager-request">
                        <div className="manager-request__dot" style={{ background: urgencyColor[r.urgency] }} />
                        <span className="manager-request__text">{r.text}</span>
                        <span className="manager-request__meta">T{String(r.table).padStart(2, "0")}</span>
                        <span className="manager-request__meta">{r.mins}m ago</span>
                        <button className="manager-request__resolve" onClick={() => resolveRequest(r.id)}>Resolve</button>
                    </div>
                ))}
            </div>

            {selectedTable && (
                <Modal title={`Table ${String(selectedTable.id).padStart(2, "0")}`} onClose={() => setSelectedTable(null)}>
                    <p className="manager-modal__hint">Update status:</p>
                    <div className="manager-status-grid">
                        {TABLE_STATUSES.map(s => (
                            <button key={s}
                                    className={`manager-status-btn${selectedTable.status === s ? " manager-status-btn--active" : ""}`}
                                    onClick={() => updateTableStatus(selectedTable.id, s)}>
                                {s}
                            </button>
                        ))}
                    </div>
                </Modal>
            )}
        </>
    );
}

function MenuTab() {
    return (
        <div className="manager-section manager-section--full">
            <h2 className="manager-section__title">Menu Management</h2>
        </div>
    );
}

function EmployeesTab() {
    return (
        <div className="manager-section manager-section--full">
            <h2 className="manager-section__title">Employee Performance</h2>
        </div>
    );
}

function StockTab() {
    return (
        <div className="manager-section manager-section--full">
            <h2 className="manager-section__title">Stock Levels</h2>
        </div>
    );
}

export default function ManagerDashboard() {
    const [tab,           setTab]           = useState("Overview");
    const [tables,        setTables]        = useState(INIT_TABLES);
    const [requests,      setRequests]      = useState(INIT_REQUESTS);
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
        <div className="manager-app">
            <nav className="manager-nav">
                <span className="manager-nav__wordmark">O A X A C A</span>
                <div className="manager-nav__right">
                    <span className="manager-nav__label">Manager View</span>
                    <div ref={notifRef} style={{ position: "relative" }}>
                        <div className={`manager-nav-btn${showNotifs ? " manager-nav-btn--active" : ""}`}
                             onClick={() => { setShowNotifs(v => !v); setShowAccount(false); }}>
                            <IconBell />
                            {unread > 0 && <div className="manager-nav-btn__badge">{unread > 9 ? "9+" : unread}</div>}
                        </div>
                        {showNotifs && <NotificationsPanel notifications={notifications} setNotifications={setNotifications} />}
                    </div>
                    <div ref={accountRef} style={{ position: "relative" }}>
                        <div className={`manager-avatar${showAccount ? " manager-avatar--active" : ""}`}
                             onClick={() => { setShowAccount(v => !v); setShowNotifs(false); }}>
                            MG
                        </div>
                        {showAccount && <AccountPanel />}
                    </div>
                </div>
            </nav>

            <div className="manager-header">
                <h1 className="manager-header__title">Manager Dashboard</h1>
            </div>

            <div className="manager-tabs">
                {["Overview", "Menu", "Employees", "Stock"].map(t => (
                    <button key={t} className={`manager-tab${tab === t ? " manager-tab--active" : ""}`} onClick={() => setTab(t)}>{t}</button>
                ))}
            </div>

            <div className="manager-content">
                {tab === "Overview"  && <OverviewTab tables={tables} setTables={setTables} requests={requests} setRequests={setRequests} addToast={addToast} />}
                {tab === "Menu"      && <MenuTab />}
                {tab === "Employees" && <EmployeesTab />}
                {tab === "Stock"     && <StockTab />}
            </div>

            <div className="manager-toasts">
                {toasts.map(t => (
                    <div key={t.id} className="manager-toast">{t.msg}</div>
                ))}
            </div>
        </div>
    );
}