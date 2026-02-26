import React from "react";
import { useNavigate } from "react-router-dom";
import "./KitchenLogin.css";

function KitchenLogin() {
    const navigate = useNavigate();
    const goBack = () => navigate("/");

    return (
        <div className="kitchen-page">
            <button className="kitchen-back-button" onClick={goBack}>←</button>

            <div className="kitchen-login-box">
                <h2>Kitchen Staff</h2>

                <p className="kitchen-field-label">USERNAME</p>
                <input
                    className="kitchen-input"
                    type="text"
                />

                <p className="kitchen-field-label">PASSWORD</p>
                <input
                    className="kitchen-input"
                    type="password"
                />

                <button className="kitchen-button">
                    Continue
                </button>
            </div>
        </div>
    );
}

export default KitchenLogin;