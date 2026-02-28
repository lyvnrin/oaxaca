import React from "react";
import { useNavigate } from "react-router-dom";
import Grainient from "../../components/Grainient";
import "./KitchenLogin.css";

function KitchenLogin() {
    const navigate = useNavigate();
    const goBack = () => navigate("/staff");

    return (
        <div className="kitchen-page">
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
            <button className="kitchen-back-button" onClick={goBack}>←</button>

            <div className="kitchen-login-box">
                <h2>Kitchen Staff</h2>

                <p className="kitchen-field-label">USERNAME</p>
                <input className="kitchen-input" type="text" />

                <p className="kitchen-field-label">PASSWORD</p>
                <input className="kitchen-input" type="password" />

                <button className="kitchen-button">Continue</button>
            </div>
        </div>
    );
}

export default KitchenLogin;