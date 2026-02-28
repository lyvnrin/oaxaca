import { useState } from "react";
import "./Menu.css";
import { MENU_DATA } from "./menuData.js";

// MENU DATA : tags
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

// FILTERS : Allergens dropdown
function AllergenDropdown({ selected, onChange }) {
  const [open, setOpen] = useState(false);

  function handleToggle(allergen) {
    if (selected.includes(allergen)) {
      onChange(selected.filter((a) => a !== allergen));
    } else {
      onChange([...selected, allergen]);
    }
  }

  return (
    <div className="allergen-wrapper">
      <button
        className={`allergen-toggle ${selected.length > 0 ? "allergen-toggle--active" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span>Does Not Contain</span>
        {selected.length > 0 && <span className="allergen-count">{selected.length}</span>}
        <span className="dropdown-arrow">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="allergen-list">
          {ALLERGEN_OPTIONS.map((allergen) => (
            <label key={allergen} className="allergen-option">
              <input
                type="checkbox"
                checked={selected.includes(allergen)}
                onChange={() => handleToggle(allergen)}
              />
              {allergen}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// FILTERS : dietary filter buttons
function FilterBar({ activeFilters, onFilterToggle, excludedAllergens, onAllergenChange }) {
  return (
    <div className="filter-bar">
      <div className="filter-row">
        <span className="filter-label">Show me</span>
        <div className="filter-buttons">
          {DIET_FILTERS.map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${activeFilters.includes(filter) ? "filter-btn--active" : ""}`}
              onClick={() => onFilterToggle(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-row allergen-row">
        <AllergenDropdown selected={excludedAllergens} onChange={onAllergenChange} />
      </div>
    </div>
  );
}

// MENU COMPONENTS : menu item card, with names and info
function MenuItemCard({ item }) {
  return (
    <div className="menu-item-card">
      <div className="card-image-placeholder">
        <span className="card-image-text">IMG</span>
      </div>
      <div className="card-body">
        <div className="card-top-row">
          <span className="card-name">{item.name}</span>
          <span className="card-price">{item.price}</span>
        </div>
        <p className="card-description">{item.description}</p>
        <div className="card-footer">
          {item.dietary.length > 0 && (
            <div className="card-tags">
              {item.dietary.map((tag) => (
                <span key={tag} className="diet-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {item.allergens.length > 0 && (
            <p className="card-allergens">Contains: {item.allergens.join(", ")}</p>
          )}
          <span className="card-calories">{item.calories}</span>
        </div>
      </div>
    </div>
  );
}

// MENU COMPONENTS : menu section components, dropdown
function MenuSection({ sectionName, items, isOpen, onToggle }) {
  return (
    <div className={`menu-section ${isOpen ? "menu-section--open" : ""}`}>
      <button className="section-header" onClick={onToggle}>
        <span className="section-name">{sectionName}</span>
        <div className="section-header-right">
          <span className="section-count">{items.length} items</span>
          <span className="section-toggle-icon">{isOpen ? "−" : "+"}</span>
        </div>
      </button>

      {isOpen && (
        <div className="section-items">
          {items.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
