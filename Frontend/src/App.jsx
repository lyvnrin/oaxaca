import { BrowserRouter, Routes, Route } from "react-router-dom";
import SelectRole from "./pages/auth/SelectRole.jsx";
import CustomerLogin from "./pages/auth/CustomerLogin.jsx";
import Menu from "./pages/menu/Menu.jsx";
import { Starters, Mains, Desserts, Drinks } from "./pages/menu/sections";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* authorisation pages */}
                <Route path="/" element={<SelectRole />} />
                <Route path="/customer-login" element={<CustomerLogin />}  />

                {/* menu pages*/}
                <Route path="/menu" element={<Menu />} />
                <Route path="/menu-starters" element={<Starters />} />
                <Route path="/menu-mains" element={<Mains />} />
                <Route path="/menu-desserts" element={<Desserts />} />
                <Route path="/menu-drinks" element={<Drinks />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;