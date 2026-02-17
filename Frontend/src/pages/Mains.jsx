import React from 'react';
import MenuSection from './MenuSection';

const Mains = () => {
    const mainsItems = [
        {
            id: 1,
            name: "Carne Asada",
            price: 18.99,
            description: "Grilled steak with onions, cilantro, lime juice, corn tortillas",
            category: "Tacos",
            diet: ["Gluten-Free"],
            calories: 420,
            allergies: [],
            ingredients: ["Beef", "Onion", "Cilantro", "Lime", "Corn Tortillas"]
        },
        {
            id: 2,
            name: "Chicken Enchiladas",
            price: 16.99,
            description: "Chicken with verde sauce, melted cheese, corn tortillas",
            category: "Enchiladas",
            diet: [],
            calories: 580,
            allergies: ["Dairy", "Gluten"],
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

    ];

    return <MenuSection title="MAINS" items={mainsItems} />;
};

export default Mains;