import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CustomerLogin, WaiterLogin, KitchenLogin } from "./pages/auth";
import FirstLanding from "./pages/auth/FirstLanding";
import Menu from "./pages/menu/Menu";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* LANDING PAGES */}
                <Route path="/" element={<FirstLanding />} />

                {/* AUTHORISATION PAGES */}
                <Route path="/customer-login" element={<CustomerLogin />} />
                <Route path="/waiter-login" element={<WaiterLogin />} />
                <Route path="/kitchen-login" element={<KitchenLogin />} />

                {/* MENU PAGE */}
                <Route path="/menu" element={<Menu />} />

                {/* STAFF DASHBOARD PAGES */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;