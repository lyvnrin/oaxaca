import React from 'react';
import MenuSection from './MenuSection';

const Mains = () => {
    const mainsItems = [
        {
            id: 1,
            name: "Steak Burrito",
            price: 18.99,
            description: "Grilled steak with onions, cilantro, lime juice, corn tortillas",
            category: "Burritos",
            diet: ["Gluten-Free"],
            calories: 420,
            allergies: [],
            ingredients: ["Beef", "Onion", "Cilantro", "Lime", "Corn Tortillas"]
        },
        {
            id: 2,
            name: "Chicken Burrito",
            price: 16.99,
            description: "Chicken with verde sauce, melted cheese, corn tortillas",
            category: "Burritos",
            diet: ["Gluten-Free"],
            calories: 580,
            allergies: ["Dairy"],
            ingredients: ["Chicken", "Cheese", "Corn Tortillas", "Verde Sauce"]
        },
        {
            id: 3,
            name: "Vegetarian Burrito",
            price: 14.99,
            description: "Beans, rice, guacamole, pico de gallo, flour tortilla",
            category: "Burritos",
            diet: ["Vegetarian"],
            calories: 650,
            allergies: ["Gluten"],
            ingredients: ["Beans", "Rice", "Avocado", "Tomato", "Flour Tortilla"]
        },
        {
            id: 4,
            name: "Steak Tacos",
            price: 14.99,
            description: "Three corn tortillas with grilled steak, onion, cilantro, and lime",
            category: "Tacos",
            diet: ["Gluten-Free"],
            calories: 450,
            allergies: [],
            ingredients: ["Steak", "Onion", "Cilantro", "Lime", "Corn Tortillas", "Salsa"]
        },
        {
            id: 5,
            name: "Chicken Tinga Tacos",
            price: 13.99,
            description: "Three corn tortillas with shredded chicken in tomato-chipotle sauce, onion, and cilantro",
            category: "Tacos",
            diet: ["Gluten-Free"],
            calories: 420,
            allergies: [],
            ingredients: ["Chicken", "Tomato", "Chipotle", "Onion", "Cilantro", "Corn Tortillas"]
        },
        {
            id: 6,
            name: "Pork Tacos",
            price: 14.99,
            description: "Three corn tortillas with slow-cooked pork, onion, cilantro, and salsa verde",
            category: "Tacos",
            diet: ["Gluten-Free"],
            calories: 480,
            allergies: [],
            ingredients: ["Pork", "Onion", "Cilantro", "Salsa Verde", "Lime", "Corn Tortillas"]
        }

    ];

    return <MenuSection title="MAINS" items={mainsItems} />;
};

export default Mains;