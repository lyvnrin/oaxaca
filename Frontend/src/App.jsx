import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerLogin from "./pages/CustomerLogin";
import Menu from "./pages/Menu";
import MenuItems from "./pages/MenuItems.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<CustomerLogin />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/menuitems" element={<MenuItems />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;