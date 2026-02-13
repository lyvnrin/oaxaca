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

    ];

    return <MenuSection title="MAINS" items={mainsItems} />;
};

export default Mains;