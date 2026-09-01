import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../data/catalog.js';
import { square } from '../config/square.js';

export default function Checkout() {
  const { lines, subtotal, count } = useCart();

  return (
    <div className="co">
      <div className="co-head">
        <span className="mono signal">Final step —</span>
        <h1 className="display">Checkout</h1>
      </div>

      {lines.length === 0 ? (
        <div className="co-empty">
          <h3>Nothing to process</h3>
          <p>The cart is empty.</p>
          <Link to="/shop" className="btn">
            Back to the catalog <span className="arrow">→</span>
          </Link>
        </div>
      ) : (
        <div className="co-grid">
          <div className="co-pane">
            <h2>Payment</h2>
            {square.configured ? (
              <p className="lead">Square payment form goes here (Web Payments SDK).</p>
            ) : (
              <>
                <p className="lead">Card payments on this store are processed by Square.</p>
                <div className="square-note">
                  <b>Status: payments arming.</b>
                  <br />
                  The Square integration activates when API credentials are connected. This page will then
                  collect payment + shipping details and place the order.
                </div>
              </>
            )}
          </div>

          <div className="co-pane">
            <h2>Order summary</h2>
            {lines.map((l) => (
              <div className="sum-line" key={l.key}>
                <span>
                  {l.product.name} × {l.qty}
                  <br />
                  <span className="muted">
                    {[l.options.width, l.options.size, l.options.style, l.options.color]
                      .filter(Boolean)
                      .join(' / ')}
                  </span>
                </span>
                <span className="amt">{formatPrice(l.total)}</span>
              </div>
            ))}
            <div className="sum-total">
              <span>
                Subtotal ({count} {count === 1 ? 'item' : 'items'})
              </span>
              <b>{formatPrice(subtotal)}</b>
            </div>
            <p className="mono dim" style={{ fontSize: 10, marginTop: 10 }}>
              Shipping + taxes calculated when payments go live
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
