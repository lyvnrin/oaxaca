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
      {count > 0 && <span className="cart-badge">{count}</span>}
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
        <CartIcon count={cartCount} onClick={onCartClick} />
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
function MenuItemCard({ item, dimmed, onAddToCart }) {
  return (
    <div className={`menu-item-card ${dimmed ? "menu-item-card--dimmed" : ""}`}>
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
                <span key={tag} className="diet-tag">{tag}</span>
              ))}
            </div>
          )}
          {item.allergens.length > 0 && (
            <p className="card-allergens">Contains: {item.allergens.join(", ")}</p>
          )}
          <span className="card-calories">{item.calories}</span>
        </div>
        <button
          className="add-to-order-btn"
          onClick={() => !dimmed && onAddToCart(item)}
          disabled={dimmed}
        >
          + Add to Order
        </button>
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

// CART ITEMS : cartModal popup with quantity controls, modifications, placing order
function CartModal({ cart, onClose, onUpdateQty, onRemove, onPlaceOrder }) {
  const entries = Object.values(cart);

  const total = entries.reduce((sum, { item, qty }) => {
    const price = parseFloat(item.price.replace("£", ""));
    return sum + price * qty;
  }, 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <h2 className="modal-title">Your Order</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {entries.length === 0 ? (
          <p className="modal-empty">Your order is empty. Add some items from the menu!</p>
        ) : (
          <>
            <div className="modal-items">
              {entries.map(({ item, qty }) => {
                const linePrice = (parseFloat(item.price.replace("£", "")) * qty).toFixed(2);
                return (
                  <div key={item.id} className="modal-item">
                    <div className="modal-item-info">
                      <span className="modal-item-name">{item.name}</span>
                      <span className="modal-item-price">£{linePrice}</span>
                    </div>
                    <div className="modal-item-controls">
                      <button className="qty-btn" onClick={() => onUpdateQty(item.id, qty - 1)}>−</button>
                      <span className="qty-value">{qty}</span>
                      <button className="qty-btn" onClick={() => onUpdateQty(item.id, qty + 1)}>+</button>
                      <button className="remove-btn" onClick={() => onRemove(item.id)}>✕</button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="modal-footer">
              <div className="modal-total">
                <span>Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>
              <button className="place-order-btn" onClick={onPlaceOrder}>
                Place Order
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

// CART ITEMS : Order confirmation shown after a successfully placed order
function OrderConfirmation() {
  return (
    <div className="modal-overlay">
      <div className="modal confirmation-modal">
        <div className="confirmation-icon">✓</div>
        <h2 className="confirmation-title">Order Placed!</h2>
        <p className="confirmation-msg">
          Your order has been sent to the kitchen.<br />Your waiter will be with you shortly.
        </p>
        <p className="confirmation-redirect">Returning you home...</p>
      </div>
    </div>
  );
}


// APP ROOT COMPONENT : main structure handling functions, menuData, filter operations
export default function App() {
  const [openSection, setOpenSection] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const [excludedAllergens, setExcludedAllergens] = useState([]);

  // CART ICON SHAPING
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // MENU : SECTION OPEN/CLOSE
  function handleSectionToggle(sectionName) {
    setOpenSection((prev) => (prev === sectionName ? null : sectionName));
  }

  // FILTER : DIETARY TOGGLING
  function handleFilterToggle(filter) {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  }

  // FILTER: MATCHING - dims the transparency of unrelated item
  function matchesFilter(item) {
    const passesDietary =
      activeFilters.length === 0 ||
      activeFilters.every((f) => item.dietary.includes(f));

    const passesAllergens =
      excludedAllergens.length === 0 ||
      excludedAllergens.every((a) => !item.allergens.includes(a));

    return passesDietary && passesAllergens;
  }

  // CART : ADDING ITEMS
  function handleAddToCart(item) {
    setCart((prev) => ({
      ...prev,
      [item.id]: {
        item,
        qty: prev[item.id] ? prev[item.id].qty + 1 : 1,
      },
    }));
  }

  // CART : UPDATING ITEMS
  function handleUpdateQty(itemId, newQty) {
    if (newQty <= 0) {
      handleRemove(itemId);
      return;
    }
    setCart((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], qty: newQty },
    }));
  }

  // CART : REMOVING ITEMS
  function handleRemove(itemId) {
    setCart((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  }

  // CART : PLACING ORDERS
  function handlePlaceOrder() {
    setCartOpen(false);
    setCart({});
    setConfirmed(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 2500);
  }

  const cartCount = Object.values(cart).reduce((sum, { qty }) => sum + qty, 0);

  return (
    <div className="app">
      <TopActions />
      <Header
        tableNumber="Table 10"
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
      />

      <main className="main-content">
        <FilterBar
          activeFilters={activeFilters}
          onFilterToggle={handleFilterToggle}
          excludedAllergens={excludedAllergens}
          onAllergenChange={setExcludedAllergens}
        />

        <div className="menu-sections">
          {Object.entries(MENU_DATA).map(([sectionName, items]) => (
            <MenuSection
              key={sectionName}
              sectionName={sectionName}
              items={items}
              isOpen={openSection === sectionName}
              onToggle={() => handleSectionToggle(sectionName)}
              matchesFilter={matchesFilter}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </main>

      {cartOpen && (
        <CartModal
          cart={cart}
          onClose={() => setCartOpen(false)}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemove}
          onPlaceOrder={handlePlaceOrder}
        />
      )}

      {confirmed && <OrderConfirmation />}
    </div>
  );
}

