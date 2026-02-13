import React, { useState, useEffect } from 'react';
import './MenuSection.css';

const MenuSection = ({title, items}) => {
    const [showCartNotification, setShowCartNotification] = useState(false);
    const [notificationItem, setNotificationItem] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [gridClass, setGridClass] = useState('menu-grid-3-col');

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

    const handleAddToCart = (item) => {
        setNotificationItem(item.name);
        setShowCartNotification(true);

        // Hide notification after 3 seconds
        setTimeout(() => {
            setShowCartNotification(false);
        }, 3000);
    };

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

                {/* Control Bar - MAINS with icons */}
                <div className="control-bar">
                    <h2 className="mains-title">{title}</h2>
                    <div className="controls">
                        <button className="call-waiter-button">
                            Call Waiter
                        </button>
                        <button className="icon-button">
                            🛒
                        </button>
                        <button className="icon-button">
                            ⚙️
                        </button>
                    </div>
                </div>
            </header>

            {/* Menu Grid - Responsive */}
            <main className={`menu-grid ${gridClass}`}>
                {items.map((item) => (
                    <div key={item.id} className="menu-item">
                        {/* Image placeholder */}
                        <div className="image-placeholder">
                            Image {item.id}
                        </div>

                        <div className="menu-content">
                            {/* Category */}
                            <div className="category-tag">
                                {item.category}
                            </div>

                            {/* Name and Price */}
                            <div className="item-header">
                                <h3 className="item-name">{item.name}</h3>
                                <p className="item-price">£{item.price}</p>
                            </div>

                            {/* Description */}
                            <p className="item-description">{item.description}</p>

                            {/* Ingredients */}
                            <div className="ingredients-section">
                                <div className="section-title">Ingredients:</div>
                                <div className="ingredients-list">
                                    {item.ingredients?.join(', ')}
                                </div>
                            </div>

                            {/* Diet & Allergies */}
                            <div className="item-details">
                                {/* Diet Restrictions */}
                                {item.diet && item.diet.length > 0 && (
                                    <div className="diet-section">
                                        <div className="section-title">Diet:</div>
                                        <div className="diet-tags">
                                            {item.diet.map((diet, index) => (
                                                <span key={index} className="diet-tag">
                          {diet}
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Allergies */}
                                {item.allergies && item.allergies.length > 0 && (
                                    <div className="diet-section">
                                        <div className="section-title">Allergies:</div>
                                        <div className="allergy-tags">
                                            {item.allergies.map((allergy, index) => (
                                                <span key={index} className="allergy-tag">
                          {allergy}
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Calories */}
                            <div className="calories-info">
                                <span className="calories">{item.calories} calories</span>
                            </div>

                            {/* Add to Cart Button */}
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
        </div>
    );
};

export default MenuSection;