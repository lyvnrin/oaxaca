import { useState } from "react";
import "./Menu.css";
import { MENU_DATA } from "./menuData.js";

// Menu data
const ALLERGEN_OPTIONS = ["Fish", "Soy", "Milk", "Nuts", "Eggs", "Wheat", "Sesame", "Shellfish"];
const DIET_FILTERS = ["Vegetarian", "Gluten-Free", "Vegan"];

// NAVBAR : icons actions - contact waiter, settings button
function TopActions() {
  return (
    <div className="top-actions">
      <button className="action-btn">Contact Waiter</button>
      <button className="action-btn">Settings</button>
    </div>
  );
}

// NAVBAR : cartIcon
function CartIcon() {
  return (
    <div className="cart-icon" title="View cart">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    </div>
  );
}

// NAVBAR : Header components - restaurant title, table number
function Header({ tableNumber }) {
  return (
    <header className="header">
      <span className="table-number">{tableNumber}</span>
      <h1 className="restaurant-title">OAXACA</h1>
      <div className="header-right">
        <CartIcon />
        <button className="hamburger" aria-label="Open navigation menu">
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
        </button>
      </div>
    </header>
  );
}
