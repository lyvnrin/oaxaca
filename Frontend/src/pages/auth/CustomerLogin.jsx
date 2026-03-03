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
                color1="#7a3018" color2="#8f4a22" color3="#7d3a1a"
                timeSpeed={0.25} colorBalance={0}
                warpStrength={1} warpFrequency={3} warpSpeed={1.5} warpAmplitude={40}
                blendAngle={0} blendSoftness={0.1}
                rotationAmount={400}
                noiseScale={2} grainAmount={0} grainScale={2} grainAnimated={false}
                contrast={1.2} gamma={1} saturation={0.6}
                centerX={-0.09} centerY={0.05} zoom={0.9}
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