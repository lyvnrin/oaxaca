import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Grainient from "../../components/Grainient";
import "./WaiterLogin.css";

function WaiterLogin() {
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
                    role: 'Waiter',
                }),
            });

            if (!res.ok) {
                setErrors({ password: "Invalid username or password" });
                return;
            }

            const data = await res.json();
            sessionStorage.setItem('staff_id', data.staff_id);
            sessionStorage.setItem('role', 'waiter');
            navigate('/waiter-dashboard', { state: { role: 'waiter', staff_id: data.staff_id } });

        } catch (err) {
            setErrors({ password: "Could not reach server, please try again" });
        }
    };

    const [flashPassword, setFlashPassword] = useState(false);
    const handleShowPassword = () => {
        setFlashPassword(true);
        setTimeout(() => setFlashPassword(false), 600);
    };

    return (
        <div className="waiter-page">

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

            {/* BACK BUTTON */}
            <button className="waiter-back-button" onClick={goBack}>←</button>

            <div className="waiter-login-box">
                <h2>Hello, Waiter</h2>
                <p className="waiter-field-label">Please enter:</p>

                {/* USERNAME FIELD */}
                <p className="waiter-field-label">USERNAME</p>
                <input
                    className={`waiter-input ${errors.username ? 'input-error' : ''}`}
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                />
                {errors.username && <span className="error-message">{errors.username}</span>}

                {/* PASSWORD FIELD */}
                <p className="waiter-field-label">PASSWORD</p>
                <div style={{ position: 'relative' }}>
                    <input
                        className={`waiter-input ${errors.password ? 'input-error' : ''}`}
                        type={flashPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        style={{ paddingRight: '36px' }}
                    />
                    <button
                        type="button"
                        onMouseDown={handleShowPassword}
                        style={{
                            position: 'absolute', right: 10, top: '50%',
                            transform: 'translateY(-50%)', background: 'none',
                            border: 'none', cursor: 'pointer', color: '#7a5c44',
                            padding: 0, display: 'flex', alignItems: 'center'
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}

                {/* SUBMIT BTN */}
                <button
                    className={`waiter-button ${!isFormValid() ? 'waiter-button-disabled' : ''}`}
                    onClick={handleContinue}
                    disabled={!isFormValid()}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

export default WaiterLogin;