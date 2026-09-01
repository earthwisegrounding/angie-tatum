import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../data/catalog.js';

function optionSummary(options) {
  return [options.width, options.size, options.style, options.color].filter(Boolean).join(' / ');
}

export default function CartDrawer() {
  const { lines, count, subtotal, open, closeCart, setQty, remove } = useCart();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeCart();
    };
    if (open) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, closeCart]);

  return (
    <>
      <div className={`drawer-backdrop ${open ? 'open' : ''}`} onClick={closeCart} aria-hidden="true" />
      <aside className={`drawer ${open ? 'open' : ''}`} aria-label="Shopping cart" aria-hidden={!open}>
        <div className="drawer-head">
          <h2>
            Cart{count > 0 && <b>[{count}]</b>}
          </h2>
          <button className="drawer-close" onClick={closeCart} aria-label="Close cart">
            ✕
          </button>
        </div>
        {lines.length === 0 ? (
          <div className="drawer-empty">
            <h3>No signal</h3>
            <p>The cart is empty. Find something tuned to you.</p>
            <Link to="/shop" className="btn btn-line" onClick={closeCart}>
              Browse the catalog <span className="arrow">→</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="drawer-body">
              {lines.map((l) => (
                <div className="cart-line" key={l.key}>
                  <Link to={`/product/${l.product.slug}`} className="thumb" onClick={closeCart}>
                    <img src={l.product.image} alt={l.product.name} />
                  </Link>
                  <div>
                    <h4>{l.product.name}</h4>
                    {optionSummary(l.options) && <div className="opts">{optionSummary(l.options)}</div>}
                    <div className="cart-line-controls">
                      <span className="qty">
                        <button onClick={() => setQty(l.key, l.qty - 1)} aria-label="Decrease quantity">
                          −
                        </button>
                        <span>{l.qty}</span>
                        <button onClick={() => setQty(l.key, l.qty + 1)} aria-label="Increase quantity">
                          +
                        </button>
                      </span>
                      <button className="remove" onClick={() => remove(l.key)}>
                        Remove
                      </button>
                    </div>
                  </div>
                  <span className="line-price">{formatPrice(l.total)}</span>
                </div>
              ))}
            </div>
            <div className="drawer-foot">
              <div className="drawer-subtotal">
                <span>Subtotal</span>
                <b>{formatPrice(subtotal)}</b>
              </div>
              <p className="fine">Shipping + taxes calculated at checkout</p>
              <Link to="/checkout" className="btn btn-bar" onClick={closeCart}>
                <span>Checkout</span>
                <span className="arrow">→</span>
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
