import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Grainient from "../../components/Grainient";
import "./ManagerLogin.css";

function ManagerLogin() {
    const navigate = useNavigate();
    const goBack = () => navigate("/staff");
    const goToDashboard = () => navigate("/manager-dashboard");

    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        return newErrors;
    };

    const isFormValid = () => {
        return formData.username.trim() !== '' &&
            formData.password !== '' &&
            formData.password.length >= 6;
    };

    const handleContinue = () => {
        const validationErrors = validateForm();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            console.log('Manager login:', formData);
            goToDashboard();
        }
    };

    return (
        <div className="manager-login-page">
            <Grainient
                color1="#6d2d17" color2="#9b552c" color3="#4b2311"
                timeSpeed={0.25} colorBalance={0}
                warpStrength={1} warpFrequency={3} warpSpeed={1.5} warpAmplitude={40}
                blendAngle={0} blendSoftness={0.1}
                rotationAmount={400}
                noiseScale={2} grainAmount={0} grainScale={2} grainAnimated={false}
                contrast={1.2} gamma={1} saturation={0.6}
                centerX={-0.09} centerY={0.05} zoom={0.9}
            />
            <button className="manager-login-back-button" onClick={goBack}>←</button>

            <div className="manager-login-box">
                <h2>Hello, Manager</h2>
                <p className="manager-login-field-label">Please enter:</p>
                <p className="manager-login-field-label">USERNAME</p>
                <input
                    className={`manager-login-input ${errors.username ? 'manager-login-input--error' : ''}`}
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                />
                {errors.username && <span className="manager-login-error">{errors.username}</span>}
                <p className="manager-login-field-label">PASSWORD</p>
                <input
                    className={`manager-login-input ${errors.password ? 'manager-login-input--error' : ''}`}
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                />
                {errors.password && <span className="manager-login-error">{errors.password}</span>}
                <button
                    className={`manager-login-button ${!isFormValid() ? 'manager-login-button--disabled' : ''}`}
                    onClick={handleContinue}
                    disabled={!isFormValid()}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

export default ManagerLogin;