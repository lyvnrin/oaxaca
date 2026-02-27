import React from 'react';
import './Landing.css';

function SecondLanding() {
    return (
        <div className="container">
            <div className="top-nav">
                <span>ABOUT</span>
                <span>CONTACT</span>
                <span>SETTINGS</span>
            </div>

            <div className="content">
                <h1 className="title">OAXACA STAFF</h1>
                <p className="welcome-text">SUBTLE SNAPPY INTRODUCTION TO RESTAURANT</p>

                <div className="question-text">ARE YOU A</div>

                <div className="button-group">
                    <button className="choice-btn">STAFF</button>
                    <span className="or-text">OR</span>
                    <button className="choice-btn">CHEF</button>
                </div>
            </div>
        </div>
    );
}

export default SecondLanding;