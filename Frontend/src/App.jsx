import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CustomerLogin, WaiterLogin, KitchenLogin, Landing, StaffLanding } from "./pages/auth";
import { KitchenDashboard, WaiterDashboard } from "./pages/staff";
import Menu from "./pages/menu/Menu.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* LANDING PAGES */}
                <Route path="/" element={<Landing />} />
                <Route path="/staff" element={<StaffLanding />} />

                {/* LOGIN PAGES */}
                <Route path="/customer-login" element={<CustomerLogin />} />
                <Route path="/waiter-login" element={<WaiterLogin />} />
                <Route path="/kitchen-login" element={<KitchenLogin />} />

                {/* STAFF DASHBOARD PAGES */}
                <Route path="/waiter-dashboard" element={<WaiterDashboard />} />
                <Route path="/kitchen-dashboard" element={<KitchenDashboard />} />

                {/* MENU PAGE */}
                <Route path="/menu" element={<Menu />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;