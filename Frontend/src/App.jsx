import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CustomerLogin, WaiterLogin, KitchenLogin, Landing, StaffLanding, ManagerLogin } from "./pages/auth";
import { KitchenDashboard, WaiterDashboard, ManagerDashboard } from "./pages/staff";
import Menu from "./pages/menu/Menu";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* LANDING PAGES */}
                <Route path="/" element={<Landing />} />
                <Route path="/staff" element={<StaffLanding />} />

                {/* AUTHORISATION PAGES */}
                <Route path="/customer-login" element={<CustomerLogin />} />
                <Route path="/waiter-login" element={<WaiterLogin />} />
                <Route path="/kitchen-login" element={<KitchenLogin />} />
                <Route path="/manager-login" element={<ManagerLogin />} />

                {/* STAFF DASHBOARD PAGES */}
                <Route path="/waiter-dashboard" element={<WaiterDashboard />} />
                <Route path="/kitchen-dashboard" element={<KitchenDashboard />} />
                <Route path="/manager-dashboard" element={<ManagerDashboard />} />

                {/* MENU PAGE */}
                <Route path="/menu" element={<Menu />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;