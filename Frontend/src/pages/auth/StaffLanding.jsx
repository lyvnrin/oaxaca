import React from 'react';
import { useNavigate } from 'react-router-dom';
import Grainient from '../../components/Grainient';
import './Landing.css';

function StaffLanding() {
    const navigate = useNavigate();

    return (
        <div className="container">
            <Grainient
                color1="#781111" color2="#b94609" color3="#9a0e0e"
                timeSpeed={0.1} colorBalance={0.3}
                warpStrength={0.6} warpFrequency={2} warpSpeed={0.8} warpAmplitude={25}
                blendAngle={180} blendSoftness={0.2}
                rotationAmount={200}
                noiseScale={2} grainAmount={0} grainScale={2} grainAnimated={false}
                contrast={1.1} gamma={1} saturation={0.5}
                centerX={0.1} centerY={-0.05} zoom={0.9}
            />
            
            {/* <button className="back-button" onClick={() => navigate('/')}>←</button> */}
            <div className="top-nav">
                {/* <a className="nav-link" href="/settings">SETTINGS</a> */}
                <a className= "nav-link" href="/">Home</a>
            </div>

            <div className="content">
                <h1 className="title">OAXACA STAFF</h1>
                <p className="welcome-text">Welcome back. Let's make today a great service.</p>
                <p className="staff-role-label">Select your role</p>
                <div className="button-group">
                    <button className="book-btn" onClick={() => navigate('/waiter-login')}>WAITER</button>
                    <span className="or-text">or</span>
                    <button className="book-btn" onClick={() => navigate('/kitchen-login')}>KITCHEN</button>
                </div>
            </div>
        </div>
    );
}

export default StaffLanding;