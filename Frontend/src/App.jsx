import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CustomerLogin, WaiterLogin, KitchenLogin, Landing, StaffLanding, ManagerLogin } from "./pages/auth";
import { KitchenDashboard, WaiterDashboard, ManagerDashboard } from "./pages/staff";
import Menu from "./pages/menu/Menu";

/**
 * Main Application Component
 * 
 * @module App
 * @description Root component that sets up the application routing structure.
 * Provides navigation between landing pages, authentication pages, staff dashboards,
 * and the customer menu interface.
 * 
 * @component
 * @returns {JSX.Element} The application with configured routes
 * 
 * @example
 * // Usage in main.jsx:
 * import React from 'react';
 * import ReactDOM from 'react-dom/client';
 * import App from './App';
 * 
 * ReactDOM.createRoot(document.getElementById('root')).render(
 *   <React.StrictMode>
 *     <App />
 *   </React.StrictMode>
 * );
 * 
 * @example
 * // Route structure:
 * // - Landing pages: "/" (public landing), "/staff" (staff role selection)
 * // - Authentication: "/customer-login", "/waiter-login", "/kitchen-login", "/manager-login"
 * // - Staff dashboards: "/waiter-dashboard", "/kitchen-dashboard", "/manager-dashboard"
 * // - Customer menu: "/menu"
 */
function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* LANDING PAGES */}
                /**
                 * Public landing page route
                 * @route GET /
                 * @description Displays the main restaurant landing page
                 */
                <Route path="/" element={<Landing />} />

                /**
                 * Staff role selection landing page
                 * @route GET /staff
                 * @description Displays options for staff to choose their role (Waiter/Kitchen/Manager)
                 */
                <Route path="/staff" element={<StaffLanding />} />

                {/* AUTHORISATION PAGES */}
                /**
                 * Customer login page
                 * @route GET /customer-login
                 * @description Customer authentication page where customers enter table number
                 */
                <Route path="/customer-login" element={<CustomerLogin />} />

                /**
                 * Waiter login page
                 * @route GET /waiter-login
                 * @description Waiter authentication page with username/password validation
                 */
                <Route path="/waiter-login" element={<WaiterLogin />} />

                /**
                 * Kitchen staff login page
                 * @route GET /kitchen-login
                 * @description Kitchen staff authentication page with role validation
                 */
                <Route path="/kitchen-login" element={<KitchenLogin />} />

                /**
                 * Manager login page
                 * @route GET /manager-login
                 * @description Manager authentication page with elevated privileges
                 */
                <Route path="/manager-login" element={<ManagerLogin />} />

                {/* STAFF DASHBOARD PAGES */}
                /**
                 * Waiter dashboard route
                 * @route GET /waiter-dashboard
                 * @description Protected route for waiters to manage orders and tables
                 * @requires Authentication - Redirects to login if not authenticated
                 */
                <Route path="/waiter-dashboard" element={<WaiterDashboard />} />

                **
                 * Kitchen dashboard route
                 * @route GET /kitchen-dashboard
                 * @description Protected route for kitchen staff to manage food preparation
                 * @requires Authentication - Redirects to login if not authenticated
                 */
                <Route path="/kitchen-dashboard" element={<KitchenDashboard />} />

                /**
                 * Manager dashboard route
                 * @route GET /manager-dashboard
                 * @description Protected route for managers to oversee operations
                 * @requires Authentication - Redirects to login if not authenticated
                 */
                <Route path="/manager-dashboard" element={<ManagerDashboard />} />

                {/* MENU PAGE */}
                /**
                 * Customer menu page
                 * @route GET /menu
                 * @description Customer ordering interface with menu items, customization, and cart
                 * @requires Customer authentication via session storage (cust_id, table_id)
                 */
                <Route path="/menu" element={<Menu />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;