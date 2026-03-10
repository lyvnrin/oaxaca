import { useState } from "react";
import "./ManagerDashboard.css";

export default function ManagerDashboard() {
    const [tab, setTab] = useState("Overview");

    return (
        <div className="manager-app">
            <nav className="manager-nav">
                <span className="manager-nav__wordmark">O A X A C A</span>
                <span className="manager-nav__label">Manager View</span>
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
                {tab === "Overview"  && <OverviewTab />}
                {tab === "Menu"      && <MenuTab />}
                {tab === "Employees" && <EmployeesTab />}
                {tab === "Stock"     && <StockTab />}
            </div>
        </div>
    );
}

function OverviewTab() {
    return (
        <>
            <div className="manager-section manager-section--full">
                <h2 className="manager-section__title">Stats</h2>
            </div>
            <div className="manager-section manager-section--span2">
                <h2 className="manager-section__title">Table Overview</h2>
            </div>
            <div className="manager-section">
                <h2 className="manager-section__title">Service Requests</h2>
            </div>
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