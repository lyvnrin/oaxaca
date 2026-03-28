// MENU ITEM IMAGES --------------------------
import { guacamole, tlayuda, ceviche, elote,
         barbacoa, moleNegro, portobello, snapper,
         churro, sorbet, mezcal,
         corn, rice, jalapenos, bean,
         hibiscus, horchata, lager, margarita, water } from "../../assets/index.js";

// MENU ITEMS --------------------------
export const MENU_DATA = {

    // STARTERS --------------------------
    Starters: [
        {
            id: 1,
            name: "Guacamole & Chips",
            image: guacamole,
            description: "Hand-mashed avocado, jalapeño, lime zest & Oaxacan pink salt.",
            price: "£7.00",
            dietary: ["Vegan", "Gluten-Free"],
            allergens: [],
            calories: "350 kcal",
        },
        {
            id: 2,
            name: "Tlayuda Tostada",
            image: tlayuda,
            description: "Crispy corn base, black bean, quesillo, chorizo & fresh avocado.",
            price: "£9.00",
            dietary: ["Gluten-Free"],
            allergens: ["Milk", "Soy"],
            calories: "500 kcal",
        },
        {
            id: 3,
            name: "Ceviche Verde",
            image: ceviche,
            description: "Sea bass, tomatillo, cucumber, coriander & tiger's milk.",
            price: "£12.00",
            dietary: ["Gluten-Free"],
            allergens: ["Fish"],
            calories: "180 kcal",
        },
        {
            id: 4,
            name: "Elote Esquites",
            image: elote,
            description: "Charred corn, crema, cotija cheese, ancho chilli & epazote.",
            price: "£8.00",
            dietary: ["Vegetarian", "Gluten-Free"],
            allergens: ["Milk"],
            calories: "250 kcal",
        },
    ],
    
    // MAINS --------------------------
    Mains: [
        {
            id: 5,
            name: "Mole Negro Chicken",
            image: moleNegro,
            description: "Free-range thigh braised in a 30-ingredient black mole, sesame rice.",
            price: "£18.00",
            dietary: [],
            allergens: ["Soy", "Nuts"],
            calories: "600 kcal",
        },
        {
            id: 6,
            name: "Barbacoa Tacos",
            image: barbacoa,
            description: "Slow-braised beef cheek, white onion, coriander & salsa roja. Three pieces.",
            price: "£16.00",
            dietary: [],
            allergens: [],
            calories: "300 kcal (per taco)",
        },
        {
            id: 7,
            name: "Portobello Enchiladas",
            image: portobello,
            description: "Roasted mushrooms, black bean, chipotle sauce & cashew crema.",
            price: "£14.00",
            dietary: ["Vegan"],
            allergens: [],
            calories: "400 kcal",
            imageStyle: {
               objectPosition: "center 20%",
            }
        },
        {
            id: 8,
            name: "Snapper Veracruz",
            image: snapper,
            description: "Pan-seared whole snapper, olives, capers & fresh tomato broth.",
            price: "£22.00",
            dietary: ["Gluten-Free"],
            allergens: ["Fish"],
            calories: "450 kcal",
        },
    ],

    // DESSERT --------------------------
    Dessert: [
        {
            id: 9,
            name: "Churro Sundae",
            image: churro,
            description: "Crispy churros, vanilla bean ice cream & dark chocolate mole sauce.",
            price: "£8.00",
            dietary: ["Vegetarian"],
            allergens: ["Milk", "Gluten", "Eggs"],
            calories: "550 kcal",
        },
        {
            id: 10,
            name: "Mezcal Flan",
            image: mezcal,
            description: "Silky caramel custard with a smoky mezcal caramel drizzle.",
            price: "£7.00",
            dietary: ["Vegetarian", "Gluten-Free"],
            allergens: ["Milk", "Eggs"],
            calories: "320 kcal",
        },
        {
            id: 11,
            name: "Mango Sorbet",
            image: sorbet,
            description: "Alphonso mango, chilli salt & fresh lime. Completely dairy free.",
            price: "£6.00",
            dietary: ["Vegan", "Gluten-Free"],
            allergens: [],
            calories: "120 kcal",
            imageStyle: {
               objectPosition: "center 20%",
            }
        },
    ],

    // SIDES --------------------------
    Sides: [
        {
            id: 12,
            name: "Black Bean Pot",
            image: bean,
            description: "Slow-cooked with avocado leaf, epazote & lime crema.",
            price: "£4.00",
            dietary: ["Vegan", "Gluten-Free"],
            allergens: [],
            calories: "200 kcal",
        },
        {
            id: 13,
            name: "Corn Tortillas",
            image: corn,
            description: "Fresh nixtamal masa, made in-house daily. Four pieces.",
            price: "£3.00",
            dietary: ["Vegan", "Gluten-Free"],
            allergens: [],
            calories: "60 kcal (per tortilla)",
        },
        {
            id: 14,
            name: "Pickled Jalapeños",
            image: jalapenos,
            description: "House-pickled chillies, carrots & white onion in apple cider vinegar.",
            price: "£3.00",
            dietary: ["Vegan", "Gluten-Free"],
            allergens: [],
            calories: "5 kcal (per tbsp)",
            imageStyle: {
               objectPosition: "center 40%",
            }
        },
        {
            id: 15,
            name: "Mexican Rice",
            image: rice,
            description: "Tomato-braised rice with cumin, garlic & fresh coriander.",
            price: "£4.00",
            dietary: ["Vegan", "Gluten-Free"],
            allergens: [],
            calories: "200 kcal",
            imageStyle: {
               objectPosition: "center 20%",
            }
        },
    ],

    // DRINKS --------------------------
    Drinks: [
        {
            id: 16,
            name: "Hibiscus Agua Fresca",
            image: hibiscus,
            description: "House-dried hibiscus, lime, cane sugar & still water.",
            price: "£4.00",
            dietary: ["Vegan", "Gluten-Free"],
            allergens: [],
            calories: "70 kcal (per cup)",
        },
        {
            id: 17,
            name: "Mezcal Margarita",
            image: margarita,
            description: "Joven mezcal, fresh lime juice, agave syrup & smoked salt rim.",
            price: "£11.00",
            dietary: ["Vegan", "Gluten-Free"],
            allergens: [],
            calories: "250 kcal",
            imageStyle: {
               objectPosition: "center 20%",
            }
        },
        {
            id: 18,
            name: "Horchata",
            image: horchata,
            description: "Rice milk, cinnamon, vanilla & a hint of almond. Served chilled.",
            price: "£4.50",
            dietary: ["Vegan", "Gluten-Free"],
            allergens: ["Nuts"],
            calories: "150 kcal (per cup)",
            imageStyle: {
               objectPosition: "center 25%",
            }
        },
        {
            id: 19,
            name: "Mexican Lager",
            image: lager,
            description: "Ice-cold bottle served with lime. Ask your server for today's selection.",
            price: "£5.00",
            dietary: [],
            allergens: [],
            calories: "150 kcal (per 12 oz bottle)",
            imageStyle: {
               objectPosition: "center 35%",
               scale: 1,
            }
        },
        {
            id: 20,
            name: "Water",
            image: water,
            description: "Ice-cold and refreshing. Ask your server for alternative temperatures.",
            price: "£2.50",
            dietary: [],
            allergens: [],
            calories: "0 kcal",
            imageStyle: {
               objectPosition: "center 38%",
               scale: 1,
            }

        },
    ],
};

