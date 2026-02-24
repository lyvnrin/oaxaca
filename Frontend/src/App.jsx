import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SelectRole, CustomerLogin, WaiterLogin } from "./pages/auth";
import Menu from "./pages/menu/Menu.jsx";
import { Starters, Mains, Desserts, Drinks } from "./pages/menu/sections";
import OrderSummary from "./pages/menu/OrderSummary.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* authorisation pages */}
                <Route path="/" element={<SelectRole />} />
                <Route path="/customer-login" element={<CustomerLogin />}  />
                <Route path="/staff-login" element={<WaiterLogin />}  />

                {/* menu pages*/}
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