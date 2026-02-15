import React from "react";
import { useNavigate } from "react-router-dom";
import "./SelectRole.css";

function SelectRole() {
    const navigate = useNavigate();

    return (
        <div className="page">
            <div className="role-box">
                <h1>OAXACA</h1>

                <div className="divider"></div>

                <h2>Select Your Role</h2>

                <div className="divider"></div>

                <div className="button-group">
                    <button onClick={() => navigate("/customer-login")}>
                        Customer
                    </button>

                    <button onClick={() => navigate("/waiter-login")}>
                        Waiter
                    </button>

                    <button onClick={() => navigate("/kitchen-login")}>
                        Kitchen
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SelectRole;