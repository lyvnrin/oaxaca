import { useState, useEffect, useRef } from "react";

const C = {
    bg: "#f5f0e8", panel: "#faf7f2", dark: "#3b1f0e", mid: "#8b4513",
    warm: "#c4763a", light: "#e8d5b7", pale: "#f0e6d3",
    green: "#4a7c59", greenL: "#d4edda",
    red: "#c0392b", redL: "#fde8e6",
    amber: "#d4870e", amberL: "#fef3cd",
    blue: "#c4763a", blueL: "#f5e6d3",
    text: "#2c1810", muted: "#7a5c44", border: "#d4b896",
};

const MY_TABLES = [3, 7, 12];
const now = () => Date.now();

const ORDER_STATUSES = [
    "Pending Confirmation",
    "Confirmed",
    "In Progress",
    "Ready for Delivery",
    "Delivered",
];

const INIT_NOTIFICATIONS = [
    { id: 1, order: "1234", table: 12, status: "Ready For Service", type: "ready",   read: false },
    { id: 2, order: "1235", table: 7,  status: "Ready For Service", type: "ready",   read: false },
    { id: 3, order: "1236", table: 4,  status: "Needs Assistance",  type: "alert",   read: false },
    { id: 4, order: "1237", table: 9,  status: "Has Nut Allergy",   type: "allergy", read: false },
    { id: 5, order: "1238", table: 3,  status: "Ready For Service", type: "ready",   read: true  },
];

const INIT_MENU = [
    // ── Starters ──
    { id: 1,  section: "Starters", name: "Guacamole & Chips",     price: 7.00,  avail: true,  dietary: ["Vegan","Gluten-Free"],              allergens: [],                    calories: "350 kcal",               description: "Hand-mashed avocado, jalapeño, lime zest & Oaxacan pink salt." },
    { id: 2,  section: "Starters", name: "Tlayuda Tostada",       price: 9.00,  avail: true,  dietary: ["Gluten-Free"],                      allergens: ["Milk","Soy"],         calories: "500 kcal",               description: "Crispy corn base, black bean, quesillo, chorizo & fresh avocado." },
    { id: 3,  section: "Starters", name: "Ceviche Verde",         price: 12.00, avail: true,  dietary: ["Gluten-Free"],                      allergens: ["Fish"],               calories: "180 kcal",               description: "Sea bass, tomatillo, cucumber, coriander & tiger's milk." },
    { id: 4,  section: "Starters", name: "Elote Esquites",        price: 8.00,  avail: true,  dietary: ["Vegetarian","Gluten-Free"],         allergens: ["Milk"],               calories: "250 kcal",               description: "Charred corn, crema, cotija cheese, ancho chilli & epazote." },
    // ── Mains ──
    { id: 5,  section: "Mains",    name: "Mole Negro Chicken",    price: 18.00, avail: true,  dietary: [],                                   allergens: ["Soy","Nuts"],         calories: "600 kcal",               description: "Free-range thigh braised in a 30-ingredient black mole, sesame rice." },
    { id: 6,  section: "Mains",    name: "Barbacoa Tacos",        price: 16.00, avail: true,  dietary: [],                                   allergens: [],                    calories: "300 kcal (per taco)",    description: "Slow-braised beef cheek, white onion, coriander & salsa roja. Three pieces." },
    { id: 7,  section: "Mains",    name: "Portobello Enchiladas", price: 14.00, avail: true,  dietary: ["Vegan"],                            allergens: [],                    calories: "400 kcal",               description: "Roasted mushrooms, black bean, chipotle sauce & cashew crema." },
    { id: 8,  section: "Mains",    name: "Snapper Veracruz",      price: 22.00, avail: true,  dietary: ["Gluten-Free"],                      allergens: ["Fish"],               calories: "450 kcal",               description: "Pan-seared whole snapper, olives, capers & fresh tomato broth." },
    // ── Dessert ──
    { id: 9,  section: "Dessert",  name: "Churro Sundae",         price: 8.00,  avail: true,  dietary: ["Vegetarian"],                       allergens: ["Milk","Gluten","Eggs"],calories: "550 kcal",              description: "Crispy churros, vanilla bean ice cream & dark chocolate mole sauce." },
    { id: 10, section: "Dessert",  name: "Mezcal Flan",           price: 7.00,  avail: true,  dietary: ["Vegetarian","Gluten-Free"],         allergens: ["Milk","Eggs"],        calories: "320 kcal",               description: "Silky caramel custard with a smoky mezcal caramel drizzle." },
    { id: 11, section: "Dessert",  name: "Mango Sorbet",          price: 6.00,  avail: true,  dietary: ["Vegan","Gluten-Free"],              allergens: [],                    calories: "120 kcal",               description: "Alphonso mango, chilli salt & fresh lime. Completely dairy free." },
    // ── Sides ──
    { id: 12, section: "Sides",    name: "Black Bean Pot",        price: 4.00,  avail: true,  dietary: ["Vegan","Gluten-Free"],              allergens: [],                    calories: "200 kcal",               description: "Slow-cooked with avocado leaf, epazote & lime crema." },
    { id: 13, section: "Sides",    name: "Corn Tortillas",        price: 3.00,  avail: true,  dietary: ["Vegan","Gluten-Free"],              allergens: [],                    calories: "60 kcal (per tortilla)", description: "Fresh nixtamal masa, made in-house daily. Four pieces." },
    { id: 14, section: "Sides",    name: "Pickled Jalapeños",     price: 3.00,  avail: true,  dietary: ["Vegan","Gluten-Free"],              allergens: [],                    calories: "5 kcal (per tbsp)",      description: "House-pickled chillies, carrots & white onion in apple cider vinegar." },
    { id: 15, section: "Sides",    name: "Mexican Rice",          price: 4.00,  avail: true,  dietary: ["Vegan","Gluten-Free"],              allergens: [],                    calories: "200 kcal",               description: "Tomato-braised rice with cumin, garlic & fresh coriander." },
    // ── Drinks ──
    { id: 16, section: "Drinks",   name: "Hibiscus Agua Fresca",  price: 4.00,  avail: true,  dietary: ["Vegan","Gluten-Free"],              allergens: [],                    calories: "70 kcal (per cup)",      description: "House-dried hibiscus, lime, cane sugar & still water." },
    { id: 17, section: "Drinks",   name: "Mezcal Margarita",      price: 11.00, avail: true,  dietary: ["Vegan","Gluten-Free"],              allergens: [],                    calories: "250 kcal",               description: "Joven mezcal, fresh lime juice, agave syrup & smoked salt rim." },
    { id: 18, section: "Drinks",   name: "Horchata",              price: 4.50,  avail: true,  dietary: ["Vegan","Gluten-Free"],              allergens: ["Nuts"],               calories: "150 kcal (per cup)",     description: "Rice milk, cinnamon, vanilla & a hint of almond. Served chilled." },
    { id: 19, section: "Drinks",   name: "Mexican Lager",         price: 5.00,  avail: true,  dietary: [],                                   allergens: [],                    calories: "150 kcal (per 12 oz)",   description: "Ice-cold bottle served with lime. Ask your server for today's selection." },
    { id: 20, section: "Drinks",   name: "Water",                 price: 2.50,  avail: true,  dietary: [],                                   allergens: [],                    calories: "0 kcal",                 description: "Ice-cold and refreshing. Ask your server for alternative temperatures." },
];

