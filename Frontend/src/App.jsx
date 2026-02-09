import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerLogin from "./pages/CustomerLogin";
import Menu from "./pages/Menu";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<CustomerLogin />} />
                <Route path="/menu" element={<Menu />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;