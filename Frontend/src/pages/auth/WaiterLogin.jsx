import React from "react";
import { useNavigate } from "react-router-dom";
import "./WaiterLogin.css";

function WaiterLogin() {
    const navigate = useNavigate();
    const goBack = () => navigate("/");

    return (
        <div className="waiter-page">
            <button className="waiter-back-button" onClick={goBack}>←</button>

            <div className="waiter-login-box">
                <h2>Waiter</h2>

                <p className="waiter-field-label">PLEASE ENTER YOUR<span style={{display: "block", marginTop: "6px"}}>USERNAME</span></p>
                <input
                    className="waiter-input"
                    type="text"
                />

                <p className="waiter-field-label">AND</p>

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