import React from 'react';
import { useNavigate } from 'react-router-dom';
import Grainient from '../../components/Grainient';
import './Landing.css';

function SecondLanding() {
    const navigate = useNavigate();

    return (
        <div className="container">
            <Grainient
                color1="#781111"
                color2="#b94609"
                color3="#9a0e0e"
                timeSpeed={0.25}
                colorBalance={0}
                warpStrength={1}
                warpFrequency={3}
                warpSpeed={1.5}
                warpAmplitude={40}
                blendAngle={0}
                blendSoftness={0.1}
                rotationAmount={500}
                noiseScale={2}
                grainAmount={0}
                grainScale={2}
                grainAnimated={false}
                contrast={1.2}
                gamma={1}
                saturation={0.6}
                centerX={-0.09}
                centerY={0.05}
                zoom={0.9}
            />
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