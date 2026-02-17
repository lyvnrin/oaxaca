import React from 'react';
import MenuSection from './MenuSection';

const Starters = () => {
    const startersItems = [
        {
            id: 1,
            name: "Guacamole & Chips",
            price: 8.99,
            description: "Fresh avocado dip with house-made tortilla chips",
            category: "Appetizers",
            diet: ["Vegan", "Gluten-Free"],
            calories: 280,
            allergies: [],
            ingredients: ["Avocado", "Lime", "Onion", "Cilantro", "Corn Chips"]
        },
        {
            id: 2,
            name: "Queso Fundido",
            price: 9.99,
            description: "Melted cheese with chorizo, served with tortillas",
            category: "Appetizers",
            diet: [],
            calories: 380,
            allergies: ["Dairy", "Gluten"],
            ingredients: ["Cheese", "Chorizo", "Flour Tortillas", "Salsa"]
        },
        {
            id: 3,
            name: "Mexican Street Corn",
            price: 7.99,
            description: "Grilled corn with mayo, cheese, chili powder & lime",
            category: "Appetizers",
            diet: ["Vegetarian"],
            calories: 220,
            allergies: ["Dairy"],
            ingredients: ["Corn", "Mayo", "Cheese", "Chili Powder", "Lime"]
        },

    ];

    return <MenuSection title="STARTERS" items={startersItems} />;
};

export default Starters;