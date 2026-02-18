import React from 'react';
import MenuSection from './MenuSection';

const Desserts = () => {
    const dessertsItems = [
        {
            id: 1,
            name: "Tiramisu",
            price: 6.99,
            description: "Classic desserts with coffee soaked ladyfingers with mascarpone cream",
            category: "Tiramisu",
            diet: ["Vegetarian"],
            calories: 320,
            allergies: ["Gluten", "Dairy", "Eggs"],
            ingredients: ["Ladyfingers", "Coffee", "Mascarpone", "Cocoa", "Sugar", "Eggs"],
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
        {
            id: 4,
            name: "Red Velvet Lava Cake",
            price: 4.99,
            description: "Warm red velvet cake with molten center",
            category: "Cake",
            diet: ["Vegetarian"],
            calories: 420,
            allergies: ["Dairy", "Gluten", "Eggs"],
            ingredients: ["Red Velvet", "Flour", "Butter", "Eggs", "Sugar"]
        },
        {
            id: 5,
            name: "Coconut Lava Cake",
            price: 4.99,
            description: "Warm cake with molten coconut center",
            category: "Cake",
            diet: ["Vegetarian"],
            calories: 420,
            allergies: ["Dairy", "Gluten", "Eggs"],
            ingredients: ["Coconut", "Flour", "Butter", "Eggs", "Sugar"]
        },
        {
            id: 6,
            name: "Cheese Cake",
            price: 4.99,
            description: "Creamy caramel custard with a buttery crust",
            category: "Cake",
            diet: ["Gluten-Free"],
            calories: 280,
            allergies: ["Dairy", "Eggs"],
            ingredients: ["Cream Cheese", "Caramel", "Eggs", "Sugar", "Butter", "Vanilla"]
        },

    ];

    return <MenuSection title="DESSERTS" items={dessertsItems} />;
};

export default Desserts;