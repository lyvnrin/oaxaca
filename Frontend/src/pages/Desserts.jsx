import React from 'react';
import MenuSection from './MenuSection';

const Desserts = () => {
    const dessertsItems = [
        {
            id: 1,
            name: "Churros",
            price: 6.99,
            description: "Cinnamon sugar churros with chocolate dipping sauce",
            category: "Desserts",
            diet: ["Vegetarian"],
            calories: 320,
            allergies: ["Gluten", "Dairy"],
            ingredients: ["Flour", "Sugar", "Cinnamon", "Chocolate", "Oil"]
        },

    ];

    return <MenuSection title="DESSERTS" items={dessertsItems} />;
};

export default Desserts;