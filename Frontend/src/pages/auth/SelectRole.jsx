import React from "react";
import { useNavigate } from "react-router-dom";
import "./SelectRole.css";
import "./CustomerLogin.jsx";

function SelectRole() {
    const navigate = useNavigate();

    const goToCustomerLogin = () => {
        navigate("/customer-login");
    };

    const goToWaiterLogin = () => {
        navigate("/waiter-login");
    };

    return (
        <div className="page">
            <div className="role-box">

                <div className="select-role-text">
                    <h1>OAXACA</h1>
                    <div className="divider"></div>
                    <h2>Select Your Role</h2>
                    <div className="divider"></div>
                </div>

                <div className="button-group">
                    <button onClick={goToCustomerLogin} >
                        Customer
                    </button>

                    <button onClick={goToWaiterLogin}>
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