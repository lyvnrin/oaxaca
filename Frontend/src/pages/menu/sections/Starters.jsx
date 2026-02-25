import React from 'react';
import MenuSection from '../MenuSection.jsx';

const Starters = () => {
    const startersItems = [
        {
            id: 1,
            name: "Esquites Fritters",
            price: 8.99,
            description: "Crispy corn fritters with Mexican street corn flavours, served with chipotle crema",
            category: "Fritters",
            diet: ["Vegetarian"],
            calories: 280,
            allergies: [],
            ingredients: ["Corn", "Flour", "Eggs", "Lime", "Chipotle Crema"]
        },
        {
            id: 2,
            name: "Chicken Flautas",
            price: 9.99,
            description: "Crispy rolled corn tortillas with shredded chicken, served with chipotle crema",
            category: "Flautas",
            diet: [],
            calories: 380,
            allergies: ["Gluten"],
            ingredients: ["Corn", "Chicken", "Tortillas", "Salsa", "Lime", "Chipotle Crema"]
        },
        {
            id: 3,
            name: "Mexican Street Corn",
            price: 7.99,
            description: "Grilled corn with mayo, cheese, chili powder & lime",
            category: "Sweet Corn",
            diet: ["Vegetarian"],
            calories: 220,
            allergies: ["Dairy"],
            ingredients: ["Corn", "Mayo", "Cheese", "Chili Powder", "Lime"]
        },
        {
            id: 4,
            name: "Chicken Empanadas",
            price: 10.99,
            description: "Three hand-held pastries filled with seasoned chicken, served with salsa verde",
            category: "Empanadas",
            diet: [],
            calories: 360,
            allergies: ["Dairy", "Gluten"],
            ingredients: ["Flour", "Chicken", "Onion", "Garlic", "Spices", "Salsa Verde", "Sour Cream"]
        },
        {
            id: 5,
            name: "Beef Empanadas",
            price: 11.99,
            description: "Three hand-held pastries filled with seasoned ground beef, potatoes, and olives",
            category: "Empanadas",
            diet: [],
            calories: 380,
            allergies: ["Dairy", "Gluten"],
            ingredients: ["Flour", "Ground Beef", "Potatoes", "Olives", "Onion", "Spices", "Salsa Roja"]
        },
        {
            id: 6,
            name: "Pork Empanadas",
            price: 11.99,
            description: "Three hand-held pastries filled with slow-cooked pork in adobo sauce",
            category: "Empanadas",
            diet: [],
            calories: 390,
            allergies: ["Dairy", "Gluten"],
            ingredients: ["Flour", "Pork", "Adobo Sauce", "Onion", "Garlic", "Spices", "Crema"]
        }

    ];

    return <MenuSection title="STARTERS" items={startersItems} category="starters" />;
};

export default Starters;