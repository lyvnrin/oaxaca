import React from "react";
import "./WaiterLogin.css";

function WaiterLogin() {
    return (
        <div className="page">
            <div className="login-box">
                <h1>OAXACA</h1>
                <div className="divider"></div>
                <h2>Waiter Login</h2>
                <div className="divider"></div>

                <div className="row">
                    <label>Username</label>
                    <input type="text" placeholder="Enter username here" />
                </div>

                <div className="row">
                    <label>Password</label>
                    <input type="password" placeholder="Enter password here" />
                </div>

                <button>
                    LOG IN
                </button>
            </div>
        </div>
    );
}

export default WaiterLogin;