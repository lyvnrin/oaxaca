import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Grainient from "../../components/Grainient";
import "./KitchenLogin.css";

/**
 * Kitchen Staff Login Component
 * 
 * @module KitchenLogin
 * @description Handles kitchen staff authentication by validating credentials against the backend.
 * Upon successful authentication, stores staff session data and navigates to the kitchen dashboard.
 * 
 * @component
 * @returns {JSX.Element} A styled login form for kitchen staff with username/password fields
 * 
 * @example
 * // Usage in routing:
 * <Route path="/kitchen-login" element={<KitchenLogin />} />
 */
function KitchenLogin() {
    
    // NAVIGATION --------------------------
    const navigate = useNavigate();
    
    /**
     * Navigates back to the staff selection page
     * @function goBack
     */
    const goBack = () => navigate("/staff");

    // STATE --------------------------
    /**
     * Form data state for username and password fields
     * @type {Object}
     * @property {string} username - Kitchen staff username
     * @property {string} password - Kitchen staff password
     */
    const [formData, setFormData] = useState({ username: '', password: '' });
    
    /**
     * Error messages state for form validation
     * @type {Object}
     * @property {string} username - Error message for username field
     * @property {string} password - Error message for password field
     */
    const [errors, setErrors] = useState({});
    
    /**
     * Controls password visibility toggle
     * @type {boolean}
     */
    const [flashPassword, setFlashPassword] = useState(false);

    // INPUT CHANGE HANDLER --------------------------
    /**
     * Handles input changes for form fields
     * Updates form data and clears specific field error when user types
     * 
     * @function handleChange
     * @param {Event} e - Input change event
     */
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

    /**
     * Toggles password visibility
     * Shows password as plain text when button is pressed (onMouseDown)
     * Hides password when button is released (onMouseUp/onMouseLeave)
     * 
     * @function handleShowPassword
     */
    const handleShowPassword = () => {
        setFlashPassword(true);
        
        const hidePassword = () => {
            setFlashPassword(false);
            document.removeEventListener('mouseup', hidePassword);
            document.removeEventListener('mouseleave', hidePassword);
        };
        
        document.addEventListener('mouseup', hidePassword);
        document.addEventListener('mouseleave', hidePassword);
    };

    // FORM VALIDATION --------------------------
    /**
     * Validates form fields and returns error messages
     * 
     * @function validateForm
     * @returns {Object} Error object containing validation messages
     * @property {string} username - Error message for username (if empty)
     * @property {string} password - Error message for password (if empty or too short)
     */
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

    /**
     * Checks if the form meets all validation requirements
     * Used to enable/disable the submit button
     * 
     * @function isFormValid
     * @returns {boolean} True if username is not empty, password exists, and password length >= 6
     */
    const isFormValid = () => {
        return formData.username.trim() !== '' &&
            formData.password !== '' &&
            formData.password.length >= 6;
    };

    // CONTINUE BTN : posts info to auth endpoint --------------------------
    /**
     * Handles form submission for kitchen staff authentication
     * 
     * Validates form, then sends credentials to the authentication endpoint.
     * On success:
     * - Stores staff_id and role in sessionStorage
     * - Navigates to kitchen dashboard with staff context
     * On failure:
     * - Displays validation errors or server error message
     * 
     * @async
     * @function handleContinue
     * @throws {Error} When network request fails (handled gracefully)
     * 
     * @example
     * // Successful request body:
     * {
     *   username: "chef_john",
     *   password: "secure123",
     *   role: "Kitchen Staff"
     * }
     * 
     * @example
     * // Navigation state on success:
     * navigate('/kitchen-dashboard', { 
     *   state: { 
     *     role: 'kitchen', 
     *     staff_id: 42 
     *   } 
     * });
     */
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
                    aria-label="Username"
                    aria-invalid={!!errors.username}
                />
                {errors.username && <span className="error-message" role="alert">{errors.username}</span>}

                {/* PASSWORD FIELD */}
                <p className="kitchen-field-label">PASSWORD</p>
                <div style={{ position: 'relative' }}>
                    <input
                        className={`kitchen-input ${errors.password ? 'input-error' : ''}`}
                        type={flashPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                        style={{ paddingRight: '36px' }}
                        aria-label="Password"
                        aria-invalid={!!errors.password}
                    />
                    <button
                        type="button"
                        onMouseDown={handleShowPassword}
                        onMouseUp={() => setFlashPassword(false)}
                        onMouseLeave={() => setFlashPassword(false)}
                        style={{
                            position: 'absolute', right: 10, top: '50%',
                            transform: 'translateY(-50%)', background: 'none',
                            border: 'none', cursor: 'pointer', color: '#7a5c44',
                            padding: 0, display: 'flex', alignItems: 'center'
                        }}
                        aria-label="Toggle password visibility"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </button>
                </div>
                {errors.password && <span className="error-message" role="alert">{errors.password}</span>}

                {/* SUBMIT BTN */}
                <button
                    className={`kitchen-button ${!isFormValid() ? 'kitchen-button-disabled' : ''}`}
                    onClick={handleContinue}
                    disabled={!isFormValid()}
                    aria-disabled={!isFormValid()}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

export default KitchenLogin;