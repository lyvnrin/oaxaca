import React from 'react';
import MenuSection from './MenuSection';

const Drinks = () => {
    const drinksItems = [
        {
            id: 1,
            name: "Classic Margarita",
            price: 8.99,
            description: "Tequila, lime juice, triple sec, served with salt rim",
            category: "Cocktails",
            diet: ["Gluten-Free"],
            calories: 180,
            allergies: [],
            ingredients: ["Tequila", "Lime", "Triple Sec", "Agave", "Salt"]
        },

    ];

    return <MenuSection title="DRINKS" items={drinksItems} />;
};

export default Drinks;