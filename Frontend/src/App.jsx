import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CustomerLogin, WaiterLogin, KitchenLogin, Landing, StaffLanding } from "./pages/auth";
import { KitchenDashboard, WaiterDashboard, ManagerDashboard } from "./pages/staff";
import Menu from "./pages/menu/Menu.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/staff" element={<StaffLanding />} />

                <Route path="/customer-login" element={<CustomerLogin />} />
                <Route path="/waiter-login" element={<WaiterLogin />} />
                <Route path="/kitchen-login" element={<KitchenLogin />} />

                <Route path="/waiter-dashboard" element={<WaiterDashboard />} />
                <Route path="/kitchen-dashboard" element={<KitchenDashboard />} />
                <Route path="/manager-dashboard" element={<ManagerDashboard />} />

                <Route path="/menu" element={<Menu />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;