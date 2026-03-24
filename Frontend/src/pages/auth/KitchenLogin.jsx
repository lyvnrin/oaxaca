import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Grainient from "../../components/Grainient";
import "./KitchenLogin.css";

function KitchenLogin() {
    
    // NAVIGATION --------------------------
    const navigate = useNavigate();
    const goBack = () => navigate("/staff");

    // STATE --------------------------
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({});

    // INPUT CHANGE HANDLER --------------------------
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

    // FORM VALIDATION --------------------------
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

    // FORM VALIDATION : disabling continue btn --------------------------
    const isFormValid = () => {
        return formData.username.trim() !== '' &&
            formData.password !== '' &&
            formData.password.length >= 6;
    };

    // CONTINUE BTN : posts info to auth endpoint --------------------------
    const handleContinue = async () => {
        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        try {
            const res = await fetch('http://127.0.0.1:8000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                    role: 'Kitchen Staff',
                }),
            });

            if (!res.ok) {
                setErrors({ password: "Invalid username or password" });
                return;
            }

            const data = await res.json();
            sessionStorage.setItem('staff_id', data.staff_id);
            sessionStorage.setItem('role', 'kitchen');
            navigate('/kitchen-dashboard', { state: { role: 'kitchen', staff_id: data.staff_id } });

        } catch (err) {
            setErrors({ password: "Could not reach server, please try again" });
        }
    };

    return (
        <div className="kitchen-page">

            {/* BACKGROUND */}
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

            {/* BACK BTN */}
            <button className="kitchen-back-button" onClick={goBack}>←</button>

            <div className="kitchen-login-box">
                <h2>Hello, Kitchen</h2>
                <p className="kitchen-field-label">Please enter:</p>

                {/* USERNAME FIELD */}
                <p className="kitchen-field-label">USERNAME</p>
                <input
                    className={`kitchen-input ${errors.username ? 'input-error' : ''}`}
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                />
                {errors.username && <span className="error-message">{errors.username}</span>}

                {/* PASSWORD FIELD */}
                <p className="kitchen-field-label">PASSWORD</p>
                <input
                    className={`kitchen-input ${errors.password ? 'input-error' : ''}`}
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                />
                {errors.password && <span className="error-message">{errors.password}</span>}

                {/* SUBMIT BTN */}
                <button
                    className={`kitchen-button ${!isFormValid() ? 'kitchen-button-disabled' : ''}`}
                    onClick={handleContinue}
                    disabled={!isFormValid()}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

export default KitchenLogin;