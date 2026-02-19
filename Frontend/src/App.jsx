import { BrowserRouter, Routes, Route } from "react-router-dom";
import SelectRole from "./pages/SelectRole";
import CustomerLogin from "./pages/CustomerLogin";
import WaiterLogin from "./pages/WaiterLogin";
import Menu from "./pages/Menu";
import MenuSection from "./pages/MenuSection.jsx";
import WaiterDashboard from "./pages/WaiterDashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Select role page */}
                <Route path="/" element={<SelectRole />} />

                {/* Customer login page */}
                <Route path="/customer-login" element={<CustomerLogin />} />

                {/* Waiter login page */}
                <Route path="/waiter-login" element={<WaiterLogin />} />
                <Route path="/waiter-dashboard" element={<WaiterDashboard />} />

                {/* Other pages */}
                <Route path="/menu" element={<Menu />} />
                <Route path="/menu-section" element={<MenuSection />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;