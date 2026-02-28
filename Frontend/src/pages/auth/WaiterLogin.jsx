import React from "react";
import { useNavigate } from "react-router-dom";
import "./WaiterLogin.css";

function WaiterLogin() {
    const navigate = useNavigate();
    const goBack = () => navigate("/staff");

    return (
        <div className="waiter-page">
            <button className="waiter-back-button" onClick={goBack}>←</button>

            <div className="waiter-login-box">
                <h2>Waiter</h2>

                <p className="waiter-field-label">USERNAME</p>
                <input
                    className="waiter-input"
                    type="text"
                />

                <p className="waiter-field-label">PASSWORD</p>
                <input
                    className="waiter-input"
                    type="password"
                />

                <button className="waiter-button">
                    Continue
                </button>
            </div>
        </div>
    );
}

export default WaiterLogin;