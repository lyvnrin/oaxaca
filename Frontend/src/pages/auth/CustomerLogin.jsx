import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Grainient from "../../components/Grainient";
import "./CustomerLogin.css";

function CustomerLogin() {
    const navigate = useNavigate();
    const goToMenu = () => navigate("/menu");
    const goToRoles = () => navigate("/");

    const [tableNumber, setTableNumber] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const raw = e.target.value;
        // strip "Table " prefix if present, keep only the number
        const stripped = raw.replace(/^Table\s*/i, '').trim();
        const num = parseInt(stripped, 10);

        if (stripped === '') {
            setTableNumber('');
        } else if (!isNaN(num) && num >= 1 && num <= 20) {
            setTableNumber(String(num));
        }
        if (error) setError('');
    };

    const handleKeyDown = (e) => {
        const current = tableNumber === '' ? 0 : Number(tableNumber);
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (current < 20) setTableNumber(String(current + 1));
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (current > 1) setTableNumber(String(current - 1));
        }
        if (error) setError('');
    };

    const isFormValid = () => tableNumber !== '';

    const handleContinue = async () => {
    if (!tableNumber) {
        setError('Please select a table number');
        return;
    }

    try {
        const res = await fetch('http://127.0.0.1:8000/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: `Table ${tableNumber}`, table_id: parseInt(tableNumber) }),
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.detail || 'Something went wrong');
            return;
        }

        goToMenu();
    } catch (err) {
        setError('Could not reach server');
    }
};

    return (
        <div className="customer-page">
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
            <button className="back-button" onClick={goToRoles}>←</button>

            <div className="customer-login-box">
                <h2>Hello, Customer</h2>
                <p className="customer-field-label">Please enter:</p>
                <p className="customer-field-label">TABLE NUMBER</p>
                <div className="customer-input-wrapper">
                    <input
                        className={`customer-input ${error ? 'input-error' : ''}`}
                        type="text"
                        value={tableNumber === '' ? '' : `Table ${tableNumber}`}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter table number"
                    />
                    <div className="spinner-arrows">
                        <button
                            className="spinner-btn"
                            tabIndex={-1}
                            onClick={() => {
                                const cur = tableNumber === '' ? 0 : Number(tableNumber);
                                if (cur < 20) setTableNumber(String(cur + 1));
                                if (error) setError('');
                            }}
                        >▲</button>
                        <button
                            className="spinner-btn"
                            tabIndex={-1}
                            onClick={() => {
                                const cur = Number(tableNumber);
                                if (cur > 1) setTableNumber(String(cur - 1));
                                if (error) setError('');
                            }}
                        >▼</button>
                    </div>
                </div>
                {error && <span className="error-message">{error}</span>}
                <button
                    className={`customer-button ${!isFormValid() ? 'customer-button-disabled' : ''}`}
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