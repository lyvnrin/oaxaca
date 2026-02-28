import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

function SecondLanding() {
    const navigate = useNavigate();

    return (
        <div className="container">
            <div className="top-nav">
                <span>ABOUT</span>
                <span>CONTACT</span>
                <span>SETTINGS</span>
            </div>

            <div className="content">
                <h1 className="title">OAXACA STAFF</h1>
                <p className="welcome-text">Welcome back, let's make today a great service.</p>

                <div className="button-group">
                    <button className="choice-btn" onClick={() => navigate('/waiter-login')}>WAITER</button>
                    <span className="or-text">OR</span>
                    <button className="choice-btn" onClick={() => navigate('/kitchen-login')}>KITCHEN STAFF</button>
                </div>
            </div>
        </div>
    );
}

export default SecondLanding;