import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Grainient from "../../components/Grainient";
import "./CustomerLogin.css";

/**
 * Customer Login Component
 * 
 * @module CustomerLogin
 * @description Handles customer authentication by allowing users to select a table number (1-20) 
 * and creates a new customer session in the backend. Upon successful authentication, 
 * navigates to the menu page with customer context.
 * 
 * @component
 * @returns {JSX.Element} A styled login form component with table number input and validation
 * 
 * @example
 * // Usage in routing:
 * <Route path="/customer-login" element={<CustomerLogin />} />
 */
function CustomerLogin() {
    // NAVIGATION --------------------------
    const navigate = useNavigate();
    
    /**
     * Navigates back to the roles selection page
     * @function goToRoles
     */
    const goToRoles = () => navigate("/");

    // STATE --------------------------
    /** @type {[string, Function]} Table number state (empty string or number 1-20 as string) */
    const [tableNumber, setTableNumber] = useState('');
    
    /** @type {[string, Function]} Error message state for validation and API errors */
    const [error, setError] = useState('');

    /**
     * Handles input changes for table number field
     * Validates and strips the input to ensure only numbers 1-20 are accepted
     * Automatically removes "Table" prefix if typed by user
     * 
     * @function handleChange
     * @param {Event} e - Input change event from text field
     */
    const handleChange = (e) => {
        const raw = e.target.value;
        const stripped = raw.replace(/^Table\s*/i, '').trim();
        const num = parseInt(stripped, 10);

        if (stripped === '') {
            setTableNumber('');
        } else if (!isNaN(num) && num >= 1 && num <= 20) {
            setTableNumber(String(num));
        }
        if (error) setError('');
    };

    /**
     * Handles keyboard navigation for table number field
     * Supports:
     * - ArrowUp: Increment table number (max 20)
     * - ArrowDown: Decrement table number (min 1)
     * - Enter: Submit form if valid
     * 
     * @function handleKeyDown
     * @param {KeyboardEvent} e - Keyboard event from input field
     */
    const handleKeyDown = (e) => {
        const current = tableNumber === '' ? 0 : Number(tableNumber);
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (current < 20) setTableNumber(String(current + 1));
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (current > 1) setTableNumber(String(current - 1));
        } else if (e.key === 'Enter' && isFormValid()) { 
            handleContinue();
        }
        if (error) setError('');
    };

    // FORM VALIDATION --------------------------
    /**
     * Validates that a table number has been selected
     * 
     * @function isFormValid
     * @returns {boolean} True if table number is not empty
     */
    const isFormValid = () => tableNumber !== '';

    // CONTINUE BUTTON : POSTs new cust. to Backend; navs to Menu on success
    /**
     * Handles form submission to create a new customer session
     * 
     * Sends a POST request to create a new customer with the selected table number.
     * On success:
     * - Stores session flag in sessionStorage
     * - Navigates to menu page with customer ID and table ID
     * On failure:
     * - Displays error message from backend or network error
     * 
     * @async
     * @function handleContinue
     * @throws {Error} When network request fails
     * 
     * @example
     * // Successful request body:
     * {
     *   name: "Table 5",
     *   table_id: 5
     * }
     * 
     * @example
     * // Navigation state on success:
     * navigate('/menu', { 
     *   state: { 
     *     cust_id: 123, 
     *     table_id: 5 
     *   } 
     * });
     */
    const handleContinue = async () => {
        console.log("Sending:", { name: `Table ${tableNumber}`, table_id: parseInt(tableNumber) });

        if (!tableNumber) {
            setError('Please select a table number');
            return;
        }
        try {
            const res = await fetch('http://localhost:8000/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: `Table ${tableNumber}`, 
                    table_id: parseInt(tableNumber) 
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.detail || 'Something went wrong');
                return;
            }
            sessionStorage.setItem('customer_session_active', 'true'); 
            const customer = await res.json();
            navigate('/menu', { 
                state: { 
                    cust_id: customer.cust_id, 
                    table_id: customer.table_id 
                } 
            });
        } catch (err) {
            console.error(err);
            setError('Could not reach server: ' + err.message);
        }
    };

    return (
        <div className="customer-page">
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
            <button className="back-button" onClick={goToRoles}>←</button>

            <div className="customer-login-box">
                <h2>Hello, Customer</h2>
                <p className="customer-field-label">Please enter:</p>
                <p className="customer-field-label">TABLE NUMBER</p>

                {/* TABLE NUM. INPUT */}
                <div className="customer-input-wrapper">
                    <input
                        className={`customer-input ${error ? 'input-error' : ''}`}
                        type="text"
                        value={tableNumber === '' ? '' : `Table ${tableNumber}`}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter table number"
                        aria-label="Table number input"
                        aria-invalid={!!error}
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
                            aria-label="Increase table number"
                        >▲</button>
                        <button
                            className="spinner-btn"
                            tabIndex={-1}
                            onClick={() => {
                                const cur = Number(tableNumber);
                                if (cur > 1) setTableNumber(String(cur - 1));
                                if (error) setError('');
                            }}
                            aria-label="Decrease table number"
                        >▼</button>
                    </div>
                </div>

                {/* ERROR MESSAGE */}
                {error && <span className="error-message" role="alert">{error}</span>}

                {/* SUBMIT BTN */}
                <button
                    className={`customer-button ${!isFormValid() ? 'customer-button-disabled' : ''}`}
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

export default CustomerLogin;