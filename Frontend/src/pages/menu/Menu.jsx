import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import "./Menu.css";
import { MENU_DATA, INGREDIENTS, EXTRAS_BY_ID } from "./menuData.js";

// MENU DATA : tags
const ALLERGEN_OPTIONS = ["Fish", "Soy", "Milk", "Nuts", "Eggs", "Wheat", "Sesame", "Shellfish"];
const DIET_FILTERS = ["Vegetarian", "Gluten-Free", "Vegan"];

// NAVBAR : cartIcon
function CartIcon({ count, onClick }) {
    return ( <button className="cart-icon" title="View cart" onClick={onClick}>
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {count > 0 && <span className="cart-badge">{count}</span>}
        </button>
    );
}

// NAVBAR : Header components - restaurant title, table number
function Header({ tableNumber, cartCount, onCartClick }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="header">
            <span className="table-number">{tableNumber}</span>
            
            <a href="/" style={{ textDecoration: 'none', color: 'inherit' }} className="no-style-link">
                <h1 className="restaurant-title">OAXACA</h1>
            </a>

            <div className="header-right">
                <CartIcon count={cartCount} onClick={onCartClick} />
                <div className="hamburger-wrapper">
                    <button className={`hamburger ${menuOpen ? "hamburger--open" : ""}`} aria-label="Open navigation menu" onClick={() => setMenuOpen((v) => !v)} >
                        <span className="hamburger-bar" />
                        <span className="hamburger-bar" />
                        <span className="hamburger-bar" />
                    </button>
                    {menuOpen && ( <>
                            <div className="menu-popup-backdrop" onClick={() => setMenuOpen(false)} />
                            <div className="menu-popup">
                                <button className="menu-popup-item" onClick={() => {
                                    localStorage.setItem("oaxaca_customer_alert", JSON.stringify({
                                        id: Date.now(),
                                        order: liveOrderId ?? "–",
                                        table: table_id,
                                        status: "Needs Assistance",
                                        type: "Help_Needed",
                                        read: false,
                                    }));
                                    setMenuOpen(false);
                                    }}>📞 Contact Waiter</button>
                                <button className="menu-popup-item" onClick={() => setMenuOpen(false)}>⚙️ Settings</button>
                            </div> </>
                    )}
                </div>
            </div>
        </header>
    );
}

// FILTERS : Allergens dropdown
function AllergenDropdown({ selected, onChange }) {
    const [open, setOpen] = useState(false);

    function handleToggle(allergen) {
        if (selected.includes(allergen)) { onChange(selected.filter((a) => a !== allergen));
        } else { onChange([...selected, allergen]);
        }
    }

    return (
        <div className="allergen-wrapper">
            <button className={`allergen-toggle ${selected.length > 0 ? "allergen-toggle--active" : ""}`} onClick={() => setOpen((v) => !v)} >
                <span>Does Not Contain</span>
                {selected.length > 0 && <span className="allergen-count">{selected.length}</span>}
                <span className="dropdown-arrow">{open ? "▲" : "▼"}</span>
            </button>

            {open && (
                <div className="allergen-list"> {ALLERGEN_OPTIONS.map((allergen) => (
                    <label key={allergen} className="allergen-option">
                        <input type="checkbox" checked={selected.includes(allergen)} onChange={() => handleToggle(allergen)}/>
                        {allergen}
                    </label>
                ))}
                </div>
            )}
        </div>
    );
}

