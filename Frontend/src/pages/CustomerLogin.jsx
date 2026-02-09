import React from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerLogin.css";

function CustomerLogin() {
    const navigate = useNavigate();

    const goToMenu = () => {
        navigate("/menu");
    };

    return (
        <div className="page">
            <div className="login-box">
                <h1>OAXACA</h1>
                <h2>Customer Login</h2>

                <div className="row">
                    <label>Name:</label>
                    <input type="text" placeholder="Enter full name here" />
                </div>

                <div className="row">
                    <select>
                        <option value="">Select Table Number</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                    </select>
                </div>

                <button onClick={goToMenu}>
                    CONTINUE
                </button>
            </div>
        </div>
    );
}

export default CustomerLogin;