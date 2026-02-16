import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerLogin from "./pages/CustomerLogin";
import Menu from "./pages/Menu";
import Starters from "./pages/Starters.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<CustomerLogin />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/starters" element={<Starters/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;