import React from "react";
import { useNavigate } from "react-router-dom";
import "./Menu.css";

export default function Menu() {
    const navigate = useNavigate();

    const goToMenuItems = () => {
        navigate("/menuitems");
    };

    return (
        <div className="menu-box">
            {/* Top margin - 'inner' is for positioning*/}
            <div className="margin">
                <div className="margin-inner">
                    <span className="top-left">OAXACA</span>
                    <span className="top-center">Customer Name</span>
                    <span className="top-right">Table (No.)</span>
                </div>
            </div>
            <div className="top-button-row">
                <div className="top-button-inner">
                    <button className="top-left-button">Back</button>

                    <div className="top-right-buttons">
                        <button className="top-right-button">Call Waiter</button>
                        <button className="top-right-button">Checkout</button>
                    </div>
                </div>
            </div>

            {/* Main Menu + Buttons */}
            <h1 className="menu-title">Menu</h1>

            <div className="menu-buttons">
                <button className="menu-button">Drinks</button>
                <button className="menu-button">Starters</button>
                <button className="menu-button" onClick={goToMenuItems}>Mains</button>
                <button className="menu-button">Desserts</button>
            </div>
        </div>
    );
}