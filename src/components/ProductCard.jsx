import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice, priceRange, categoryLabel } from '../data/catalog.js';

// Options that need no decision (a single choice, or none) can be quick-added.
export function autoOptions(p) {
  const opts = {};
  if (p.widths) {
    if (p.widths.length > 1) return null;
    opts.width = p.widths[0];
    const sizes = p.sizesByWidth?.[opts.width] || [];
    if (sizes.length > 1) return null;
    if (sizes.length === 1) opts.size = sizes[0];
  } else if (p.sizes) {
    if (p.sizes.length > 1) return null;
    opts.size = p.sizes[0];
  }
  if (p.styles) {
    if (p.styles.length > 1) return null;
    opts.style = p.styles[0];
  }
  if (p.colors) {
    if (p.colors.length > 1) return null;
    opts.color = p.colors[0];
  }
  return opts;
}

const pad3 = (n) => String(n).padStart(3, '0');

export default function ProductCard({ product, showCategory = true, large = false }) {
  const { add } = useCart();
  const navigate = useNavigate();
  const { min, max } = priceRange(product);
  const quickOpts = autoOptions(product);

  const onQuickAdd = (e) => {
    e.preventDefault();
    if (quickOpts) add(product.id, quickOpts, 1);
    else navigate(`/product/${product.slug}`);
  };

  return (
    <Link to={`/product/${product.slug}`} className={`cell ${large ? 'cell--lg' : ''}`} aria-label={product.name}>
      <div className="cell-top">
        <span className="cell-num">N°{pad3(product.id)}</span>
        {showCategory && <span className="cell-cat">{categoryLabel(product.category)}</span>}
      </div>
      <div className="cell-media">
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
      <h3 className="cell-name">{product.name}</h3>
      <div className="cell-foot">
        <span className="cell-price">
          {min !== max && <span className="from">fr.</span>}
          {formatPrice(min)}
        </span>
        <button className="cell-action" onClick={onQuickAdd}>
          {quickOpts ? '+ Add' : 'Options →'}
        </button>
      </div>
    </Link>
  );
}
