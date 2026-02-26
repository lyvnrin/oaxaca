import { useState, useRef, useEffect } from "react";
import "./Menu.css";
import { GRADIENTS, ALL_ALLERGENS, SECTIONS, TAG_CLASSES, itemPasses,} from "./MenuData.js";
import { IconCart, IconBell, IconSettings, IconPlus, IconMinus, IconEmptyCart, IconFilter,} from "./icons.jsx";

export default function OaxacaMenu() {
  // State
  const [openSections,     setOpenSections]     = useState(new Set(["Starters"]));
  const [activeFilters,    setActiveFilters]    = useState([]);
  const [excludeAllergens, setExcludeAllergens] = useState([]);
  const [allergenOpen,     setAllergenOpen]     = useState(false);
  const [menuOpen,         setMenuOpen]         = useState(false);
  const [cart,             setCart]             = useState({});
  const [cartOpen,         setCartOpen]         = useState(false);
  const [toast,            setToast]            = useState(null);

  // References
  const allergenRef = useRef(null);
  const popupRef    = useRef(null);
  const toastTimer  = useRef(null);

  // Derived from values
  const totalItems = Object.values(cart).reduce((s, v) => s + v.qty, 0);
  const cartItems  = Object.values(cart);
  const totalPrice = cartItems.reduce(
    (s, i) => s + parseFloat(i.price.replace("£", "")) * i.qty,
    0,
  );

  // Effects
  useEffect(() => {
    const outside = (e) => {
      if (allergenRef.current && !allergenRef.current.contains(e.target)) setAllergenOpen(false);
      if (popupRef.current    && !popupRef.current.contains(e.target))    setMenuOpen(false);
    };
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);

  // Handlers
  const toggleSection = (name) => setOpenSections(prev => {
    const n = new Set(prev);
    n.has(name) ? n.delete(name) : n.add(name);
    return n;
  });

  const toggleFilter = (f) => setActiveFilters(prev =>
    prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f],
  );

  const toggleAllergen = (a) => setExcludeAllergens(prev =>
    prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a],
  );

  const addToCart = (item) => {
    setCart(prev => ({ ...prev, [item.id]: { ...item, qty: (prev[item.id]?.qty || 0) + 1 } }));
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(item.name);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  const changeQty = (id, delta) => setCart(prev => {
    const item = prev[id];
    if (!item) return prev;
    const qty = item.qty + delta;
    if (qty <= 0) { const n = { ...prev }; delete n[id]; return n; }
    return { ...prev, [id]: { ...item, qty } };
  });

  // Render state
  return (
    <div className="oaxaca-root">

      {/* Header */}
      <header className="oax-header">
        <div className="oax-table-badge">Table 10</div>
        <div className="oax-logo">OAXACA</div>

        <div style={{ position: "relative" }} ref={popupRef}>
          <button
            className={`oax-hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>

          {menuOpen && (
            <div className="oax-popup">
              <div className="oax-popup-label">Options</div>
              <button
                className="oax-popup-btn"
                onClick={() => { alert("Contacting your waiter…"); setMenuOpen(false); }}
              >
                <span className="oax-popup-btn-icon"><IconBell /></span>
                Contact Waiter
              </button>
              <button
                className="oax-popup-btn"
                onClick={() => { alert("Settings coming soon."); setMenuOpen(false); }}
              >
                <span className="oax-popup-btn-icon"><IconSettings /></span>
                Settings
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Filter bar */}
      <div className="oax-filter-bar">
        <span className="oax-filter-label">Show me</span>

        {["Vegetarian", "Gluten-Free", "Vegan"].map(f => (
          <button
            key={f}
            className={`oax-filter-pill ${activeFilters.includes(f) ? "active" : ""}`}
            onClick={() => toggleFilter(f)}
          >
            {f}
          </button>
        ))}

        <div className="oax-filter-spacer" />

        <div className="oax-allergen-wrap" ref={allergenRef}>
          <button
            className={`oax-allergen-btn ${allergenOpen ? "open" : ""}`}
            onClick={() => setAllergenOpen(v => !v)}
          >
            <IconFilter />
            Allergen Filter
            {excludeAllergens.length > 0 && (
              <span className="oax-allergen-count">{excludeAllergens.length}</span>
            )}
            <span className="oax-allergen-chevron">▼</span>
          </button>

          {allergenOpen && (
            <div className="oax-allergen-dropdown">
              <div className="oax-allergen-title">Does Not Contain</div>
              <div className="oax-allergen-grid">
                {ALL_ALLERGENS.map(a => (
                  <button
                    key={a}
                    className={`oax-allergen-chip ${excludeAllergens.includes(a) ? "active" : ""}`}
                    onClick={() => toggleAllergen(a)}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Menu sections */}
      <main className="oax-sections">
        {SECTIONS.map((section, si) => {
          const isOpen       = openSections.has(section.name);
          const visibleCount = section.items.filter(i => itemPasses(i, activeFilters, excludeAllergens)).length;
          const roman        = ["I", "II", "III", "IV", "V"][si];

          return (
            <div key={section.name} className={`oax-section ${isOpen ? "is-open" : ""}`}>
              <button className="oax-section-header" onClick={() => toggleSection(section.name)}>
                <div className="oax-section-left">
                  <span className="oax-section-num">{roman}</span>
                  <span className="oax-section-divider-vert" />
                  <span className="oax-section-name">{section.name}</span>
                  <span className="oax-section-count">{visibleCount}</span>
                </div>
                <div className="oax-section-right">
                  <span className="oax-section-toggle"><IconPlus /></span>
                </div>
              </button>

              <div className="oax-section-body">
                <div className="oax-divider" />
                <div className="oax-cards-wrap">
                  {visibleCount === 0 ? (
                    <div className="oax-no-items">No items match your current filters.</div>
                  ) : (
                    <div className="oax-cards-inner">
                      {section.items.map((item, ci) => {
                        const visible = itemPasses(item, activeFilters, excludeAllergens);
                        const grad    = GRADIENTS[(si + ci) % GRADIENTS.length];
                        return (
                          <div key={item.id} className={`oax-card ${!visible ? "filtered-out" : ""}`}>
                            <div className="oax-card-img">
                              <div className="oax-card-img-inner" style={{ background: grad }} />
                              <span className="oax-card-initial">{item.name[0]}</span>
                            </div>
                            <div className="oax-card-body">
                              {item.tags.length > 0 && (
                                <div className="oax-card-tags">
                                  {item.tags.map(t => (
                                    <span key={t} className={TAG_CLASSES[t] || "oax-tag"}>{t}</span>
                                  ))}
                                </div>
                              )}
                              <div className="oax-card-name">{item.name}</div>
                              <div className="oax-card-desc">{item.desc}</div>
                              <div className="oax-card-footer">
                                <span className="oax-card-price">{item.price}</span>
                                <button
                                  className="oax-card-add"
                                  onClick={() => addToCart(item)}
                                  aria-label={`Add ${item.name}`}
                                >
                                  <IconPlus />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* Cart fab icon */}
      <button className="oax-cart-fab" onClick={() => setCartOpen(true)} aria-label="View cart">
        <IconCart />
        {totalItems > 0 && <span className="oax-cart-badge">{totalItems}</span>}
      </button>

      {toast && <div className="oax-toast">{toast} added to order</div>}

      {/* Cart overlay */}
      {cartOpen && (
        <div
          className="oax-cart-overlay"
          onClick={e => { if (e.target === e.currentTarget) setCartOpen(false); }}
        >
          <div className="oax-cart-sheet">
            <div className="oax-cart-handle" />
            <div className="oax-cart-header">
              <div className="oax-cart-title">Your Order</div>
              <button className="oax-cart-close" onClick={() => setCartOpen(false)}>×</button>
            </div>

            {cartItems.length === 0 ? (
              <div className="oax-empty-cart">
                <div className="oax-empty-cart-icon"><IconEmptyCart /></div>
                <div className="oax-empty-cart-text">Nothing here yet</div>
                <div className="oax-empty-cart-sub">Browse the menu and add your favourites</div>
              </div>
            ) : (
              <>
                {cartItems.map(item => (
                  <div key={item.id} className="oax-cart-item">
                    <div>
                      <div className="oax-cart-item-name">{item.name}</div>
                      <div className="oax-cart-item-price">
                        {item.price} × {item.qty} = £{(parseFloat(item.price.replace("£", "")) * item.qty).toFixed(2)}
                      </div>
                    </div>
                    <div className="oax-cart-item-controls">
                      <button className="oax-qty-btn" onClick={() => changeQty(item.id, -1)}><IconMinus /></button>
                      <span className="oax-qty-num">{item.qty}</span>
                      <button className="oax-qty-btn" onClick={() => changeQty(item.id, +1)}><IconPlus /></button>
                    </div>
                  </div>
                ))}

                <div className="oax-cart-total">
                  <span className="oax-cart-total-label">Total</span>
                  <span className="oax-cart-total-amount">£{totalPrice.toFixed(2)}</span>
                </div>
                <button
                  className="oax-cart-order-btn"
                  onClick={() => { alert("Order placed — your server has been notified."); setCartOpen(false); }}
                >
                  Place Order
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}