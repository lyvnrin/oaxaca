// all static content & helpers

export const GRADIENTS = [
  "linear-gradient(135deg, #C8651A 0%, #8C3A0A 100%)",
  "linear-gradient(135deg, #7A4A28 0%, #4E2D10 100%)",
  "linear-gradient(135deg, #B85C3A 0%, #7A3018 100%)",
  "linear-gradient(135deg, #D4824A 0%, #954C1C 100%)",
  "linear-gradient(135deg, #6B8C5A 0%, #3E5830 100%)",
];

export const ALL_ALLERGENS = [
  "Fish", "Soy", "Milk", "Gluten", "Eggs", "Nuts", "Shellfish", "Sesame",
];

export const SECTIONS = [
  {
    name: "Starters",
    items: [
      { id: 1,  name: "Guacamole & Chips", desc: "Hand-mashed avocado, jalapeño, lime zest & Oaxacan pink salt.", price: "£7",  tags: ["Vegan", "Gluten-Free"],       allergens: []               },
      { id: 2,  name: "Tlayuda Tostada", desc: "Crispy corn base, black bean, quesillo, chorizo & fresh avocado.", price: "£9",  tags: ["Gluten-Free"],                allergens: ["Milk", "Soy"]  },
      { id: 3,  name: "Ceviche Verde", desc: "Sea bass, tomatillo, cucumber, coriander & tiger's milk.", price: "£12", tags: ["Gluten-Free"],                allergens: ["Fish"]         },
      { id: 4,  name: "Elote Esquites", desc: "Charred corn, crema, cotija cheese, ancho chilli & epazote.",  price: "£8",  tags: ["Vegetarian", "Gluten-Free"],  allergens: ["Milk"]         },
    ],
  },
  {
    name: "Mains",
    items: [
      { id: 5,  name: "Mole Negro Chicken",    desc: "Free-range thigh braised in a 30-ingredient black mole, sesame rice.",        price: "£18", tags: [],                             allergens: ["Soy", "Nuts"]  },
      { id: 6,  name: "Barbacoa Tacos",        desc: "Slow-braised beef cheek, white onion, coriander & salsa roja. Three pieces.", price: "£16", tags: [],                             allergens: []               },
      { id: 7,  name: "Portobello Enchiladas", desc: "Roasted mushrooms, black bean, chipotle sauce & cashew crema.",               price: "£14", tags: ["Vegan"],                      allergens: ["Nuts"]         },
      { id: 8,  name: "Snapper Veracruz",      desc: "Pan-seared whole snapper, olives, capers & fresh tomato broth.",              price: "£22", tags: ["Gluten-Free"],                allergens: ["Fish"]         },
    ],
  },
  {
    name: "Desserts",
    items: [
      { id: 9,  name: "Churro Sundae",         desc: "Crispy churros, vanilla bean ice cream & dark chocolate mole sauce.",         price: "£8",  tags: ["Vegetarian"],                 allergens: ["Milk", "Gluten", "Eggs"] },
      { id: 10, name: "Mezcal Flan",           desc: "Silky caramel custard with a smoky mezcal caramel drizzle.",                  price: "£7",  tags: ["Vegetarian", "Gluten-Free"],  allergens: ["Milk", "Eggs"] },
      { id: 11, name: "Mango Sorbet",          desc: "Alphonso mango, chilli salt & fresh lime. Completely dairy free.",            price: "£6",  tags: ["Vegan", "Gluten-Free"],       allergens: []               },
    ],
  },
  {
    name: "Sides",
    items: [
      { id: 12, name: "Black Bean Pot",        desc: "Slow-cooked with avocado leaf, epazote & lime crema.",                       price: "£4",  tags: ["Vegan", "Gluten-Free"],       allergens: []               },
      { id: 13, name: "Corn Tortillas",        desc: "Fresh nixtamal masa, made in-house daily. Four pieces.",                     price: "£3",  tags: ["Vegan", "Gluten-Free"],       allergens: []               },
      { id: 14, name: "Pickled Jalapeños",     desc: "House-pickled chillies, carrots & white onion in apple cider vinegar.",      price: "£3",  tags: ["Vegan", "Gluten-Free"],       allergens: []               },
      { id: 15, name: "Mexican Rice",          desc: "Tomato-braised rice with cumin, garlic & fresh coriander.",                  price: "£4",  tags: ["Vegan", "Gluten-Free"],       allergens: []               },
    ],
  },
  {
    name: "Drinks",
    items: [
      { id: 16, name: "Hibiscus Agua Fresca",  desc: "House-dried hibiscus, lime, cane sugar & still water.",                      price: "£4",   tags: ["Vegan", "Gluten-Free"],      allergens: []               },
      { id: 17, name: "Mezcal Margarita",      desc: "Joven mezcal, fresh lime juice, agave syrup & smoked salt rim.",             price: "£11",  tags: ["Vegan", "Gluten-Free"],      allergens: []               },
      { id: 18, name: "Horchata",              desc: "Rice milk, cinnamon, vanilla & a hint of almond. Served chilled.",           price: "£4.5", tags: ["Vegan", "Gluten-Free"],      allergens: ["Nuts"]         },
      { id: 19, name: "Mexican Lager",         desc: "Ice-cold bottle served with lime. Ask your server for today's selection.",   price: "£5",   tags: [],                            allergens: ["Gluten"]       },
    ],
  },
];

export const TAG_CLASSES = {
  Vegetarian:    "oax-tag oax-tag-v",
  "Gluten-Free": "oax-tag oax-tag-gf",
  Vegan:         "oax-tag oax-tag-vg",
};

// Returns true if an item should be visible given the active filters 
export function itemPasses(item, activeFilters, excludeAllergens) {
  if (activeFilters.length > 0 && !activeFilters.every(f => item.tags.includes(f))) return false;
  if (excludeAllergens.length > 0 && item.allergens.some(a => excludeAllergens.includes(a))) return false;
  return true;
}