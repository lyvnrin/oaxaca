import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SelectRole, CustomerLogin, WaiterLogin, KitchenLogin } from "./pages/auth";
// import Menu from "./pages/menu/Menu.jsx";
//import { Starters, Mains, Desserts, Drinks } from "./pages/menu/sections";
//import OrderSummary from "./pages/menu/OrderSummary.jsx";

import FirstLanding from "./pages/auth/FirstLanding";
//import Menu from "./pages/menu/Menu";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* authorisation pages */}
                <Route path="/" element={<FirstLanding />} />
                <Route path="/customer-login" element={<CustomerLogin />} />
                <Route path="/waiter-login" element={<WaiterLogin />} />
                <Route path="/kitchen-login" element={<KitchenLogin />} />

                {/* <Route path="/menu" element={<Menu />} /> */}

                {/* menu pages
                
                <Route path="/menu-starters" element={<Starters />} />
                <Route path="/menu-mains" element={<Mains />} />
                <Route path="/menu-desserts" element={<Desserts />} />
                <Route path="/menu-drinks" element={<Drinks />} /> */}

                {/* <Route path="/order-summary" element={<OrderSummary />} /> */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;