// FILTERS : dietary filter buttons
function FilterBar({ activeFilters, onFilterToggle, excludedAllergens, onAllergenChange, onTrackOrder, hasActiveOrder }) {
    return (
        <div className="filter-bar">
            <div className="filter-row">
                <span className="filter-label">Show me</span>
                <div className="filter-buttons">
                    {DIET_FILTERS.map((filter) => (
                        <button key={filter} className={`filter-btn ${activeFilters.includes(filter) ? "filter-btn--active" : ""}`} onClick={() => onFilterToggle(filter)} >
                            {filter}
                        </button>
                    ))}
                </div>
                <AllergenDropdown selected={excludedAllergens} onChange={onAllergenChange} />
                {/* Track Order Button - Only enabled after order placed */}
                <button
                    className={`track-order-btn ${hasActiveOrder ? 'track-order-btn--active' : 'track-order-btn--disabled'}`}
                    onClick={onTrackOrder}
                    disabled={!hasActiveOrder}
                >
                    🧾 Track Order
                </button>
            </div>
        </div>
    );
}

// ========== CUSTOMIZATION POPUP ==========
function CustomizationPopup({ item, onClose, onAddToCart }) {
    const [removedIngredients, setRemovedIngredients] = useState([]);
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [specialRequest, setSpecialRequest] = useState('');

    const itemIngredients = INGREDIENTS[item.id] || ["Food1", "Food2", "Food3", "Food4", "Food5"];

    // Get extras specific to this item ID
    const itemExtras = EXTRAS_BY_ID[item.id] || [];

    const handleToggleIngredient = (ingredient) => {
        setRemovedIngredients(prev =>
            prev.includes(ingredient)
                ? prev.filter(i => i !== ingredient)
                : [...prev, ingredient]
        );
    };

    const handleToggleExtra = (extra) => {
        setSelectedExtras(prev =>
            prev.find(e => e.name === extra.name)
                ? prev.filter(e => e.name !== extra.name)
                : [...prev, extra]
        );
    };

    const handleAddToOrder = () => {
        const customizedItem = {
            ...item,
            customization: {
                removedIngredients,
                selectedExtras,
                specialRequest: specialRequest.trim()
            }
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
                    {/* Remove Ingredients Section */}
                    <div className="customization-section">
                        <h3 className="section-title">Remove Ingredients</h3>
                        <div className="ingredients-grid">
                            {itemIngredients.map((ingredient) => (
                                <button
                                    key={ingredient}
                                    className={`ingredient-btn ${removedIngredients.includes(ingredient) ? 'ingredient-btn--removed' : ''}`}
                                    onClick={() => handleToggleIngredient(ingredient)}
                                >
                                    {ingredient}
                                    {removedIngredients.includes(ingredient) && <span className="remove-icon">✕</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Add Extras Section */}
                    {itemExtras.length > 0 && (
                        <div className="customization-section">
                            <h3 className="section-title">Add Extras</h3>
                            <div className="extras-list">
                                {itemExtras.map((extra) => {
                                    const isSelected = selectedExtras.some(e => e.name === extra.name);
                                    return (
                                        <button
                                            key={extra.name}
                                            className={`extra-item ${isSelected ? 'extra-item--selected' : ''}`}
                                            onClick={() => handleToggleExtra(extra)}
                                        >
                                            <span className="extra-name">{extra.name}</span>
                                            <span className="extra-price">£{extra.price.toFixed(2)}</span>
                                            {isSelected && <span className="check-icon">✓</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Special Request Section */}
                    <div className="customization-section">
                        <h3 className="section-title">Special Request</h3>
                        <textarea
                            className="special-request-input"
                            placeholder="Any special instructions? (allergies, cooking preferences, etc.)"
                            value={specialRequest}
                            onChange={(e) => setSpecialRequest(e.target.value)}
                            rows="3"
                        />
                    </div>

                    {/* Price Summary */}
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
                    <button className="add-to-order-final-btn" onClick={handleAddToOrder}>
                        Add to Order • £{totalPrice}
                    </button>
                </div>
            </div>
        </div>
    );
}

// MENU : menu item card, with names and info
function MenuItemCard({ item, dimmed, onCustomize }) {
    return (
        <div className={`menu-item-card ${dimmed ? "menu-item-card--dimmed" : ""}`}>
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
                            {item.dietary.map((tag) => ( <span key={tag} className="diet-tag">{tag}</span> ))}
                        </div>
                    )}
                    {item.allergens.length > 0 && (
                        <p className="card-allergens">Contains: {item.allergens.join(", ")}</p>
                    )}
                    <span className="card-calories">{item.calories}</span>
                </div>

                <button
                    className="add-to-order-btn"
                    onClick={() => !dimmed && onCustomize(item)}
                    disabled={dimmed}
                >
                    + Add to Order
                </button>
            </div>
        </div>
    );
}

// MENU : menu section components, dropdown
function MenuSection({ sectionName, items, isOpen, onToggle, matchesFilter, onCustomize }) {
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
                        <MenuItemCard
                            key={item.id}
                            item={item}
                            dimmed={!matchesFilter(item)}
                            onCustomize={onCustomize}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// CART ITEMS : cartModal popup with quantity controls, modifications, placing order
function CartModal({ cart, onClose, onUpdateQty, onRemove, onPlaceOrder }) {
    const entries = Object.entries(cart).map(([key, value]) => ({
        key,
        ...value
    }));

    const total = entries.reduce((sum, { item, qty }) => {
        const basePrice = parseFloat(item.price.replace("£", ""));
        const extrasTotal = item.customization?.selectedExtras?.reduce((sum, extra) => sum + extra.price, 0) || 0;
        const itemTotal = (basePrice + extrasTotal) * qty;
        return sum + itemTotal;
    }, 0);

    const formatCustomizations = (item) => {
        const parts = [];
        if (item.customization?.removedIngredients?.length > 0) {
            parts.push(`No: ${item.customization.removedIngredients.join(', ')}`);
        }
        if (item.customization?.selectedExtras?.length > 0) {
            parts.push(`Extra: ${item.customization.selectedExtras.map(e => e.name).join(', ')}`);
        }
        if (item.customization?.specialRequest) {
            parts.push(`Note: ${item.customization.specialRequest}`);
        }
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
                    <p className="modal-empty">Your order is empty. Add some items from the menu!</p> ) : ( <>
                        <div className="modal-items">
                            {entries.map(({ key, item, qty }) => {
                                const basePrice = parseFloat(item.price.replace("£", ""));
                                const extrasTotal = item.customization?.selectedExtras?.reduce((sum, extra) => sum + extra.price, 0) || 0;
                                const itemPrice = basePrice + extrasTotal;
                                const linePrice = (itemPrice * qty).toFixed(2);
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
                            <button className="place-order-btn" onClick={onPlaceOrder}>
                                Place Order
                            </button>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}

// TRACKING POPUP
function TrackingPopup({ orderId, tableNumber, orderItems, total, onClose, onPaymentClick, currentStep, onStepClick }) {
    const steps = [
    { id: 1, name: "Order Placed" },
    { id: 2, name: "Confirmed by Waiter" },
    { id: 3, name: "Being Prepared" },
    { id: 4, name: "Ready for Service" },
    { id: 5, name: "Delivered" },
    ];

    const entries = Object.entries(orderItems).map(([key, value]) => ({
        key,
        ...value
    }));

    const formatCustomizations = (item) => {
        const parts = [];

        // Show removed ingredients
        if (item.customization?.removedIngredients?.length > 0) {
            parts.push(`No: ${item.customization.removedIngredients.join(', ')}`);
        }

        // Show selected extras with prices
        if (item.customization?.selectedExtras?.length > 0) {
            const extrasText = item.customization.selectedExtras
                .map(extra => `${extra.name} (+£${extra.price.toFixed(2)})`)
                .join(', ');
            parts.push(`Extra: ${extrasText}`);
        }

        // Show special request
        if (item.customization?.specialRequest) {
            parts.push(`Note: "${item.customization.specialRequest}"`);
        }

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

                    {/* Progress Steps - Clickable */}
                    <div className="progress-steps">
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className={`step-item ${currentStep >= step.id ? 'step-completed' : ''} ${currentStep === step.id ? 'step-current' : ''}`} >
                                <div className="step-indicator">
                                    {currentStep > step.id ? '✓' : step.id}
                                </div>
                                <div className="step-content">
                                    <span className="step-name">{step.name}</span>
                                    <span className="step-status">
                                        {currentStep > step.id ? 'Completed' :
                                            currentStep === step.id ? 'In Progress' :
                                                'Pending'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary with Full Customizations */}
                    <div className="tracking-order-summary">
                        <h3 className="summary-title">Order Summary</h3>
                        <div className="summary-items">
                            {entries.map(({ key, item, qty }) => {
                                const basePrice = parseFloat(item.price.replace("£", ""));
                                const extrasTotal = item.customization?.selectedExtras?.reduce((sum, extra) => sum + extra.price, 0) || 0;
                                const itemPrice = basePrice + extrasTotal;
                                const linePrice = (itemPrice * qty).toFixed(2);
                                const customizations = formatCustomizations(item);

                                return (
                                    <div key={key} className="summary-item">
                                        <div className="summary-item-header">
                                            <span className="summary-item-name">{item.name} ×{qty}</span>
                                            <span className="summary-item-price">£{linePrice}</span>
                                        </div>

                                        {/* Show all customizations */}
                                        {customizations.length > 0 && (
                                            <div className="summary-item-customizations">
                                                {customizations.map((custom, idx) => {
                                                    let customClass = "summary-custom-text";
                                                    if (custom.startsWith('No:')) {
                                                        customClass += " customization-removed";
                                                    } else if (custom.startsWith('Extra:')) {
                                                        customClass += " customization-extra";
                                                    } else if (custom.startsWith('Note:')) {
                                                        customClass += " customization-note";
                                                    }

                                                    return (
                                                        <p key={idx} className={customClass}>
                                                            {custom}
                                                        </p>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Show item total breakdown */}
                                        {item.customization?.selectedExtras?.length > 0 && (
                                            <div className="summary-item-breakdown">
                                                <span className="breakdown-text">
                                                    Base: {item.price} + Extras: £{extrasTotal.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Total */}
                        <div className="summary-total">
                            <span>Total Amount</span>
                            <span>£{total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Payment Message or Button */}
                    {currentStep === 5 ? (
                        <button className="pay-now-tracking-btn" onClick={handlePayNow}>
                            PAY NOW • £{total.toFixed(2)}
                        </button>
                    ) : (
                        <p className="payment-message">
                            Payment will be available once your order has been delivered
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

// ========== PAYMENT POPUP ==========
function PaymentPopup({ orderId, tableNumber, total, onClose, onConfirm }) {
    const [paymentMethod, setPaymentMethod] = useState('card');

    return (
        <div className="customization-overlay" onClick={onClose}>
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

                    <div className="payment-methods">
                        <button
                            className={`payment-method-btn ${paymentMethod === 'card' ? 'payment-method-selected' : ''}`}
                            onClick={() => setPaymentMethod('card')}
                        >
                            <span className="payment-method-icon">💳</span>
                            <span>Card</span>
                        </button>
                        <button
                            className={`payment-method-btn ${paymentMethod === 'cash' ? 'payment-method-selected' : ''}`}
                            onClick={() => setPaymentMethod('cash')}
                        >
                            <span className="payment-method-icon">💵</span>
                            <span>Cash</span>
                        </button>
                    </div>

                    <div className="payment-instructions">
                        {paymentMethod === 'card' ? (
                            <p className="instruction-text">
                                Please Tap or Insert Your Card To Complete The Payment
                            </p>
                        ) : (
                            <p className="instruction-text">
                                A Waiter Will Come To Your Table To Collect The Payment
                            </p>
                        )}
                    </div>

                    <div className="payment-total-due">
                        <span>Total Due</span>
                        <span>£{total.toFixed(2)}</span>
                    </div>

                    <button className="confirm-payment-btn" onClick={() => onConfirm(paymentMethod)}>
                        Confirm Payment
                    </button>
                </div>
            </div>
        </div>
    );
}

// Order Confirmation shown after a successfully placed order
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

// APP ROOT COMPONENT : main structure handling functions, menuData, filter operations
export default function App() {
    const [openSection, setOpenSection] = useState(null);
    const [activeFilters, setActiveFilters] = useState([]);
    const [excludedAllergens, setExcludedAllergens] = useState([]);

    // SESSION STORAGE HANDLING CUST_ID + TABLE_ID
    const { state } = useLocation();
    if (state?.cust_id) {
        sessionStorage.setItem('cust_id', state.cust_id);
        sessionStorage.setItem('table_id', state.table_id);
    }

    const cust_id  = state?.cust_id  ?? sessionStorage.getItem('cust_id');
    const table_id = state?.table_id ?? sessionStorage.getItem('table_id');

    // CART
    const [cart, setCart] = useState({});
    const [cartOpen, setCartOpen] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [customizingItem, setCustomizingItem] = useState(null);

    // Tracking and Payment states
    const [trackingOpen, setTrackingOpen] = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [placedOrder, setPlacedOrder] = useState({});

    // DYNAMIC ORDER PROGRESS WITH LIVESTEP ---------------------------------------
    const [liveStep, setLiveStep] = useState(1);
    const [liveOrderId, setLiveOrderId] = useState(
        sessionStorage.getItem('liveOrderId') ?? null
    );
    const [hasActiveOrder, setHasActiveOrder] = useState(
        !!sessionStorage.getItem('liveOrderId')
    );

    useEffect(() => {
        if (!liveOrderId) return;
        const statusToStep = {
        "Pending":     2, // WAITER CONFIRMATION
        "In Progress": 3, // BEING PREPARED : kitchen
        "Ready":       4,  // READY FOR SERVICE : kitchen → waiter
        "Completed":   5,  // DELIEVERED : waiter → customer
        };
        const poll = setInterval(async () => {
            const res = await fetch(`http://127.0.0.1:8000/orders/${liveOrderId}`);
            const data = await res.json();
            setLiveStep(statusToStep[data.status] ?? 1);
        }, 8000);
        return () => clearInterval(poll);
    }, [liveOrderId]);
    // --------------------------------------------------------------------------------

    // Generate random order ID
    const generateOrderId = () => {
        return Math.floor(1000 + Math.random() * 9000).toString();
    };

    // MENU : SECTION OPEN/CLOSE
    function handleSectionToggle(sectionName) {
        setOpenSection((prev) => (prev === sectionName ? null : sectionName));
    }

    // FILTER : DIETARY TOGGLING
    function handleFilterToggle(filter) {
        setActiveFilters((prev) =>
            prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
        );
    }

    // FILTER: MATCHING
    function matchesFilter(item) {
        const passesDietary =
            activeFilters.length === 0 ||
            activeFilters.every((f) => item.dietary.includes(f));

        const passesAllergens =
            excludedAllergens.length === 0 ||
            excludedAllergens.every((a) => !item.allergens.includes(a));

        return passesDietary && passesAllergens;
    }

    // CART : ADDING ITEMS
    function handleAddToCart(item) {
        const existingItemKey = Object.keys(cart).find(key => {
            const cartItem = cart[key].item;
            if (item.customization) {
                return cartItem.id === item.id &&
                    JSON.stringify(cartItem.customization) === JSON.stringify(item.customization);
            }
            return false;
        });

        if (existingItemKey) {
            setCart((prev) => ({
                ...prev,
                [existingItemKey]: {
                    ...prev[existingItemKey],
                    qty: prev[existingItemKey].qty + 1
                }
            }));
        } else {
            const uniqueId = item.customization
                ? `${item.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                : item.id;

            setCart((prev) => ({
                ...prev,
                [uniqueId]: {
                    item,
                    qty: 1,
                },
            }));
        }
    }

    // CART : UPDATING ITEMS
    function handleUpdateQty(itemKey, newQty) {
        if (newQty <= 0) {
            handleRemove(itemKey);
            return;
        }
        setCart((prev) => ({
            ...prev,
            [itemKey]: { ...prev[itemKey], qty: newQty },
        }));
    }

    // CART : REMOVING ITEMS
    function handleRemove(itemKey) {
        setCart((prev) => {
            const next = { ...prev };
            delete next[itemKey];
            return next;
        });
    }

    // CART : PLACING ORDERS
    async function handlePlaceOrder() {
    const items = Object.values(cart).map(({ item, qty }) => ({
        item_id: item.id,
        quantity: qty,
        price: parseFloat(item.price.replace("£", "")) +
               (item.customization?.selectedExtras?.reduce((s, e) => s + e.price, 0) || 0),
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
    } catch (err) {
        console.error('Could not reach server:', err);
        return;
    }

    // everything below is unchanged from MenuTwo
    const newOrderId = generateOrderId();
    setOrderId(newOrderId);
    setHasActiveOrder(true);
    setCurrentStep(1);
    setPlacedOrder(cart);
    setCartOpen(false);
    setCart({});
    setConfirmed(true);
    setTimeout(() => { setConfirmed(false); }, 2500);
}

    // Handle step click in tracking
    function handleStepClick(stepId) {
        setCurrentStep(stepId);
    }

    // Handle payment confirmation
    function handlePaymentConfirm(method) {
        setPaymentOpen(false);
        setHasActiveOrder(false); // Order completed
        setPlacedOrder({}); // Clear placed order
        setCurrentStep(1); // Reset steps
        alert(`Payment confirmed with ${method}. Thank you!`);
    }

    const cartCount = Object.values(cart).reduce((sum, { qty }) => sum + qty, 0);

    // Calculate cart total
    const cartTotal = Object.values(cart).reduce((sum, { item, qty }) => {
        const basePrice = parseFloat(item.price.replace("£", ""));
        const extrasTotal = item.customization?.selectedExtras?.reduce((sum, extra) => sum + extra.price, 0) || 0;
        const itemTotal = (basePrice + extrasTotal) * qty;
        return sum + itemTotal;
    }, 0);

    // Calculate placed order total
    const placedOrderTotal = Object.values(placedOrder).reduce((sum, { item, qty }) => {
        const basePrice = parseFloat(item.price.replace("£", ""));
        const extrasTotal = item.customization?.selectedExtras?.reduce((sum, extra) => sum + extra.price, 0) || 0;
        const itemTotal = (basePrice + extrasTotal) * qty;
        return sum + itemTotal;
    }, 0);

    return (
        <div className="app">
            <Header
                tableNumber={table_id ? `Table ${table_id}` : "Table"}
                cartCount={cartCount}
                onCartClick={() => setCartOpen(true)}
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
                            items={items}
                            isOpen={openSection === sectionName}
                            onToggle={() => handleSectionToggle(sectionName)}
                            matchesFilter={matchesFilter}
                            onCustomize={setCustomizingItem}
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

            {/* TRACKING POPUPS : only active when open */}
            {trackingOpen && hasActiveOrder && (
                <TrackingPopup
                    orderId={liveOrderId}
                    tableNumber={table_id ? `Table ${table_id}` : "Table"}
                    orderItems={placedOrder}
                    total={placedOrderTotal}
                    onClose={() => setTrackingOpen(false)}
                    onPaymentClick={() => setPaymentOpen(true)}
                    currentStep={liveStep}
                    onStepClick={() => {}}
                />
            )}

            {/* Payment Popup */}
            {paymentOpen && (
                <PaymentPopup
                    orderId={orderId}
                    tableNumber="Table 10"
                    total={placedOrderTotal} // Pass the placed order total
                    onClose={() => setPaymentOpen(false)}
                    onConfirm={handlePaymentConfirm}
                />
            )}
        </div>
    );
}