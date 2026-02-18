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
            name: "Coca Cola",
            price: 4.99,
            description: "Original Can Coca Cola",
            category: "Fizzy",
            diet: ["Vegan"],
            calories: 210,
            allergies: [],
            ingredients: ["Coca Cola"]
        },
        {
            id: 4,
            name: "Pepsi",
            price: 4.99,
            description: "Original Can Pepsi",
            category: "Fizzy",
            diet: ["Vegan", "Gluten-Free"],
            calories: 200,
            allergies: [],
            ingredients: ["Pepsi"]
        },
        {
            id: 5,
            name: "Orange Juice",
            price: 14.99,
            description: "Orange with Lime and Ice",
            category: "Juice",
            diet: ["Vegan", "Gluten-Free"],
            calories: 300,
            allergies: [],
            ingredients: ["Orange", "Lime", "Ice"]
        },
        {
            id: 6,
            name: "Apple Juice",
            price: 14.99,
            description: "Apple with Lime and Ice",
            category: "Juice",
            diet: ["Vegan", "Gluten-Free"],
            calories: 300,
            allergies: [],
            ingredients: ["Apple", "Lime", "Ice"]
        },

    ];

    return <MenuSection title="DRINKS" items={drinksItems} />;
};

export default Drinks;