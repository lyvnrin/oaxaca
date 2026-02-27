import React from 'react';
import './Landing.css';

function FirstLanding() {
    return (
        <div className="container">
            <div className="top-nav">
                <span>ABOUT</span>
                <span>CONTACT</span>
                <span>SETTINGS</span>
            </div>

            <div className="content">
                <h1 className="title">OAXACA</h1>
                <p className="welcome-text">SUBTLE SNAPPY INTRODUCTION TO RESTAURANT</p>

                <div className="question-text">ARE YOU A</div>

                <div className="button-group">
                    <button className="choice-btn">CUSTOMER</button>
                    <span className="or-text">OR</span>
                    <button className="choice-btn">STAFF</button>
                </div>
            </div>
        </div>
    );
}

export default FirstLanding;