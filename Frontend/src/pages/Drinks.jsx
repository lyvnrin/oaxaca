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
        {
            id: 2,
            name: "Paloma",
            price: 8.99,
            description: "Tequila with grapefruit soda and lime",
            category: "Cocktails",
            diet: ["Gluten-Free"],
            calories: 160,
            allergies: [],
            ingredients: ["Tequila", "Grapefruit Soda", "Lime", "Salt"]
        },
        {
            id: 3,
            name: "Mexican Hot Chocolate",
            price: 4.99,
            description: "Rich hot chocolate with cinnamon",
            category: "Non-Alcoholic",
            diet: ["Vegetarian"],
            calories: 210,
            allergies: ["Dairy"],
            ingredients: ["Chocolate", "Milk", "Cinnamon", "Vanilla", "Sugar"]
        }

    ];

    return <MenuSection title="DRINKS" items={drinksItems} />;
};

export default Drinks;