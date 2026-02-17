import React from "react";
import { useNavigate } from "react-router-dom";
import "./WaiterLogin.css";

function WaiterLogin() {

    const navigate = useNavigate();

    const goBack = () => {
        navigate("/");
    };

    return (
        <div className="waiter-page">
            <button className="waiter-back-button" onClick={goBack}>
                ←
            </button>

            <div className="waiter-login-box">
                <h1>OAXACA</h1>
                <div className="waiter-divider"></div>
                <h2>Waiter Login</h2>
                <div className="waiter-divider"></div>

                <div className="waiter-row">
                    <label className="waiter-label">Username</label>
                    <input
                        className="waiter-input"
                        type="text"
                        placeholder="Enter username here"
                    />
                </div>

                <div className="waiter-row">
                    <label className="waiter-label">Password</label>
                    <input
                        className="waiter-input"
                        type="password"
                        placeholder="Enter password here"
                    />
                </div>

                <button className="waiter-button">
                    LOG IN
                </button>
            </div>
        </div>
    );
}

export default WaiterLogin;