import React, { useState, useEffect } from 'react';
import './styles/MenuItems.css';

const MenuItems = () => {
    const [showCartNotification, setShowCartNotification] = useState(false);
    const [notificationItem, setNotificationItem] = useState('');
    const [ setWindowWidth] = useState(window.innerWidth);
    const [gridClass, setGridClass] = useState('menu-grid-3-col');

    // Update window width and grid class on resize
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

    // Simple Mexican restaurant menu items with placeholders
    const menuItems = [
        {
            id: 1,
            name: "Menu 1",
            price: 11.99,
            description: "Grilled steak with onions, cilantro, lime juice, corn tortillas",
            category: "Tacos",
            diet: ["Gluten-Free"],
            calories: 320,
            allergies: [],
            ingredients: ["Beef", "Onion", "Cilantro", "Lime", "Corn Tortillas"]
        },
        {
            id: 2,
            name: "Menu 2",
            price: 15.19,
            description: "Chicken with verde sauce, melted cheese, corn tortillas",
            category: "Enchiladas",
            diet: [],
            calories: 420,
            allergies: ["Dairy", "Gluten"],
            ingredients: ["Chicken", "Cheese", "Corn Tortillas", "Verde Sauce"]
        },
        {
            id: 3,
            name: "Menu 3",
            price: 13.59,
            description: "Beans, rice, guacamole, pico de gallo, flour tortilla",
            category: "Burritos",
            diet: ["Vegetarian"],
            calories: 580,
            allergies: ["Gluten"],
            ingredients: ["Beans", "Rice", "Avocado", "Tomato", "Flour Tortilla"]
        },
        {
            id: 4,
            name: "Menu 4",
            price: 19.99,
            description: "Shrimp, garlic, chili peppers, lime juice, olive oil",
            category: "Seafood",
            diet: ["Gluten-Free"],
            calories: 280,
            allergies: ["Shellfish"],
            ingredients: ["Shrimp", "Garlic", "Chili", "Lime", "Olive Oil"]
        },
        {
            id: 5,
            name: "Menu 5",
            price: 18.39,
            description: "Chicken, mole sauce, sesame seeds, chocolate, spices",
            category: "Main Dishes",
            diet: ["Gluten-Free"],
            calories: 450,
            allergies: ["Nuts"],
            ingredients: ["Chicken", "Chocolate", "Sesame", "Spices", "Tomato"]
        },
        {
            id: 6,
            name: "Menu 6",
            price: 10.39,
            description: "Melted cheese, chorizo, tortillas, salsa",
            category: "Appetizers",
            diet: [],
            calories: 380,
            allergies: ["Dairy", "Gluten"],
            ingredients: ["Cheese", "Chorizo", "Flour Tortillas", "Salsa"]
        },
        {
            id: 7,
            name: "Menu 7",
            price: 12.79,
            description: "Refried beans, lettuce, salsa, corn tortillas",
            category: "Tostadas",
            diet: ["Vegan", "Gluten-Free"],
            calories: 320,
            allergies: [],
            ingredients: ["Beans", "Lettuce", "Salsa", "Corn Tortillas", "Onion"]
        },
        {
            id: 8,
            name: "Menu 8",
            price: 21.59,
            description: "Slow-cooked lamb, onions, cilantro, consommé",
            category: "Main Dishes",
            diet: ["Gluten-Free"],
            calories: 520,
            allergies: [],
            ingredients: ["Lamb", "Onion", "Cilantro", "Broth", "Bay Leaves"]
        },
        {
            id: 9,
            name: "Menu 9",
            price: 15.99,
            description: "Poblano peppers, cheese, batter, tomato sauce",
            category: "Main Dishes",
            diet: ["Vegetarian"],
            calories: 480,
            allergies: ["Dairy", "Gluten"],
            ingredients: ["Poblano Peppers", "Cheese", "Flour", "Eggs", "Tomato Sauce"]
        },
        {
            id: 10,
            name: "Menu 10",
            price: 17.59,
            description: "Fish, shrimp, lime juice, tomatoes, cilantro",
            category: "Seafood",
            diet: ["Gluten-Free"],
            calories: 220,
            allergies: ["Shellfish"],
            ingredients: ["Fish", "Shrimp", "Lime", "Tomato", "Cilantro", "Onion"]
        },
        {
            id: 11,
            name: "Menu 11",
            price: 14.39,
            description: "Masa, mole negro, chicken, banana leaves",
            category: "Tamales",
            diet: ["Gluten-Free"],
            calories: 380,
            allergies: [],
            ingredients: ["Corn Masa", "Chicken", "Mole Sauce", "Banana Leaves"]
        },
        {
            id: 12,
            name: "Menu 12",
            price: 8.79,
            description: "Avocado, lime, onion, cilantro, tortilla chips",
            category: "Appetizers",
            diet: ["Vegan", "Gluten-Free"],
            calories: 280,
            allergies: [],
            ingredients: ["Avocado", "Lime", "Onion", "Cilantro", "Corn Chips"]
        },
    ];

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
                    <h2 className="mains-title">MAINS</h2>
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
                {menuItems.map((item) => (
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
                                    {item.ingredients.join(', ')}
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

export default MenuItems;