// MENU ITEM : INGREDIENTS --------------------------
export const INGREDIENTS = {
    // STARTERS --------------------------
    "1": ["Lime", "Avocado"], // Guacamole & Chips
    "2": ["Parsley", "Carrot"], // Tlayuda Tostada
    "3": ["Cucumber", "Coriander"], // Ceviche Verde
    "4": ["Cotija Cheese", "Ancho Chilli"], // Elote Esquites

    // MAINS --------------------------
    "5": ["Mole Sauce", "Nuts"], // Mole Negro Chicken
    "6": ["White Onion", "Coriander"], // Barbacoa Tacos
    "7": ["Black Bean", "Chipotle Sauce"], // Portobello Enchiladas
    "8": ["Olives", "Capers"], // Snapper Veracruz

    // DESSERTS --------------------------
    "9": ["Churros", "Chocolate Mole Sauce"], // Churro Sundae
    "10": ["Caramel Custard", "Mezcal Caramel"], // Mezcal Flan
    "11": ["Chilli Salt", "Lime"], // Mango Sorbet

    // SIDES --------------------------
    "12": ["Epazote", "Lime Crema"], // Black Bean Pot
    "13": ["Nixtamal Masa", "Corn"], // Corn Tortillas
    "14": ["Carrots", "White Onion"], // Pickled Jalapeños
    "15": ["Garlic", "Coriander"], // Mexican Rice

    // DRINKS --------------------------
    "16": ["Cane Sugar", "Lime"], // Hibiscus Agua Fresca
    "17": ["Agave Syrup", "Smoked Salt"], // Mezcal Margarita
    "18": ["Vanilla", "Almond"], // Horchata
    "19": ["Lager Beer", "Lime"], // Mexican Lager
    "20": ["Water"] // Water
};

