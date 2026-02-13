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

    ];

    return <MenuSection title="STARTERS" items={startersItems} />;
};

export default Starters;