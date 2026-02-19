import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerLogin from "./pages/auth/CustomerLogin.jsx";
import Menu from "./pages/menu/Menu.jsx";
// import MenuItems from "./pages/MenuItems.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<CustomerLogin />} />
                <Route path="/menu" element={<Menu />} />
                {/*<Route path="/menuitems" element={<MenuItems />} />*/}
            </Routes>
        </BrowserRouter>
    );
}

export default App;