import { BrowserRouter, Routes, Route } from "react-router-dom";
import SelectRole from "./pages/SelectRole";
import CustomerLogin from "./pages/CustomerLogin";
import Menu from "./pages/Menu";
import MenuSection from "./pages/MenuSection.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                /* Select role page */
                <Route path="/" element={<SelectRole />} />

                /* Customer login page */
                <Route path="/customer-login" element={<CustomerLogin />} />

                /* Other pages */
                <Route path="/menu" element={<Menu />} />
                <Route path="/menu-section" element={<MenuSection />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;