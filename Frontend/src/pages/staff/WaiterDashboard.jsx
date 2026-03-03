import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WaiterDashboard.css";

export default function Dashboard() {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);

    const notifications = [
        { order: "1234", table: "12", status: "Ready For Service", type: "ready" },
        { order: "1235", table: "7", status: "Ready For Service", type: "ready" },
        { order: "1236", table: "4", status: "Needs Assistance", type: "alert" },
        { order: "1237", table: "9", status: "Has Nut Allergy", type: "allergy" },
        { order: "1238", table: "3", status: "Ready For Service", type: "ready" },
        { order: "1239", table: "5", status: "Ready For Service", type: "ready" },
    ];

    return (
        <div className="dashboard-page">

            {/* header */}
            <div className="dashboard-header">
                <button className="waiter-back-button" onClick={() => navigate("/waiter-login")}>←</button>
                <h1 className="dashboard-title">Waiter Dashboard</h1>

                <div className="dashboard-icons">
                    <button
                        className="icon-button"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        🔔
                    </button>
                    <button className="icon-button">👤</button>
                </div>
            </div>

            {/* notif popup */}
            {showNotifications && (
                <div className="notifications-popup">
                    <div className="notif-header">
                        <h2 className="notif-title">Notifications</h2>
                        <button className="notif-close" onClick={() => setShowNotifications(false)}>✕</button>
                    </div>

                    <div className="notif-list">
                        {notifications.map((n, i) => (
                            <div key={i} className={`notif-item ${n.type}`}>
                                <span>Order {n.order}</span>
                                <span>Table {n.table}</span>
                                <span className="notif-status">{n.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* main */}
            <div className="dashboard-content">

                {/* left */}
                <div className="dashboard-left">
                    <div className="panel">
                        <h2 className="panel-title">Active Orders</h2>

                        <div className="scroll-area">
                            {[1,2,3,4].map((i) => (
                                <div key={i} className="order-card">
                                    <div className="order-header">
                                        <span>Table Number</span>
                                        <button className="cancel-btn">Cancel Order</button>
                                    </div>

                                    <div className="order-row">
                                        <span>Item Name:</span>
                                        <span>Qty:</span>
                                        <span>£00.00</span>
                                    </div>

                                    <div className="order-row alt">
                                        <span>Item Name:</span>
                                        <span>Qty:</span>
                                        <span>£00.00</span>
                                    </div>

                                    <div className="order-total">
                                        Total: £00.00
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* right */}
                <div className="dashboard-right">

                    {/* orders */}
                    <div className="panel">
                        <h2 className="panel-title">Order Backlog</h2>

                        <div className="backlog-box">
                            <div>Pending Orders : 00</div>
                            <div>Being Prepared : 00</div>
                            <div>Ready for service : 00</div>
                            <div>Delivered Today : 00</div>
                        </div>
                    </div>

                    {/* management */}
                    <div className="panel">
                        <h2 className="panel-title">Menu Management</h2>

                        <div className="scroll-area">
                            {[1,2,3].map((i) => (
                                <div key={i} className="menu-item-card">

                                    <div className="menu-row">
                                        <span><b>Item :</b> xxxxxxxxxxx</span>

                                        <div className="menu-controls">
                                            <select>
                                                <option>Available</option>
                                                <option>Unavailable</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="menu-row">
                                        <span><b>Price :</b> £00.00</span>

                                        <div className="menu-actions">
                                            <button className="delete-btn">Delete</button>
                                            <button className="save-btn">Save</button>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}