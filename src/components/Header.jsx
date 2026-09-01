import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Oscilloscope from './Oscilloscope.jsx';
import { useCart } from '../context/CartContext.jsx';
import { brand } from '../config/brand.js';

const LINKS = [
  { to: '/shop', label: 'Catalog' },
  { to: '/shop?cat=Bracelets', label: 'Bracelets' },
  { to: '/shop?cat=Rings', label: 'Rings' },
  { to: '/shop?cat=Necklaces', label: 'Necklaces' },
  { to: '/shop?cat=EMF%20Protection', label: 'EMF' },
];

export default function Header() {
  const { count, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isLinkActive = (to) => location.pathname + location.search === to.replace('%20', ' ');

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" aria-label={`${brand.name} — home`}>
          <span className="wordmark">
            {brand.name}<sup>®</sup>
          </span>
        </Link>
        <nav className="nav" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={isLinkActive(l.to) ? 'active' : undefined}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-right">
          <div className="scope-mini" aria-hidden="true">
            <div className="scope-box">
              <Oscilloscope showGrid={false} baseAmp={0.5} speed={1.2} />
            </div>
            <span className="readout">
              F=<b>7.83</b>HZ
            </span>
          </div>
          <button className="cart-link" onClick={openCart} aria-label={`Open cart, ${count} items`}>
            Cart&nbsp;<b>[{count}]</b>
          </button>
          <button
            className={`menu-btn ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      <nav className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-label="Mobile" aria-hidden={!menuOpen}>
        <NavLink to="/" end>
          Home <span>→</span>
        </NavLink>
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to}>
            {l.label} <span>→</span>
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
