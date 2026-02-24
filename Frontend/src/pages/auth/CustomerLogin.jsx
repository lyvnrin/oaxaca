import React from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerLogin.css";

function CustomerLogin() {
    const navigate = useNavigate();
    const goToMenu = () => navigate("/menu");
    const goToRoles = () => navigate("/");

    return (
        <div className="customer-page">
            <button className="back-button" onClick={goToRoles}>←</button>

            <div className="customer-login-box">
                <h2>Customer</h2>

                <p className="customer-field-label">PLEASE ENTER YOUR NAME</p>
                <input
                    className="customer-input"
                    type="text"
                />

                <p className="customer-field-label">PLEASE CHOOSE HOW MANY YOU'RE BOOKING FOR</p>
                <input
                    className="customer-input"
                    type="number"
                    min="1"
                    max="30"
                />

                <button className="customer-button" onClick={goToMenu}>
                    Continue
                </button>
            </div>
        </div>
    );
}

export default CustomerLogin;