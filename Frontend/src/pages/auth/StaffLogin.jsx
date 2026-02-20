import React from "react";
import { useNavigate } from "react-router-dom";
import "./StaffLogin.css";

function StaffLogin() {

    const navigate = useNavigate();

    const goBack = () => {
        navigate("/");
    };

    return (
        <div className="staff-page">

            <button className="staff-back-button" onClick={goBack}>
                ←
            </button>

            <div className="staff-login-box">

                <div className="staff-login-text">
                    <h1>OAXACA</h1>
                    <div className="staff-divider"></div>
                    <h2>Staff Login</h2>
                    <div className="staff-divider"></div>
                </div>

                <div className="staff-row">
                    <label className="staff-label">Username</label>
                    <input
                        className="staff-input"
                        type="text"
                        placeholder="Enter username here"
                    />
                </div>

                <div className="staff-row">
                    <label className="staff-label">Password</label>
                    <input
                        className="staff-input"
                        type="password"
                        placeholder="Enter password here"
                    />
                </div>

                <button className="staff-button">
                    LOG IN
                </button>

            </div>
        </div>
    );
}

export default StaffLogin;