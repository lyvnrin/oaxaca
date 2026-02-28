import React from "react";
import { useNavigate } from "react-router-dom";
import Grainient from "../../components/Grainient";
import "./CustomerLogin.css";

function CustomerLogin() {
    const navigate = useNavigate();
    const goToMenu = () => navigate("/menu");
    const goToRoles = () => navigate("/");

    return (
        <div className="customer-page">
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
            <button className="back-button" onClick={goToRoles}>←</button>

            <div className="customer-login-box">
                <h2>Customer</h2>

                <p className="customer-field-label">YOUR NAME</p>
                <input className="customer-input" type="text" />

                <p className="customer-field-label">NUMBER OF GUESTS</p>
                <input className="customer-input" type="number" min="1" max="30" />

                <button className="customer-button" onClick={goToMenu}>
                    Continue
                </button>
            </div>
        </div>
    );
}

export default CustomerLogin;