const INIT_ORDERS = [
    { id: "1234", table: 12, status: "Confirmed",            startedAt: now() - 8*60000,  items: [{ menuId: 6,  name: "Barbacoa Tacos",       qty: 2, price: 16.00 }, { menuId: 4,  name: "Elote Esquites",    qty: 1, price: 8.00  }] },
    { id: "1235", table: 7,  status: "Pending Confirmation", startedAt: now() - 3*60000,  items: [{ menuId: 5,  name: "Mole Negro Chicken",   qty: 1, price: 18.00 }, { menuId: 18, name: "Horchata",          qty: 2, price: 4.50  }] },
    { id: "1238", table: 3,  status: "In Progress",          startedAt: now() - 14*60000, items: [{ menuId: 7,  name: "Portobello Enchiladas",qty: 2, price: 14.00 }, { menuId: 9,  name: "Churro Sundae",     qty: 1, price: 8.00  }] },
    { id: "1240", table: 5,  status: "Ready for Delivery",   startedAt: now() - 20*60000, items: [{ menuId: 8,  name: "Snapper Veracruz",     qty: 1, price: 22.00 }, { menuId: 17, name: "Mezcal Margarita",  qty: 2, price: 11.00 }] },
];

const INIT_UNPAID = [
    { table: 2,  order: "1230", total: 34.50, waiting: "12 mins" },
    { table: 6,  order: "1231", total: 22.00, waiting: "5 mins"  },
    { table: 11, order: "1232", total: 67.00, waiting: "28 mins" },
];

const notifColor  = { ready: C.green, alert: C.blue, allergy: C.amber };
const statusColor = {
    "Pending Confirmation": C.amber,
    "Confirmed":            C.blue,
    "In Progress":          C.warm,
    "Ready for Delivery":   C.green,
    "Delivered":            C.mid,
};

function useOutsideClick(ref, cb) {
    useEffect(() => {
        const fn = e => { if (ref.current && !ref.current.contains(e.target)) cb(); };
        document.addEventListener("mousedown", fn);
        return () => document.removeEventListener("mousedown", fn);
    }, [ref, cb]);
}

function useElapsed(startedAt) {
    const [, tick] = useState(0);
    useEffect(() => { const t = setInterval(() => tick(n => n + 1), 30000); return () => clearInterval(t); }, []);
    const mins = Math.floor((Date.now() - startedAt) / 60000);
    if (mins < 1)  return "< 1 min";
    if (mins < 60) return `${mins} min${mins !== 1 ? "s" : ""}`;
    const h = Math.floor(mins / 60), m = mins % 60;
    return `${h}h ${m}m`;
}

function elapsedColor(startedAt) {
    const mins = Math.floor((Date.now() - startedAt) / 60000);
    return mins > 20 ? C.red : mins > 10 ? C.amber : C.green;
}

const IconAlert = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const IconBell  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const IconClock = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconDoor  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
