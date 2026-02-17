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
        {
            id: 2,
            name: "Chocolate Lava Cake",
            price: 7.99,
            description: "Warm chocolate cake with molten center",
            category: "Desserts",
            diet: ["Vegetarian"],
            calories: 420,
            allergies: ["Dairy", "Gluten", "Eggs"],
            ingredients: ["Chocolate", "Flour", "Butter", "Eggs", "Sugar"]
        },
        {
            id: 3,
            name: "Fried Ice Cream",
            price: 6.99,
            description: "Vanilla ice cream with crispy coating, topped with cinnamon",
            category: "Desserts",
            diet: ["Vegetarian"],
            calories: 350,
            allergies: ["Dairy", "Gluten"],
            ingredients: ["Ice Cream", "Corn Flakes", "Cinnamon", "Honey", "Whipped Cream"]
        },

    ];

    return <MenuSection title="DESSERTS" items={dessertsItems} />;
};

export default Desserts;