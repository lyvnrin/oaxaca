import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CustomerLogin, WaiterLogin, KitchenLogin, FirstLanding, SecondLanding } from "./pages/auth";
import Menu from "./pages/menu/Menu.jsx";
import { Starters, Mains, Desserts, Drinks } from "./pages/menu/sections";
import OrderSummary from "./pages/menu/OrderSummary.jsx";
import WaiterDashboard from "./pages/WaiterDashboard.jsx";
import KitchenDashboard from "./KitchenDashboard.jsx";

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

                {/* dashboard pages */}
                <Route path="/waiter-dashboard" element={<WaiterDashboard />} />
                <Route path="/kitchen-dashboard" element={<KitchenDashboard />} />

                {/* menu pages */}
                <Route path="/menu" element={<Menu />} />

                {/* STAFF DASHBOARD PAGES */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;