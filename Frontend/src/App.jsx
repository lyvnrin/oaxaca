import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CustomerLogin, WaiterLogin, KitchenLogin, FirstLanding, SecondLanding } from "./pages/auth";
import Menu from "./pages/menu/Menu.jsx";
import { Starters, Mains, Desserts, Drinks } from "./pages/menu/sections";
import OrderSummary from "./pages/menu/OrderSummary.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* landing pages */}
                <Route path="/" element={<FirstLanding />} />
                <Route path="/staff" element={<SecondLanding />} />

                {/* login pages */}
                <Route path="/customer-login" element={<CustomerLogin />} />
                <Route path="/waiter-login" element={<WaiterLogin />} />
                <Route path="/kitchen-login" element={<KitchenLogin />} />

                {/* menu pages */}
                <Route path="/menu" element={<Menu />} />
                <Route path="/menu-starters" element={<Starters />} />
                <Route path="/menu-mains" element={<Mains />} />
                <Route path="/menu-desserts" element={<Desserts />} />
                <Route path="/menu-drinks" element={<Drinks />} />

                <Route path="/order-summary" element={<OrderSummary />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;