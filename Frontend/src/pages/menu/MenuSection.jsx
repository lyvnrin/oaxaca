import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './MenuSection.css';

const MenuSection = ({title, items, category}) => {
    const [showCartNotification, setShowCartNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [gridClass, setGridClass] = useState('menu-grid-3-col');

    // Add to cart modal states
    const [showCartModal, setShowCartModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemQuantity, setItemQuantity] = useState(1);
    // Track items in cart for this session
    const [cartItems, setCartItems] = useState({});

    // Filter states
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedDiets, setSelectedDiets] = useState([]);
    const [selectedAllergies, setSelectedAllergies] = useState([]);
    const [filteredItems, setFilteredItems] = useState(items || []);
    const [tempSelectedCategories, setTempSelectedCategories] = useState([]);
    const [tempSelectedDiets, setTempSelectedDiets] = useState([]);
    const [tempSelectedAllergies, setTempSelectedAllergies] = useState([]);

    // Flag to prevent local useEffect overwriting Python backend results
    const [backendFiltered, setBackendFiltered] = useState(false);     

    // order summary
    const navigate = useNavigate();
    const goToOrderSummary = () => {
        navigate("/order-summary");
    };

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setWindowWidth(width);

            if (width >= 1200) {
                setGridClass('menu-grid-3-col');
            } else if (width >= 768) {
                setGridClass('menu-grid-2-col');
            } else {
                setGridClass('menu-grid-1-col');
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Clear notification timeout
    useEffect(() => {
        let timeoutId;
        if (showCartNotification) {
            timeoutId = setTimeout(() => {
                setShowCartNotification(false);
            }, 2000);
        }
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [showCartNotification]);

    // Filter effect
    /*
    useEffect(() => {
        if (backendFiltered) return;

        let filtered = [...items];

        if (selectedCategories.length > 0) {
            filtered = filtered.filter(item => selectedCategories.includes(item.category));
        }

        if (selectedDiets.length > 0) {
            filtered = filtered.filter(item =>
                item.diet && selectedDiets.some(diet => item.diet.includes(diet))
            );
        }

        if (selectedAllergies.length > 0) {
            filtered = filtered.filter(item =>
                !item.allergies || !selectedAllergies.some(allergy => item.allergies.includes(allergy))
            );
        }

        setFilteredItems(filtered);
    }, [selectedCategories, selectedDiets, selectedAllergies, items]);*/

    useEffect(() => {
    applyFilters();
    }, [items, category]);



    const handleAddToCart = (item) => {
        setSelectedItem(item);
        // Get current quantity from cart or default to 0
        const currentQty = cartItems[item.id] || 0;
        setItemQuantity(currentQty + 1);
        setShowCartModal(true);
    };

    const handleAddMore = () => {
        const newQuantity = itemQuantity + 1;
        setItemQuantity(newQuantity);

        // Update cart items
        setCartItems({
            ...cartItems,
            [selectedItem.id]: newQuantity
        });

        // Show notification with updated quantity
        setNotificationMessage(`${selectedItem.name} x${newQuantity} added to cart`);
        setShowCartNotification(true);

        console.log(`Added to cart: ${selectedItem.name} x${newQuantity}`);
    };

    const handleAddToCartFromModal = () => {
        // Update cart items
        setCartItems({
            ...cartItems,
            [selectedItem.id]: itemQuantity
        });

        // Show notification
        setNotificationMessage(`${selectedItem.name} x${itemQuantity} added to cart`);
        setShowCartNotification(true);
        setShowCartModal(false);
    };

    const handleGoToCart = () => {
        setShowCartModal(false);
        console.log("Go to cart clicked - to be implemented by team");

    };

    // Filter handlers
    const openFilters = () => {
        setTempSelectedCategories([...selectedCategories]);
        setTempSelectedDiets([...selectedDiets]);
        setTempSelectedAllergies([...selectedAllergies]);
        setShowFilters(true);
    };

    const closeFilters = () => {
        setShowFilters(false);
    };

    const applyFilters = async () => {
    setSelectedCategories([...tempSelectedCategories]);
    setSelectedDiets([...tempSelectedDiets]);
    setSelectedAllergies([...tempSelectedAllergies]);

    const vegetarian = tempSelectedDiets.includes('Vegetarian');
    const glutenFree = tempSelectedDiets.includes('Gluten-Free');

    if (vegetarian || glutenFree) {
        try {
            const params = new URLSearchParams();
            if (vegetarian) params.append('vegetarian', true);
            if (glutenFree) params.append('gluten_free', true);

            const res = await fetch(`http://localhost:8000/api/menu/${category}?${params}`);
            let data = await res.json();

            // Ensure we always have an array
            if (!Array.isArray(data)) data = [];

            // Map backend keys to frontend keys safely
            data = data.map(item => ({
                id: item.id,
                name: item.name || "",
                description: item.description || "",
                price: item.price || 0,
                category: item.category || "",
                diet: item.diet || [],
                allergies: item.allergies || [],
                calories: item.calories || 0,
                available: item.available ?? true
            }));

            setBackendFiltered(true);
            setFilteredItems(data);
        } catch (error) {
            console.error('Backend unavailable:', error);
            setFilteredItems([]);  // fallback to empty array
        }
    } else {
        setBackendFiltered(false);
        setFilteredItems(items);
    }

    setShowFilters(false);
};


    const clearFilters = () => {
        setTempSelectedCategories([]);
        setTempSelectedDiets([]);
        setTempSelectedAllergies([]);
    };

    const resetAllFilters = async () => {
    setSelectedCategories([]);
    setSelectedDiets([]);
    setSelectedAllergies([]);

    setTempSelectedCategories([]);
    setTempSelectedDiets([]);
    setTempSelectedAllergies([]);

    try {
        const res = await fetch(`http://localhost:8000/api/menu?section=${category}`);
        const data = await res.json();
        setFilteredItems(data);
    } catch (err) {
        console.error(err);
    }

    setShowFilters(false);
};

    const toggleCategory = (category) => {
        if (tempSelectedCategories.includes(category)) {
            setTempSelectedCategories(tempSelectedCategories.filter(c => c !== category));
        } else {
            setTempSelectedCategories([...tempSelectedCategories, category]);
        }
    };

    const toggleDiet = (diet) => {
        if (tempSelectedDiets.includes(diet)) {
            setTempSelectedDiets(tempSelectedDiets.filter(d => d !== diet));
        } else {
            setTempSelectedDiets([...tempSelectedDiets, diet]);
        }
    };

    const toggleAllergy = (allergy) => {
        if (tempSelectedAllergies.includes(allergy)) {
            setTempSelectedAllergies(tempSelectedAllergies.filter(a => a !== allergy));
        } else {
            setTempSelectedAllergies([...tempSelectedAllergies, allergy]);
        }
    };

    // Check if any filters are active
    const hasActiveFilters = selectedCategories.length > 0 || selectedDiets.length > 0 || selectedAllergies.length > 0;

    return (
        <div className="oaxaca-container">
            {/* Header - Top Bar with Oaxaca left, Customer middle, Table right */}
            <header className="oaxaca-header">
                <div className="top-bar">
                    <h1 className="restaurant-name">OAXACA</h1>
                    <div className="customer-info">
                        <p className="customer-name">Customer Name</p>
                    </div>
                    <div className="table-info">
                        <p className="table-number">Table 12</p>
                    </div>
                </div>

                {/* Control Bar */}
                <div className="control-bar">
                    <h2 className="mains-title">{title}</h2>
                    <div className="controls">
                        <button className="call-waiter-button">Call Waiter</button>
                        <button className="icon-button" onClick={goToOrderSummary}>🛒</button>
                        <button className="icon-button filter-button" onClick={openFilters}>
                            🔍
                        </button>
                    </div>
                </div>
            </header>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="active-filters">
                    <span className="active-filters-label">Active filters: </span>
                    {selectedCategories.map(cat => (
                        <span key={cat} className="filter-badge">{cat}</span>
                    ))}
                    {selectedDiets.map(diet => (
                        <span key={diet} className="filter-badge diet-badge">{diet}</span>
                    ))}
                    {selectedAllergies.map(allergy => (
                        <span key={allergy} className="filter-badge allergy-badge">No {allergy}</span>
                    ))}
                    <button className="clear-filters-btn-small" onClick={resetAllFilters}>Clear All</button>
                </div>
            )}

            {/* Results count */}
            <div className="results-count">
                Showing {filteredItems.length} of {items.length} items
            </div>

            {/* Menu Grid */}
            <main className={`menu-grid ${gridClass}`}>
                {filteredItems.map((item) => (
                    <div key={item.id} className="menu-item">
                        <div className="image-placeholder">Image {item.id}</div>
                        <div className="menu-content">
                            <div className="category-tag">{item.category}</div>
                            <div className="item-header">
                                <h3 className="item-name">{item.name}</h3>
                                <p className="item-price">£{item.price}</p>
                            </div>
                            <p className="item-description">{item.description}</p>

                            <div className="ingredients-section">
                                <div className="section-title">Ingredients:</div>
                                <div className="ingredients-list">
                                    {(item.ingredients || []).join(', ')}
                                </div>
                            </div>

                            <div className="item-details">
                                {item.diet && item.diet.length > 0 && (
                                    <div className="diet-section">
                                        <div className="section-title">Diet:</div>
                                        <div className="diet-tags">
                                            {item.diet.map((diet, i) => (
                                                <span key={i} className="diet-tag">{diet}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {item.allergies && item.allergies.length > 0 && (
                                    <div className="diet-section">
                                        <div className="section-title">Allergies:</div>
                                        <div className="allergy-tags">
                                            {item.allergies.map((allergy, i) => (
                                                <span key={i} className="allergy-tag">{allergy}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="calories-info">
                                <span className="calories">{item.calories} calories</span>
                            </div>

                            {/* Add to cart button */}
                            <button
                                className="add-to-cart-button"
                                onClick={() => handleAddToCart(item)}
                            >
                                ADD TO CART
                            </button>
                        </div>
                    </div>
                ))}
            </main>

            {showCartNotification && (
                <div className="cart-notification">
                    {notificationMessage}
                </div>
            )}

            {showCartModal && selectedItem && (
                <div className="cart-modal-overlay" onClick={() => setShowCartModal(false)}>
                    <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="cart-modal-header">
                            <h3>Add to Cart</h3>
                            <button className="close-button" onClick={() => setShowCartModal(false)}>✕</button>
                        </div>

                        <div className="cart-modal-body">
                            <div className="cart-item-info">
                                <h4>{selectedItem.name}</h4>
                                <p className="cart-item-price">£{selectedItem.price}</p>
                                <p className="cart-item-quantity">Quantity: {itemQuantity}</p>
                            </div>
                        </div>

                        <div className="cart-modal-footer">
                            {/* ADD MORE button - increases quantity by 1 each time */}
                            <button className="add-more-btn" onClick={handleAddMore}>
                                ADD MORE
                            </button>

                            {/* GO TO CART button - does nothing (placeholder) */}
                            <button className="go-to-cart-btn" onClick={handleGoToCart}>
                                GO TO CART
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Popup */}
            {showFilters && (
                <div className="filter-modal-overlay" onClick={closeFilters}>
                    <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="filter-modal-header">
                            <h3>FILTER MENU</h3>
                            <button className="close-button" onClick={closeFilters}>✕</button>
                        </div>

                        <div className="filter-modal-body">
                            {/* Category Filter */}
                            <div className="filter-section">
                                <h4>CATEGORY</h4>
                                <div className="filter-options">
                                    <label className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={tempSelectedCategories.includes('Fritters')}
                                            onChange={() => toggleCategory('Fritters')}
                                        />
                                        <span>Fritters</span>
                                    </label>
                                    <label className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={tempSelectedCategories.includes('Flautas')}
                                            onChange={() => toggleCategory('Flautas')}
                                        />
                                        <span>Flautas</span>
                                    </label>
                                    <label className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={tempSelectedCategories.includes('Tacos')}
                                            onChange={() => toggleCategory('Tacos')}
                                        />
                                        <span>Tacos</span>
                                    </label>
                                    <label className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={tempSelectedCategories.includes('Burritos')}
                                            onChange={() => toggleCategory('Burritos')}
                                        />
                                        <span>Burritos</span>
                                    </label>
                                    <label className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={tempSelectedCategories.includes('Tiramisu')}
                                            onChange={() => toggleCategory('Tiramisu')}
                                        />
                                        <span>Tiramisu</span>
                                    </label>
                                    <label className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={tempSelectedCategories.includes('Cake')}
                                            onChange={() => toggleCategory('Cake')}
                                        />
                                        <span>Cake</span>
                                    </label>
                                    <label className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={tempSelectedCategories.includes('Cocktails')}
                                            onChange={() => toggleCategory('Cocktails')}
                                        />
                                        <span>Cocktails</span>
                                    </label>
                                    <label className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={tempSelectedCategories.includes('Juice')}
                                            onChange={() => toggleCategory('Juice')}
                                        />
                                        <span>Juice</span>
                                    </label>
                                </div>
                            </div>

                            {/* Diet Filter */}
                            <div className="filter-section">
                                <h4>DIET</h4>
                                <div className="filter-options">
                                    <label className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={tempSelectedDiets.includes('Vegetarian')}
                                            onChange={() => toggleDiet('Vegetarian')}
                                        />
                                        <span>Vegetarian</span>
                                    </label>
                                    <label className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={tempSelectedDiets.includes('Vegan')}
                                            onChange={() => toggleDiet('Vegan')}
                                        />
                                        <span>Vegan</span>
                                    </label>
                                    <label className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={tempSelectedDiets.includes('Gluten-Free')}
                                            onChange={() => toggleDiet('Gluten-Free')}
                                        />
                                        <span>Gluten-Free</span>
                                    </label>
                                </div>
                            </div>

                            {/* Exclude Allergy Filter */}
                            <div className="filter-section">
                                <h4>EXCLUDE ALLERGY</h4>
                                <div className="filter-options">
                                    <label className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={tempSelectedAllergies.includes('Nuts')}
                                            onChange={() => toggleAllergy('Nuts')}
                                        />
                                        <span>Nuts</span>
                                    </label>
                                    <label className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={tempSelectedAllergies.includes('Dairy')}
                                            onChange={() => toggleAllergy('Dairy')}
                                        />
                                        <span>Dairy</span>
                                    </label>
                                    <label className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={tempSelectedAllergies.includes('Gluten')}
                                            onChange={() => toggleAllergy('Gluten')}
                                        />
                                        <span>Gluten</span>
                                    </label>
                                    <label className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={tempSelectedAllergies.includes('Eggs')}
                                            onChange={() => toggleAllergy('Eggs')}
                                        />
                                        <span>Eggs</span>
                                    </label>
                                    <label className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={tempSelectedAllergies.includes('Mushrooms')}
                                            onChange={() => toggleAllergy('Mushrooms')}
                                        />
                                        <span>Mushrooms</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Filter modal footer with buttons */}
                        <div className="filter-modal-footer">
                            <button className="clear-filters-btn" onClick={clearFilters}>
                                CLEAR
                            </button>
                            <button className="apply-filters-btn" onClick={applyFilters}>
                                APPLY FILTERS
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuSection;