import React, { useState, useEffect } from 'react';
import './MenuSection.css';

const MenuSection = ({title, items}) => {
    const [showCartNotification, setShowCartNotification] = useState(false);
    const [notificationItem, setNotificationItem] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [gridClass, setGridClass] = useState('menu-grid-3-col');

    // Filter states
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedDiets, setSelectedDiets] = useState([]);
    const [selectedAllergies, setSelectedAllergies] = useState([]);
    const [filteredItems, setFilteredItems] = useState(items);
    const [tempSelectedCategories, setTempSelectedCategories] = useState([]);
    const [tempSelectedDiets, setTempSelectedDiets] = useState([]);
    const [tempSelectedAllergies, setTempSelectedAllergies] = useState([]);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setWindowWidth(width);

            // Update grid class based on width
            if (width >= 1200) {
                setGridClass('menu-grid-3-col');
            } else if (width >= 768) {
                setGridClass('menu-grid-2-col');
            } else {
                setGridClass('menu-grid-1-col');
            }
        };

        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Filter effect
    useEffect(() => {
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
    }, [selectedCategories, selectedDiets, selectedAllergies, items]);

    const handleAddToCart = (item) => {
        setNotificationItem(item.name);
        setShowCartNotification(true);

        // Hide notification after 3 seconds
        setTimeout(() => {
            setShowCartNotification(false);
        }, 3000);
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

    const applyFilters = () => {
        setSelectedCategories([...tempSelectedCategories]);
        setSelectedDiets([...tempSelectedDiets]);
        setSelectedAllergies([...tempSelectedAllergies]);
        setShowFilters(false);
    };

    const clearFilters = () => {
        setTempSelectedCategories([]);
        setTempSelectedDiets([]);
        setTempSelectedAllergies([]);
    };

    const resetAllFilters = () => {
        setSelectedCategories([]);
        setSelectedDiets([]);
        setSelectedAllergies([]);
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
            {/* Header - Top Bar */}
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

                {/* Dynamic title */}
                <div className="control-bar">
                    <h2 className="mains-title">{title}</h2>
                    <div className="controls">
                        <button className="call-waiter-button">Call Waiter</button>
                        <button className="icon-button">🛒</button>
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
                                    {item.ingredients?.join(', ')}
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

            {/* Cart Notification */}
            {showCartNotification && (
                <div className="cart-notification">
                    {notificationItem} added to cart!
                </div>
            )}

            {/* Filter Popup */}
            {showFilters && (
                <div className="filter-modal-overlay" onClick={closeFilters}>
                    <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="filter-modal-header">
                            <h3>Filter Menu</h3>
                            <button className="close-button" onClick={closeFilters}>✕</button>
                        </div>

                        <div className="filter-modal-body">
                            {/* Category Filter */}
                            <div className="filter-section">
                                <h4>Category</h4>
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
                                <h4>Diet</h4>
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
                                <h4>Exclude Allergy</h4>
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

                        <div className="filter-modal-footer">
                            <button className="clear-filters-btn" onClick={clearFilters}>
                                Clear
                            </button>
                            <button className="apply-filters-btn" onClick={applyFilters}>
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuSection;