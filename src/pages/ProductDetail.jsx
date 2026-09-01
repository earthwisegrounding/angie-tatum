import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import NotFound from './NotFound.jsx';
import { useCart } from '../context/CartContext.jsx';
import { getProduct, getVariantPrice, formatPrice, products, categoryLabel } from '../data/catalog.js';

const pad3 = (n) => String(n).padStart(3, '0');

function OptionGroup({ label, options, value, onSelect }) {
  return (
    <div className="opt">
      <div className="mono opt-label">
        <span>{label}</span>
        <span className="sel">{value || 'Select'}</span>
      </div>
      <div className="opt-pills" role="group" aria-label={label}>
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`optbtn ${value === opt ? 'selected' : ''}`}
            onClick={() => onSelect(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const product = getProduct(slug);
  const { add } = useCart();

  const [width, setWidth] = useState(() =>
    product?.widths?.length === 1 ? product.widths[0] : null
  );
  const [size, setSize] = useState(() =>
    product?.sizes?.length === 1 ? product.sizes[0] : null
  );
  const [style, setStyle] = useState(() =>
    product?.styles?.length === 1 ? product.styles[0] : null
  );
  const [color, setColor] = useState(() =>
    product?.colors?.length === 1 ? product.colors[0] : null
  );
  const [qty, setQtyCount] = useState(1);
  const [warning, setWarning] = useState('');
  const [added, setAdded] = useState(false);

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  if (!product) return <NotFound />;

  const sizeOptions = product.widths ? (width ? product.sizesByWidth?.[width] || [] : []) : product.sizes;
  const options = { width, size, style, color };
  const unitPrice = getVariantPrice(product, options);

  const missing = [];
  if (product.widths && product.widths.length > 1 && !width) missing.push('width');
  if (product.widths && width && (product.sizesByWidth?.[width] || []).length > 0 && !size) missing.push('size');
  if (!product.widths && product.sizes && product.sizes.length > 1 && !size) missing.push('size');
  if (product.styles && product.styles.length > 1 && !style) missing.push(product.id === 133 ? 'style / size' : 'style');
  if (product.colors && product.colors.length > 1 && !color) missing.push('color');

  const onAdd = () => {
    if (missing.length) {
      setWarning(`Select ${missing.join(' + ')} to continue`);
      return;
    }
    setWarning('');
    add(product.id, options, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const tumblerDim = product.tumblerDimensions && style ? product.tumblerDimensions[style] : null;

  return (
    <>
      <div className="pdp">
        <nav className="mono pdp-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/shop">Catalog</Link>
          <span>/</span>
          <Link to={`/shop?cat=${encodeURIComponent(product.category)}`}>
            {categoryLabel(product.category)}
          </Link>
          <span>/</span>
          <span>N°{pad3(product.id)}</span>
        </nav>

        <div className="pdp-grid">
          <div className="pdp-media">
            <span className="mono pdp-num">Catalog N°{pad3(product.id)}</span>
            <div className="pdp-media-inner">
              <img src={product.image} alt={product.name} />
            </div>
          </div>

          <div className="pdp-info">
            <span className="mono cat">{categoryLabel(product.category)}</span>
            <h1 className="display">{product.name}</h1>

            <div className="spec-table">
              <div className="spec-row">
                <span className="mono k">Price</span>
                <span className="v price">{formatPrice(unitPrice)}</span>
              </div>
              <div className="spec-row">
                <span className="mono k">Imprint</span>
                <span className="v">7.83 Hz — Schumann resonance</span>
              </div>
              <div className="spec-row">
                <span className="mono k">Catalog</span>
                <span className="v">N°{pad3(product.id)}</span>
              </div>
              {product.weight_oz ? (
                <div className="spec-row">
                  <span className="mono k">Ship weight</span>
                  <span className="v">{product.weight_oz} oz</span>
                </div>
              ) : null}
              {tumblerDim && (
                <div className="spec-row">
                  <span className="mono k">Dimensions</span>
                  <span className="v">{tumblerDim}</span>
                </div>
              )}
            </div>

            {product.widths && product.widths.length > 0 && (
              <OptionGroup
                label="Width"
                options={product.widths}
                value={width}
                onSelect={(w) => {
                  setWidth(w);
                  setSize(null);
                  setWarning('');
                }}
              />
            )}

            {sizeOptions && sizeOptions.length > 1 && (
              <OptionGroup
                label="Size"
                options={sizeOptions}
                value={size}
                onSelect={(s) => {
                  setSize(s);
                  setWarning('');
                }}
              />
            )}

            {product.styles && product.styles.length > 1 && (
              <OptionGroup
                label={product.id === 133 ? 'Style / size' : 'Style'}
                options={product.styles}
                value={style}
                onSelect={(s) => {
                  setStyle(s);
                  setWarning('');
                }}
              />
            )}

            {product.colors && product.colors.length > 1 && (
              <OptionGroup
                label="Color"
                options={product.colors}
                value={color}
                onSelect={(c) => {
                  setColor(c);
                  setWarning('');
                }}
              />
            )}

            <div className="pdp-buy">
              <span className="qty">
                <button onClick={() => setQtyCount(Math.max(1, qty - 1))} aria-label="Decrease quantity">
                  −
                </button>
                <span>{qty}</span>
                <button onClick={() => setQtyCount(qty + 1)} aria-label="Increase quantity">
                  +
                </button>
              </span>
              <button className="btn" onClick={onAdd}>
                <span>{added ? '✓ Added' : 'Add to cart'}</span>
                <span>{formatPrice(unitPrice * qty)}</span>
              </button>
            </div>
            {warning && <p className="opt-warning">▲ {warning}</p>}

            <div className="pdp-notes">
              <div className="mono nlabel">Field notes —</div>
              <p>{product.description}</p>
            </div>

            <p className="pdp-fine">
              Every piece is imprinted with our proprietary frequency process, tuned to the Earth&rsquo;s
              7.83 Hz Schumann resonance. Not intended to diagnose, treat, cure, or prevent any disease.
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="sec">
          <div className="sec-head">
            <h2>
              <span className="idx">++</span> More like this
            </h2>
            <Link to={`/shop?cat=${encodeURIComponent(product.category)}`} className="more">
              All {categoryLabel(product.category)}
            </Link>
          </div>
          <div className="cells">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} showCategory={false} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
