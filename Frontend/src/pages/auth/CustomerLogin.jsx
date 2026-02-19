import React from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerLogin.css";

function CustomerLogin() {
    const navigate = useNavigate();
    const goToMenu = () => {
        navigate("/menu");
    };

    const goBack = () => {
        navigate("/");
    };

    return (
        <div className="customer-page">

            <button className="back-button" onClick={goBack}>
                ←
            </button>

            <div className="customer-login-box">

                <div className="customer-login-text">
                    <h1>OAXACA</h1>
                    <div className="customer-divider"></div>
                    <h2>Customer Login</h2>
                    <div className="customer-divider"></div>
                </div>

                <div className="customer-row">
                    <label className="customer-label">Name</label>
                    <input
                        className="customer-input"
                        type="text"
                        placeholder="Enter full name here"
                    />
                </div>

                <div className="customer-row">
                    <select className="customer-select">
                        <option value="">Select Table Number</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                    </select>
                </div>

                <button
                    className="customer-button"
                    onClick={goToMenu}
                >
                    LOG IN
                </button>

            </div>
        </div>
    );
}

export default CustomerLogin;