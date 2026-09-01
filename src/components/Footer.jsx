import { Link } from 'react-router-dom';
import { brand } from '../config/brand.js';
import { categories, categoryLabel, products } from '../data/catalog.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-cols">
        <div className="footer-about">
          <h4>{brand.name}</h4>
          <p>
            A catalog of {products.length} pieces — jewelry, wearables, and equipment for home and vehicle —
            each imprinted at 7.83 Hz, the Earth&rsquo;s Schumann resonance.
          </p>
        </div>
        <div>
          <h4>Catalog</h4>
          <ul>
            {categories.slice(0, 7).map((c) => (
              <li key={c}>
                <Link to={`/shop?cat=${encodeURIComponent(c)}`}>{categoryLabel(c)}</Link>
              </li>
            ))}
            <li>
              <Link to="/shop">Full catalog →</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li>
              <a href={`mailto:${brand.email}`}>{brand.email}</a>
            </li>
            <li>
              <Link to="/checkout">Checkout</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-giant" aria-hidden="true">
        <div className="track">
          <span>
            {brand.name} <i>·</i> 7.83 Hz <i>·</i>{' '}
          </span>
          <span>
            {brand.name} <i>·</i> 7.83 Hz <i>·</i>{' '}
          </span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {brand.name} — All rights reserved</span>
        <span>Not intended to diagnose, treat, cure, or prevent any disease</span>
      </div>
    </footer>
  );
}