// MENU ITEM MAPPING --------------------------
export const EXTRAS_BY_ID = {

    // STARTERS --------------------------
    "1": [ // Guacamole & Chips
        {name: "Extra Avocado", price: 1.50},
        {name: "Extra Tortilla Chips", price: 1.00},
    ],

    "2": [ // Tlayuda Tostada
        {name: "Extra Quesillo Cheese", price: 1.50},
        {name: "Extra Black Beans", price: 0.75},
    ],

    "3": [ // Ceviche Verde
        {name: "Extra Sea Bass", price: 3.00},
        {name: "Extra Tomatillo", price: 0.75},
    ],

    "4": [ // Elote Esquites
        {name: "Extra Cotija Cheese", price: 1.00},
        {name: "Extra Ancho Chilli", price: 0.25},
    ],

    // MAINS --------------------------
    "5": [ // Mole Negro Chicken
        {name: "Extra Chicken Thigh", price: 3.00},
        {name: "Extra Sesame Rice", price: 1.50}, 
    ],

    "6": [ // Barbacoa Tacos
        {name: "Extra Beef Cheek", price: 2.50},
        {name: "Extra Taco (1 piece)", price: 3.50},
    ],

    "7": [ // Portobello Enchiladas
        {name: "Extra Portobello", price: 2.00},
        {name: "Extra Enchilada", price: 3.00},
    ],

    "8": [ // Snapper Veracruz
        {name: "Extra Snapper Fillet", price: 5.00},
        {name: "Extra Tomato Broth", price: 1.00},
    ],

    // DESSERTS --------------------------
    "9": [ // Churro Sundae
        {name: "Extra Ice Cream", price: 1.50},
        {name: "Extra Chocolate Mole Sauce", price: 0.75},
    ],

    "10": [ // Mezcal Flan
        {name: "Extra Flan", price: 2.50},
        {name: "Extra Mezcal Caramel", price: 0.75},
    ],

    "11": [ // Mango Sorbet
        {name: "Extra Scoop", price: 1.50},
        {name: "Extra Lime", price: 0.25},
    ],

    // SIDES --------------------------
    "12": [ // Black Bean Pot
        {name: "Extra Black Beans", price: 1.00},
        {name: "Extra Lime Crema", price: 0.75},
    ],

    "13": [ // Corn Tortillas
        {name: "Extra Tortilla (1 pc)", price: 0.50},
        {name: "Extra Tortillas (4 pcs)", price: 1.50},
    ],

    "14": [ // Pickled Jalapeños
        {name: "Extra Serving", price: 1.00},
        {name: "Extra Fresh Jalapeños", price: 0.50},
    ],

    "15": [ // Mexican Rice
        {name: "Extra Rice", price: 1.50},
        {name: "Add Black Beans", price: 1.00},
    ],

    // DRINKS --------------------------
    "16": [ // Hibiscus Agua Fresca
        {name: "Extra Large Size", price: 1.50},
        {name: "Add Sparkling Water", price: 0.50},
    ],

    "17": [ // Mezcal Margarita
        {name: "Extra Shot Mezcal", price: 3.00},
        {name: "Extra Large Size", price: 2.00},
    ],

    "18": [ // Horchata
        {name: "Add Coffee Shot", price: 1.00},
        {name: "Add Rum Shot", price: 3.00},
    ],

    "19": [ // Mexican Lager
        {name: "Extra Lime Wedge", price: 0.25},
        {name: "Add Tajín Rim", price: 0.50},
    ],

    "20": [ // Water
        {name: "Add Lemon", price: 0.25},
        {name: "Add Ice", price: 0.00},
    ]
};