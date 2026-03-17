import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import "./Menu.css";
import { MENU_DATA, INGREDIENTS, EXTRAS_BY_ID } from "./menuData.js";

const ALLERGEN_OPTIONS = ["Fish", "Soy", "Milk", "Nuts", "Eggs", "Wheat", "Sesame", "Shellfish"];
const DIET_FILTERS = ["Vegetarian", "Gluten-Free", "Vegan"];

function CartIcon({ count, onClick }) {
    return (<button className="cart-icon" title="View cart" onClick={onClick}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {count > 0 && <span className="cart-badge">{count}</span>}
    </button>
    );
}

function Header({ tableNumber, cartCount, onCartClick, onCloseTable }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleCloseTable = () => {
        setMenuOpen(false);
        onCloseTable();
    };

    return (
        <header className="header">
            <span className="table-number">{tableNumber}</span>
            <a href="/" style={{ textDecoration: 'none', color: 'inherit' }} className="no-style-link">
                <h1 className="restaurant-title">OAXACA</h1>
            </a>
            <div className="header-right">
                <CartIcon count={cartCount} onClick={onCartClick} />
                <div className="hamburger-wrapper">
                    <button className={`hamburger ${menuOpen ? "hamburger--open" : ""}`} aria-label="Open navigation menu" onClick={() => setMenuOpen((v) => !v)}>
                        <span className="hamburger-bar" />
                        <span className="hamburger-bar" />
                        <span className="hamburger-bar" />
                    </button>
                    {menuOpen && (<>
                        <div className="menu-popup-backdrop" onClick={() => setMenuOpen(false)} />
                        <div className="menu-popup">
                            <button className="menu-popup-item" onClick={() => {
                                localStorage.setItem("oaxaca_customer_alert", JSON.stringify({
                                    id: Date.now(),
                                    status: "Needs Assistance",
                                    type: "Help_Needed",
                                    read: false,
                                }));
                                setMenuOpen(false);
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z" />
                                </svg>
                                Contact Waiter
                            </button>
                            <button className="menu-popup-item" onClick={() => setMenuOpen(false)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                </svg>
                                Settings
                            </button>
                            <button className="menu-popup-item menu-popup-item--danger" onClick={handleCloseTable}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                Close Table
                            </button>
                        </div>
                    </>)}
                </div>
            </div>
        </header>
    );
}

function AllergenDropdown({ selected, onChange }) {
    const [open, setOpen] = useState(false);

    function handleToggle(allergen) {
        if (selected.includes(allergen)) {
            onChange(selected.filter((a) => a !== allergen));
        } else {
            onChange([...selected, allergen]);
        }
    }

    return (
        <div className="allergen-wrapper">
            <button className={`allergen-toggle ${selected.length > 0 ? "allergen-toggle--active" : ""}`} onClick={() => setOpen((v) => !v)}>
                <span>Does Not Contain</span>
                {selected.length > 0 && <span className="allergen-count">{selected.length}</span>}
                <span className="dropdown-arrow">{open ? "▲" : "▼"}</span>
            </button>
            {open && (
                <div className="allergen-list"> {ALLERGEN_OPTIONS.map((allergen) => (
                    <label key={allergen} className="allergen-option">
                        <input type="checkbox" checked={selected.includes(allergen)} onChange={() => handleToggle(allergen)} />
                        {allergen}
                    </label>
                ))}
                </div>
            )}
        </div>
    );
}

function FilterBar({ activeFilters, onFilterToggle, excludedAllergens, onAllergenChange, onTrackOrder, hasActiveOrder }) {
    return (
        <div className="filter-bar">
            <div className="filter-row">
                <span className="filter-label">Show me</span>
                <div className="filter-buttons">
                    {DIET_FILTERS.map((filter) => (
                        <button key={filter} className={`filter-btn ${activeFilters.includes(filter) ? "filter-btn--active" : ""}`} onClick={() => onFilterToggle(filter)}>
                            {filter}
                        </button>
                    ))}
                </div>
                <AllergenDropdown selected={excludedAllergens} onChange={onAllergenChange} />
                <button
                    className={`track-order-btn ${hasActiveOrder ? 'track-order-btn--active' : 'track-order-btn--disabled'}`}
                    onClick={onTrackOrder}
                    disabled={!hasActiveOrder}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                    Track Order
                </button>
            </div>
        </div>
    );
}

function CustomizationPopup({ item, onClose, onAddToCart }) {
    const [removedIngredients, setRemovedIngredients] = useState([]);
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [specialRequest, setSpecialRequest] = useState('');

    const itemIngredients = INGREDIENTS[item.id] || ["Food1", "Food2", "Food3", "Food4", "Food5"];
    const itemExtras = EXTRAS_BY_ID[item.id] || [];

    const handleToggleIngredient = (ingredient) => {
        setRemovedIngredients(prev =>
            prev.includes(ingredient) ? prev.filter(i => i !== ingredient) : [...prev, ingredient]
        );
    };

    const handleToggleExtra = (extra) => {
        setSelectedExtras(prev =>
            prev.find(e => e.name === extra.name) ? prev.filter(e => e.name !== extra.name) : [...prev, extra]
        );
    };

    const handleAddToOrder = () => {
        const customizedItem = {
            ...item,
            customization: { removedIngredients, selectedExtras, specialRequest: specialRequest.trim() }
        };
        onAddToCart(customizedItem);
        onClose();
    };

    const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
    const basePrice = parseFloat(item.price.replace("£", ""));
    const totalPrice = (basePrice + extrasTotal).toFixed(2);

    return (
        <div className="customization-overlay" onClick={onClose}>
            <div className="customization-modal" onClick={(e) => e.stopPropagation()}>
                <div className="customization-header">
                    <h2 className="customization-title">Customize {item.name}</h2>
                    <button className="customization-close" onClick={onClose}>✕</button>
                </div>
                <div className="customization-content">
                    <div className="customization-section">
                        <h3 className="section-title">Remove Ingredients</h3>
                        <div className="ingredients-grid">
                            {itemIngredients.map((ingredient) => (
                                <button key={ingredient} className={`ingredient-btn ${removedIngredients.includes(ingredient) ? 'ingredient-btn--removed' : ''}`} onClick={() => handleToggleIngredient(ingredient)}>
                                    {ingredient}
                                    {removedIngredients.includes(ingredient) && <span className="remove-icon">✕</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                    {itemExtras.length > 0 && (
                        <div className="customization-section">
                            <h3 className="section-title">Add Extras</h3>
                            <div className="extras-list">
                                {itemExtras.map((extra) => {
                                    const isSelected = selectedExtras.some(e => e.name === extra.name);
                                    return (
                                        <button key={extra.name} className={`extra-item ${isSelected ? 'extra-item--selected' : ''}`} onClick={() => handleToggleExtra(extra)}>
                                            <span className="extra-name">{extra.name}</span>
                                            <span className="extra-price">£{extra.price.toFixed(2)}</span>
                                            {isSelected && <span className="check-icon">✓</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    <div className="customization-section">
                        <h3 className="section-title">Special Request</h3>
                        <textarea className="special-request-input" placeholder="Any special instructions? (allergies, cooking preferences, etc.)" value={specialRequest} onChange={(e) => setSpecialRequest(e.target.value)} rows="3" />
                    </div>
                    <div className="customization-summary">
                        <div className="price-breakdown">
                            <span>Base price:</span>
                            <span>{item.price}</span>
                        </div>
                        {selectedExtras.length > 0 && (
                            <div className="price-breakdown">
                                <span>Extras:</span>
                                <span>£{extrasTotal.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="total-price">
                            <span>Total:</span>
                            <span>£{totalPrice}</span>
                        </div>
                    </div>
                </div>
                <div className="customization-footer">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="add-to-order-final-btn" onClick={handleAddToOrder}>Add to Order • £{totalPrice}</button>
                </div>
            </div>
        </div>
    );
}

function MenuItemCard({ item, dimmed, unavailable, lowStock, onCustomize }) {
    return (
        <div className={`menu-item-card ${dimmed ? "menu-item-card--dimmed" : ""} ${unavailable ? "menu-item-card--unavailable" : ""} ${lowStock ? "menu-item-card--unavailable" : ""}`}>
            <div className="card-image-placeholder">
                <span className="card-image-text">IMG</span>
            </div>
            <div className="card-body">
                <div className="card-top-row">
                    <span className="card-name">{item.name}</span>
                    <span className="card-price">{item.price}</span>
                </div>
                <p className="card-description">{item.description}</p>
                <div className="card-footer">
                    {item.dietary.length > 0 && (
                        <div className="card-tags">
                            {item.dietary.map((tag) => (<span key={tag} className="diet-tag">{tag}</span>))}
                        </div>
                    )}
                    {item.allergens.length > 0 && (
                        <p className="card-allergens">Contains: {item.allergens.join(", ")}</p>
                    )}
                    <span className="card-calories">{item.calories}</span>
                    {lowStock && !unavailable && (
                        <p style={{ fontSize: 10, color: "#c0392b", fontWeight: 700, marginTop: 4 }}>⚠ Low stock</p>
                    )}
                </div>
                <button className="add-to-order-btn" onClick={() => !dimmed && !unavailable && !lowStock && onCustomize(item)} disabled={dimmed || unavailable || lowStock}>
                    {unavailable ? "Unavailable" : lowStock ? "Low Stock" : "+ Add to Order"}
                </button>
            </div>
        </div>
    );
}

function MenuSection({ sectionName, items, isOpen, onToggle, matchesFilter, onCustomize, unavailableIds, lowStockDishes }) {
    return (
        <div className={`menu-section ${isOpen ? "menu-section--open" : ""}`}>
            <button className="section-header" onClick={onToggle}>
                <span className="section-name">{sectionName}</span>
                <div className="section-header-right">
                    <span className="section-count">{items.length} items</span>
                    <span className="section-toggle-icon">{isOpen ? "−" : "+"}</span>
                </div>
            </button>
            {isOpen && (
                <div className="section-items">
                    {items.map((item) => (
                        <MenuItemCard key={item.id} item={item} dimmed={!matchesFilter(item)} unavailable={unavailableIds.has(item.id)} lowStock={lowStockDishes.has(item.name)} onCustomize={onCustomize} />
                    ))}
                </div>
            )}
        </div>
    );
}

function CartModal({ cart, onClose, onUpdateQty, onRemove, onPlaceOrder }) {
    const entries = Object.entries(cart).map(([key, value]) => ({ key, ...value }));

    const total = entries.reduce((sum, { item, qty }) => {
        const basePrice = parseFloat(item.price.replace("£", ""));
        const extrasTotal = item.customization?.selectedExtras?.reduce((sum, extra) => sum + extra.price, 0) || 0;
        return sum + (basePrice + extrasTotal) * qty;
    }, 0);

    const formatCustomizations = (item) => {
        const parts = [];
        if (item.customization?.removedIngredients?.length > 0) parts.push(`No: ${item.customization.removedIngredients.join(', ')}`);
        if (item.customization?.selectedExtras?.length > 0) parts.push(`Extra: ${item.customization.selectedExtras.map(e => e.name).join(', ')}`);
        if (item.customization?.specialRequest) parts.push(`Note: ${item.customization.specialRequest}`);
        return parts;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Your Order</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                {entries.length === 0 ? (
                    <p className="modal-empty">Your order is empty. Add some items from the menu!</p>
                ) : (<>
                    <div className="modal-items">
                        {entries.map(({ key, item, qty }) => {
                            const basePrice = parseFloat(item.price.replace("£", ""));
                            const extrasTotal = item.customization?.selectedExtras?.reduce((sum, extra) => sum + extra.price, 0) || 0;
                            const linePrice = ((basePrice + extrasTotal) * qty).toFixed(2);
                            const customizations = formatCustomizations(item);
                            return (
                                <div key={key} className="modal-item">
                                    <div className="modal-item-info">
                                        <span className="modal-item-name">{item.name}</span>
                                        <span className="modal-item-price">£{linePrice}</span>
                                    </div>
                                    {customizations.length > 0 && (
                                        <div className="modal-item-customizations">
                                            {customizations.map((custom, idx) => (
                                                <p key={idx} className="customization-text">{custom}</p>
                                            ))}
                                        </div>
                                    )}
                                    <div className="modal-item-controls">
                                        <button className="qty-btn" onClick={() => onUpdateQty(key, qty - 1)}>−</button>
                                        <span className="qty-value">{qty}</span>
                                        <button className="qty-btn" onClick={() => onUpdateQty(key, qty + 1)}>+</button>
                                        <button className="remove-btn" onClick={() => onRemove(key)}>✕</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="modal-footer">
                        <div className="modal-total">
                            <span>Total</span>
                            <span>£{total.toFixed(2)}</span>
                        </div>
                        <button className="place-order-btn" onClick={onPlaceOrder}>Place Order</button>
                    </div>
                </>)}
            </div>
        </div>
    );
}

function TrackingPopup({ orderId, tableNumber, orderItems, total, onClose, onPaymentClick, currentStep, onStepClick }) {
    const steps = [
        { id: 1, name: "Order Placed" },
        { id: 2, name: "Confirmed by Waiter" },
        { id: 3, name: "Being Prepared" },
        { id: 4, name: "Ready for Service" },
        { id: 5, name: "Delivered" },
    ];

    const entries = Object.entries(orderItems).map(([key, value]) => ({ key, ...value }));

    const formatCustomizations = (item) => {
        const parts = [];
        if (item.customization?.removedIngredients?.length > 0) parts.push(`No: ${item.customization.removedIngredients.join(', ')}`);
        if (item.customization?.selectedExtras?.length > 0) {
            parts.push(`Extra: ${item.customization.selectedExtras.map(extra => `${extra.name} (+£${extra.price.toFixed(2)})`).join(', ')}`);
        }
        if (item.customization?.specialRequest) parts.push(`Note: "${item.customization.specialRequest}"`);
        return parts;
    };

    const handlePayNow = () => {
        onClose();
        onPaymentClick();
    };

    return (
        <div className="customization-overlay" onClick={onClose}>
            <div className="customization-modal tracking-modal" onClick={(e) => e.stopPropagation()}>
                <div className="customization-header">
                    <h2 className="customization-title">Order Progress</h2>
                    <button className="customization-close" onClick={onClose}>✕</button>
                </div>
                <div className="customization-content">
                    <div className="order-info">
                        <span className="table-number-display">Table: {tableNumber}</span>
                        <span className="order-id-display">Order ID: #{orderId}</span>
                    </div>
                    <div className="progress-steps">
                        {steps.map((step) => (
                            <div key={step.id} className={`step-item ${currentStep >= step.id ? 'step-completed' : ''} ${currentStep === step.id ? 'step-current' : ''}`}>
                                <div className="step-indicator">{currentStep > step.id ? '✓' : step.id}</div>
                                <div className="step-content">
                                    <span className="step-name">{step.name}</span>
                                    <span className="step-status">
                                        {currentStep > step.id ? 'Completed' : currentStep === step.id ? 'In Progress' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="tracking-order-summary">
                        <h3 className="summary-title">Order Summary</h3>
                        <div className="summary-items">
                            {entries.map(({ key, item, qty }) => {
                                const basePrice = parseFloat(item.price.replace("£", ""));
                                const extrasTotal = item.customization?.selectedExtras?.reduce((sum, extra) => sum + extra.price, 0) || 0;
                                const linePrice = ((basePrice + extrasTotal) * qty).toFixed(2);
                                const customizations = formatCustomizations(item);
                                return (
                                    <div key={key} className="summary-item">
                                        <div className="summary-item-header">
                                            <span className="summary-item-name">{item.name} ×{qty}</span>
                                            <span className="summary-item-price">£{linePrice}</span>
                                        </div>
                                        {customizations.length > 0 && (
                                            <div className="summary-item-customizations">
                                                {customizations.map((custom, idx) => {
                                                    let customClass = "summary-custom-text";
                                                    if (custom.startsWith('No:')) customClass += " customization-removed";
                                                    else if (custom.startsWith('Extra:')) customClass += " customization-extra";
                                                    else if (custom.startsWith('Note:')) customClass += " customization-note";
                                                    return <p key={idx} className={customClass}>{custom}</p>;
                                                })}
                                            </div>
                                        )}
                                        {item.customization?.selectedExtras?.length > 0 && (
                                            <div className="summary-item-breakdown">
                                                <span className="breakdown-text">Base: {item.price} + Extras: £{extrasTotal.toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="summary-total">
                            <span>Total Amount</span>
                            <span>£{total.toFixed(2)}</span>
                        </div>
                    </div>
                    {currentStep === 5 ? (
                        <button className="pay-now-tracking-btn" onClick={handlePayNow}>PAY NOW • £{total.toFixed(2)}</button>
                    ) : (
                        <p className="payment-message">Payment will be available once your order has been delivered</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function validateCardNumber(value) {
    const digits = value.replace(/\s/g, '');
    if (!digits) return 'Card number is required';
    if (!/^\d+$/.test(digits)) return 'Card number must contain only digits';
    if (digits.length !== 16) return 'Card number must be 16 digits';
    return null;
}

function validateExpiry(value) {
    if (!value) return 'Expiry date is required';
    const match = value.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return 'Use MM/YY format';
    const month = parseInt(match[1], 10);
    const year = parseInt(match[2], 10) + 2000;
    if (month < 1 || month > 12) return 'Invalid month';
    const now = new Date();
    const expiry = new Date(year, month - 1, 1);
    if (expiry < new Date(now.getFullYear(), now.getMonth(), 1)) return 'Card has expired';
    return null;
}

function validateCVV(value) {
    if (!value) return 'CVV is required';
    if (!/^\d{3}$/.test(value)) return 'CVV must be 3 digits';
    return null;
}

function validateCardholderName(value) {
    if (!value.trim()) return 'Cardholder name is required';
    if (value.trim().length < 2) return 'Please enter a valid name';
    return null;
}

function formatCardNumber(value) {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
}

function PaymentPopup({ orderId, tableNumber, total, onClose, onConfirm }) {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [backendError, setBackendError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validateField(field);
    };

    const validateField = (field) => {
        let error = null;
        if (field === 'cardNumber') error = validateCardNumber(cardNumber);
        if (field === 'expiry') error = validateExpiry(expiry);
        if (field === 'cvv') error = validateCVV(cvv);
        if (field === 'cardholderName') error = validateCardholderName(cardholderName);
        setErrors(prev => ({ ...prev, [field]: error }));
        return error;
    };

    const handleCardNumberChange = (e) => {
        const formatted = formatCardNumber(e.target.value);
        setCardNumber(formatted);
        if (touched.cardNumber) setErrors(prev => ({ ...prev, cardNumber: validateCardNumber(formatted.replace(/\s/g, '')) }));
    };

    const handleExpiryChange = (e) => {
        const formatted = formatExpiry(e.target.value);
        setExpiry(formatted);
        if (touched.expiry) setErrors(prev => ({ ...prev, expiry: validateExpiry(formatted) }));
    };

    const handleCVVChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 3);
        setCvv(val);
        if (touched.cvv) setErrors(prev => ({ ...prev, cvv: validateCVV(val) }));
    };

    const handleCardholderNameChange = (e) => {
        setCardholderName(e.target.value);
        if (touched.cardholderName) setErrors(prev => ({ ...prev, cardholderName: validateCardholderName(e.target.value) }));
    };

    const handleConfirm = async () => {
        setBackendError('');
        if (paymentMethod === 'card') {
            setTouched({ cardNumber: true, expiry: true, cvv: true, cardholderName: true });
            const newErrors = {
                cardNumber: validateCardNumber(cardNumber),
                expiry: validateExpiry(expiry),
                cvv: validateCVV(cvv),
                cardholderName: validateCardholderName(cardholderName),
            };
            setErrors(newErrors);
            if (Object.values(newErrors).some(e => e !== null)) return;
        }
        setIsSubmitting(true);
        try {
            await onConfirm(paymentMethod);
        } catch (err) {
            setBackendError(err.message || 'Payment could not be processed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="customization-overlay">
            <div className="customization-modal payment-modal" onClick={(e) => e.stopPropagation()}>
                <div className="customization-header">
                    <h2 className="customization-title">Payment</h2>
                    <button className="customization-close" onClick={onClose}>✕</button>
                </div>
                <div className="customization-content">
                    <div className="order-info">
                        <span className="table-number-display">Table: {tableNumber}</span>
                        <span className="order-id-display">Order ID: #{orderId}</span>
                    </div>
                    {backendError && (
                        <div className="payment-error-banner">
                            <span className="payment-error-icon">⚠</span>
                            <span>{backendError}</span>
                        </div>
                    )}
                    <div className="payment-methods">
                        <button className={`payment-method-btn ${paymentMethod === 'card' ? 'payment-method-selected' : ''}`} onClick={() => setPaymentMethod('card')}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '4px' }}>
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                <line x1="1" y1="10" x2="23" y2="10" />
                            </svg>
                            <span>Card</span>
                        </button>
                    </div>
                    {paymentMethod === 'card' && (
                        <div className="card-fields">
                            <div className="card-field-group">
                                <label className="card-field-label">Cardholder Name</label>
                                <input
                                    className={`card-field-input ${touched.cardholderName && errors.cardholderName ? 'card-field-input--error' : ''}`}
                                    type="text" placeholder="Name as it appears on card"
                                    value={cardholderName} onChange={handleCardholderNameChange}
                                    onBlur={() => handleBlur('cardholderName')} autoComplete="cc-name"
                                />
                                {touched.cardholderName && errors.cardholderName && <span className="card-field-error">{errors.cardholderName}</span>}
                            </div>
                            <div className="card-field-group">
                                <label className="card-field-label">Card Number</label>
                                <input
                                    className={`card-field-input card-field-input--mono ${touched.cardNumber && errors.cardNumber ? 'card-field-input--error' : ''}`}
                                    type="text" inputMode="numeric" placeholder="0000 0000 0000 0000"
                                    value={cardNumber} onChange={handleCardNumberChange}
                                    onBlur={() => handleBlur('cardNumber')} maxLength={19} autoComplete="cc-number"
                                />
                                {touched.cardNumber && errors.cardNumber && <span className="card-field-error">{errors.cardNumber}</span>}
                            </div>
                            <div className="card-field-row">
                                <div className="card-field-group">
                                    <label className="card-field-label">Expiry Date</label>
                                    <input
                                        className={`card-field-input card-field-input--mono ${touched.expiry && errors.expiry ? 'card-field-input--error' : ''}`}
                                        type="text" inputMode="numeric" placeholder="MM/YY"
                                        value={expiry} onChange={handleExpiryChange}
                                        onBlur={() => handleBlur('expiry')} maxLength={5} autoComplete="cc-exp"
                                    />
                                    {touched.expiry && errors.expiry && <span className="card-field-error">{errors.expiry}</span>}
                                </div>
                                <div className="card-field-group">
                                    <label className="card-field-label">CVV</label>
                                    <input
                                        className={`card-field-input card-field-input--mono ${touched.cvv && errors.cvv ? 'card-field-input--error' : ''}`}
                                        type="text" inputMode="numeric" placeholder="123"
                                        value={cvv} onChange={handleCVVChange}
                                        onBlur={() => handleBlur('cvv')} maxLength={3} autoComplete="cc-csc"
                                    />
                                    {touched.cvv && errors.cvv && <span className="card-field-error">{errors.cvv}</span>}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="payment-total-due">
                        <span>Total Due</span>
                        <span>£{total.toFixed(2)}</span>
                    </div>
                    <button className={`confirm-payment-btn ${isSubmitting ? 'confirm-payment-btn--loading' : ''}`} onClick={handleConfirm} disabled={isSubmitting}>
                        {isSubmitting ? 'Processing...' : 'Confirm Payment'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function UnpaidOrderModal({ total, onClose, onPayNow }) {
    return (
        <div className="customization-overlay">
            <div className="customization-modal unpaid-modal">
                <div className="unpaid-modal-icon">!</div>
                <h2 className="unpaid-modal-title">Outstanding Balance</h2>
                <p className="unpaid-modal-message">
                    You have an unpaid order of <strong>£{total.toFixed(2)}</strong>.<br />
                    Please complete payment before closing your table.
                </p>
                <div className="unpaid-modal-actions">
                    <button className="unpaid-dismiss-btn" onClick={onClose}>Go Back</button>
                    <button className="unpaid-pay-btn" onClick={onPayNow}>Pay Now</button>
                </div>
            </div>
        </div>
    );
}

function OrderConfirmation() {
    return (
        <div className="customization-overlay">
            <div className="customization-modal confirmation-modal">
                <div className="confirmation-icon">✓</div>
                <h2 className="confirmation-title">Order Placed!</h2>
                <p className="confirmation-msg">
                    Your order has been sent to the kitchen.<br />Your waiter will be with you shortly.
                </p>
                <p className="confirmation-redirect">Returning you home...</p>
            </div>
        </div>
    );
}

function PaymentConfirmation() {
    return (
        <div className="customization-overlay">
            <div className="customization-modal confirmation-modal">
                <div className="confirmation-icon">✓</div>
                <h2 className="confirmation-title">Payment Successful!</h2>
                <p className="confirmation-msg">
                    Thank you for dining with us.<br />We hope to see you again soon!
                </p>
                <p className="confirmation-redirect">Returning you home...</p>
            </div>
        </div>
    );
}


export default function App() {
    const [openSection, setOpenSection] = useState(null);
    const [activeFilters, setActiveFilters] = useState([]);
    const [excludedAllergens, setExcludedAllergens] = useState([]);

    const { state } = useLocation();
    if (state?.cust_id) {
        sessionStorage.setItem('cust_id', state.cust_id);
        sessionStorage.setItem('table_id', state.table_id);
    }

    const cust_id = state?.cust_id ?? sessionStorage.getItem('cust_id');
    const table_id = state?.table_id ?? sessionStorage.getItem('table_id');

    const [cart, setCart] = useState({});
    const [cartOpen, setCartOpen] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [customizingItem, setCustomizingItem] = useState(null);

    const [trackingOpen, setTrackingOpen] = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [placedOrder, setPlacedOrder] = useState({});

    const [isPaid, setIsPaid] = useState(false);
    const [unpaidModalOpen, setUnpaidModalOpen] = useState(false);

    const [liveStep, setLiveStep] = useState(1);
    const [liveOrderId, setLiveOrderId] = useState(sessionStorage.getItem('liveOrderId') ?? null);
    const [hasActiveOrder, setHasActiveOrder] = useState(!!sessionStorage.getItem('liveOrderId'));

    const [unavailableIds, setUnavailableIds] = useState(new Set());
    const [livePrices, setLivePrices] = useState({});

    useEffect(() => {
        const fetchAvailability = () => {
            fetch('http://127.0.0.1:8000/menu_items')
                .then(r => r.json())
                .then(data => {
                    const ids = new Set(data.filter(i => i.available === 0).map(i => i.item_id));
                    setUnavailableIds(ids);
                    const prices = {};
                    data.forEach(i => { prices[i.item_id] = i.price; });
                    setLivePrices(prices);
                });
        };
        fetchAvailability();
        const poll = setInterval(fetchAvailability, 500);
        return () => clearInterval(poll);
    }, []);

    const [lowStockDishes, setLowStockDishes] = useState(new Set());

    useEffect(() => {
        const fetchStock = () => {
            fetch('http://127.0.0.1:8000/stock')
                .then(r => r.json())
                .then(data => {
                    const low = new Set();
                    data.forEach(s => {
                        if (s.level < 10) s.used_in.split(', ').forEach(d => low.add(d));
                    });
                    setLowStockDishes(low);
                })
                .catch(() => { });
        };
        fetchStock();
        const poll = setInterval(fetchStock, 500);
        return () => clearInterval(poll);
    }, []);

    useEffect(() => {
        if (!liveOrderId) return;
        const statusToStep = {
            "Pending": 2,
            "In Progress": 3,
            "Ready": 4,
            "Completed": 5,
        };
        const poll = setInterval(async () => {
            const res = await fetch(`http://127.0.0.1:8000/orders/${liveOrderId}`);
            const data = await res.json();
            setLiveStep(statusToStep[data.status] ?? 1);
        }, 8000);
        return () => clearInterval(poll);
    }, [liveOrderId]);

    const generateOrderId = () => Math.floor(1000 + Math.random() * 9000).toString();

    const [paymentConfirmed, setPaymentConfirmed] = useState(false);

    function handleSectionToggle(sectionName) {
        setOpenSection((prev) => (prev === sectionName ? null : sectionName));
    }

    function handleFilterToggle(filter) {
        setActiveFilters((prev) =>
            prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
        );
    }

    function matchesFilter(item) {
        const passesDietary = activeFilters.length === 0 || activeFilters.every((f) => item.dietary.includes(f));
        const passesAllergens = excludedAllergens.length === 0 || excludedAllergens.every((a) => !item.allergens.includes(a));
        return passesDietary && passesAllergens;
    }

    function handleAddToCart(item) {
        const existingItemKey = Object.keys(cart).find(key => {
            const cartItem = cart[key].item;
            if (item.customization) {
                return cartItem.id === item.id && JSON.stringify(cartItem.customization) === JSON.stringify(item.customization);
            }
            return false;
        });

        if (existingItemKey) {
            setCart((prev) => ({ ...prev, [existingItemKey]: { ...prev[existingItemKey], qty: prev[existingItemKey].qty + 1 } }));
        } else {
            const uniqueId = item.customization ? `${item.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : item.id;
            setCart((prev) => ({ ...prev, [uniqueId]: { item, qty: 1 } }));
        }
    }

    function handleUpdateQty(itemKey, newQty) {
        if (newQty <= 0) { handleRemove(itemKey); return; }
        setCart((prev) => ({ ...prev, [itemKey]: { ...prev[itemKey], qty: newQty } }));
    }

    function handleRemove(itemKey) {
        setCart((prev) => { const next = { ...prev }; delete next[itemKey]; return next; });
    }

    async function handlePlaceOrder() {
        const items = Object.values(cart).map(({ item, qty }) => ({
            item_id: item.id,
            quantity: qty,
            price: parseFloat(item.price.replace("£", "")) + (item.customization?.selectedExtras?.reduce((s, e) => s + e.price, 0) || 0),
            removed_ingredients: item.customization?.removedIngredients || [],
            extras: item.customization?.selectedExtras?.map(e => ({
                name: e.name,
                price: e.price
            })) || [],
            special_request: item.customization?.specialRequest || "",
         }));
        try {
            const res = await fetch('http://127.0.0.1:8000/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cust_id, table_id, items }),
            });
            if (!res.ok) {
                console.error('Order failed:', await res.json());
                return;
            }
            const data = await res.json();
            setLiveOrderId(data.order_id);
            sessionStorage.setItem('liveOrderId', data.order_id);
            setLiveStep(1);

            await fetch('http://127.0.0.1:8000/stock/deplete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cust_id, table_id, items }),
            });
        } catch (err) {
            console.error('Could not reach server:', err);
            return;
        }

        const newOrderId = generateOrderId();
        setOrderId(newOrderId);
        setHasActiveOrder(true);
        setIsPaid(false);
        setCurrentStep(1);
        setPlacedOrder(cart);
        setCartOpen(false);
        setCart({});
        setConfirmed(true);
        setTimeout(() => { setConfirmed(false); }, 2500);
    }

    function handleStepClick(stepId) {
        setCurrentStep(stepId);
    }

    function handleCloseTable() {
        if (hasActiveOrder && !isPaid) {
            setUnpaidModalOpen(true);
        } else {
            sessionStorage.clear();
            window.location.href = '/';
        }
    }

    async function handlePaymentConfirm(method) {
        const res = await fetch(`http://127.0.0.1:8000/orders/${liveOrderId}/pay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.detail || 'Payment failed');
        }

        await fetch(`http://127.0.0.1:8000/orders/${liveOrderId}/cleanup`, { method: 'DELETE' });

        setIsPaid(true);
        setPaymentOpen(false);
        setHasActiveOrder(false);
        setPlacedOrder({});
        setCurrentStep(1);
        setLiveOrderId(null);
        sessionStorage.clear();

        setPaymentConfirmed(true);
        setTimeout(() => {
            setPaymentConfirmed(false);
            window.location.href = '/';
        }, 2500);
    }
    const cartCount = Object.values(cart).reduce((sum, { qty }) => sum + qty, 0);

    const placedOrderTotal = Object.values(placedOrder).reduce((sum, { item, qty }) => {
        const basePrice = parseFloat(item.price.replace("£", ""));
        const extrasTotal = item.customization?.selectedExtras?.reduce((sum, extra) => sum + extra.price, 0) || 0;
        return sum + (basePrice + extrasTotal) * qty;
    }, 0);

    return (
        <div className="app">
            <Header
                tableNumber={table_id ? `Table ${table_id}` : "Table"}
                cartCount={cartCount}
                onCartClick={() => setCartOpen(true)}
                onCloseTable={handleCloseTable}
            />

            <main className="main-content">
                <FilterBar
                    activeFilters={activeFilters}
                    onFilterToggle={handleFilterToggle}
                    excludedAllergens={excludedAllergens}
                    onAllergenChange={setExcludedAllergens}
                    onTrackOrder={() => setTrackingOpen(true)}
                    hasActiveOrder={hasActiveOrder}
                />
                <div className="menu-sections">
                    {Object.entries(MENU_DATA).map(([sectionName, items]) => (
                        <MenuSection
                            key={sectionName}
                            sectionName={sectionName}
                            items={items.map(item => ({ ...item, price: livePrices[item.id] ? `£${livePrices[item.id].toFixed(2)}` : item.price }))}
                            isOpen={openSection === sectionName}
                            onToggle={() => handleSectionToggle(sectionName)}
                            matchesFilter={matchesFilter}
                            onCustomize={setCustomizingItem}
                            unavailableIds={unavailableIds}
                            lowStockDishes={lowStockDishes}
                        />
                    ))}
                </div>
            </main>

            {cartOpen && (
                <CartModal
                    cart={cart}
                    onClose={() => setCartOpen(false)}
                    onUpdateQty={handleUpdateQty}
                    onRemove={handleRemove}
                    onPlaceOrder={handlePlaceOrder}
                />
            )}

            {confirmed && <OrderConfirmation />}

            {customizingItem && (
                <CustomizationPopup
                    item={customizingItem}
                    onClose={() => setCustomizingItem(null)}
                    onAddToCart={handleAddToCart}
                />
            )}

            {trackingOpen && hasActiveOrder && (
                <TrackingPopup
                    orderId={liveOrderId}
                    tableNumber={table_id ? `Table ${table_id}` : "Table"}
                    orderItems={placedOrder}
                    total={placedOrderTotal}
                    onClose={() => setTrackingOpen(false)}
                    onPaymentClick={() => setPaymentOpen(true)}
                    currentStep={liveStep}
                    onStepClick={() => { }}
                />
            )}

            {paymentOpen && (
                <PaymentPopup
                    orderId={liveOrderId}
                    tableNumber={table_id ? `Table ${table_id}` : "Table"}
                    total={placedOrderTotal}
                    onClose={() => setPaymentOpen(false)}
                    onConfirm={handlePaymentConfirm}
                />
            )}

            {unpaidModalOpen && (
                <UnpaidOrderModal
                    total={placedOrderTotal}
                    onClose={() => setUnpaidModalOpen(false)}
                    onPayNow={() => {
                        setUnpaidModalOpen(false);
                        setPaymentOpen(true);
                    }}
                />
            )}

            {confirmed && <OrderConfirmation />}
            {paymentConfirmed && <PaymentConfirmation />}
        </div>
    );
}