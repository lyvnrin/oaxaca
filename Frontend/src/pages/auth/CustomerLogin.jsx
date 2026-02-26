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

                <p className="customer-field-label">YOUR NAME</p>
                <input
                    className="customer-input"
                    type="text"
                />

                <p className="customer-field-label">NUMBER OF GUESTS</p>
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