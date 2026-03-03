import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Grainient from "../../components/Grainient";
import "./CustomerLogin.css";

function CustomerLogin() {
    const navigate = useNavigate();
    const goToMenu = () => navigate("/menu");
    const goToRoles = () => navigate("/");

    const [formData, setFormData] = useState({
        name: '',
        guests: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        let newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.guests) {
            newErrors.guests = 'Number of guests is required';
        } else if (formData.guests < 1 || formData.guests > 30) {
            newErrors.guests = 'Guests must be between 1 and 30';
        }

        return newErrors;
    };

    const isFormValid = () => {
        return formData.name.trim() !== '' &&
            formData.guests !== '' &&
            formData.guests >= 1 &&
            formData.guests <= 30;
    };

    const handleContinue = () => {
        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            console.log('Customer info:', formData);
            goToMenu();
        }
    };

    return (
        <div className="customer-page">
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
            <button className="back-button" onClick={goToRoles}>←</button>

            <div className="customer-login-box">
                <h2>Hello, Customer</h2>
                <p className="customer-field-label">Please enter:</p>
                <p className="customer-field-label">YOUR NAME</p>
                <input
                    className={`customer-input ${errors.name ? 'input-error' : ''}`}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
                <p className="customer-field-label">NUMBER OF GUESTS</p>
                <input
                    className={`customer-input ${errors.guests ? 'input-error' : ''}`}
                    type="number"
                    name="guests"
                    min="1"
                    max="30"
                    value={formData.guests}
                    onChange={handleChange}
                    placeholder="Enter number of guests"
                />
                {errors.guests && <span className="error-message">{errors.guests}</span>}
                <button
                    className={`customer-button ${!isFormValid() ? 'button-disabled' : ''}`}
                    onClick={handleContinue}
                    disabled={!isFormValid()}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

export default CustomerLogin;