import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import Oscilloscope from '../components/Oscilloscope.jsx';
import Reveal from '../components/Reveal.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { products, categories, categoryLabel } from '../data/catalog.js';
import { brand } from '../config/brand.js';

// 1 spotlight + 8 supporting = 12 grid slots, exact rows at 4/3/2 columns.
const SPOTLIGHT_ID = 10;
const FEATURED_IDS = [18, 29, 5, 2, 84, 133, 17, 12];

const STRIP_IDS = [9, 20, 63, 78, 16, 22, 87, 2, 48, 96, 26, 133, 55, 137];

const CAT_PREVIEW = {
  Bracelets: '/products/titanium_bracelet_heart_2tone.webp',
  Rings: '/products/tungsten_ring_gold_edge_turbine.webp',
  Necklaces: '/products/stainless_necklace_18in_x_19mm_box_chain.webp',
  Bangles: '/products/stainless_steel_bangle_wire_wrap_bangles.webp',
  'EMF Protection': '/products/emf_safe_haven.webp',
  'Socks & Insoles': '/products/massaging_gel_insole.webp',
  'Tech Accessories': '/products/apple_watch_band_sport_black_w_multi_color_holes.webp',
};

const pad2 = (n) => String(n).padStart(2, '0');
const pad3 = (n) => String(n).padStart(3, '0');
const byId = (id) => products.find((p) => p.id === id);

function CategoryIndex() {
  const [preview, setPreview] = useState(null);
  const frame = useRef(null);

  const onMove = (e, cat) => {
    if (frame.current) cancelAnimationFrame(frame.current);
    const { clientX, clientY } = e;
    frame.current = requestAnimationFrame(() => setPreview({ cat, x: clientX, y: clientY }));
  };

  const shown = categories.slice(0, 7);

  return (
    <div className="cat-index" onMouseLeave={() => setPreview(null)}>
      {shown.map((c, i) => {
        const img = CAT_PREVIEW[c] || products.find((p) => p.category === c)?.image;
        return (
          <Link
            key={c}
            to={`/shop?cat=${encodeURIComponent(c)}`}
            className="cat-row"
            onMouseMove={(e) => onMove(e, c)}
          >
            <span className="thumb">
              <img src={img} alt="" loading="lazy" />
            </span>
            <span className="num">{pad2(i + 1)} /</span>
            <span className="name">{categoryLabel(c)}</span>
            <span className="count">{products.filter((p) => p.category === c).length} pieces</span>
            <span className="go">→</span>
          </Link>
        );
      })}
      {preview && (
        <div
          className="cat-preview on"
          style={{ left: preview.x + 26, top: Math.min(preview.y - 115, window.innerHeight - 250) }}
        >
          <img
            src={CAT_PREVIEW[preview.cat] || products.find((p) => p.category === preview.cat)?.image}
            alt=""
          />
          <span className="cap">{categoryLabel(preview.cat)}</span>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const spotlight = byId(SPOTLIGHT_ID);
  const featured = FEATURED_IDS.map(byId).filter(Boolean);
  const stripSet = STRIP_IDS.map(byId).filter(Boolean);

  return (
    <>
      <section
        className="hero"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}hero-bg.jpeg)` }}
      >
        <div className="hero-top">
          <span className="mono dim">{brand.name} — Catalog N°001–146</span>
          <span className="mono dim">Frequency-imprinted goods / Est. USA</span>
        </div>

        <h1 className="hero-h1 display" aria-label="Tuned to the Earth">
          <span className="line">
            <span>Tuned</span>
          </span>
          <span className="line">
            <span>to the</span>
          </span>
          <span className="line">
            <span className="outline">Earth.</span>
          </span>
        </h1>

        <div className="hero-under">
          <div className="hero-copy">
            <p>
              Jewelry and everyday essentials imprinted at <b>7.83 Hz</b> — the Schumann resonance, the
              planet&rsquo;s own electromagnetic pulse. Grounding you can wear.
            </p>
            <div className="hero-cta">
              <Link to="/shop" className="btn">
                Shop the catalog <span className="arrow">→</span>
              </Link>
              <a href="#science" className="btn btn-line">
                The science
              </a>
            </div>
          </div>
        </div>

        <div className="hero-scope">
          <span className="mono scope-label">
            F = <b>7.830 Hz</b> ± 0.002 — Schumann resonance
          </span>
          <span className="mono scope-hint">Amplitude responds to scroll</span>
          <Oscilloscope reactive baseAmp={0.5} />
        </div>
      </section>

      <div className="spec-strip">
        <div className="spec-cell">
          <div className="mono k">Frequency</div>
          <div className="v">7.83 Hz — Schumann</div>
        </div>
        <div className="spec-cell">
          <div className="mono k">Materials</div>
          <div className="v">Tungsten · Titanium · Copper · Sterling</div>
        </div>
        <div className="spec-cell">
          <div className="mono k">Warranty</div>
          <div className="v">Lifetime — Sine Bands</div>
        </div>
        <div className="spec-cell">
          <div className="mono k">Coverage</div>
          <div className="v">Safe Haven — 50,000 sq ft</div>
        </div>
      </div>

      <section className="sec">
        <div className="sec-head">
          <h2>
            <span className="idx">01</span> Selected pieces
          </h2>
          <Link to="/shop" className="more">
            Full catalog [{products.length}]
          </Link>
        </div>
        <div className="cells">
          <ProductCard product={spotlight} large />
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="sec-head">
          <h2>
            <span className="idx">02</span> By category
          </h2>
          <span className="mono dim hover-hint">Hover to preview</span>
        </div>
        <CategoryIndex />
      </section>

      <section className="science" id="science">
        <div className="science-grid">
          <div className="science-left">
            <div className="mono kicker">03 — The reference signal</div>
            <h2>
              The Earth resonates at <span className="hz">7.83&nbsp;Hz</span>
            </h2>
            <p>
              Between the planet&rsquo;s surface and the ionosphere sits a resonant cavity. Lightning strikes it
              like a bell, roughly fifty times a second, and the cavity rings at a base mode of 7.83 Hz — the{' '}
              <b>Schumann resonance</b>, first predicted in 1952.
            </p>
            <p>
              Grounding practice — standing barefoot on the earth — is the traditional way to seek that
              connection. Our proprietary process imprints the same reference frequency into every piece in
              this catalog, from tungsten rings to gel insoles, so it travels with you: designed to complement
              the body&rsquo;s natural sense of balance.
            </p>
          </div>
          <div className="science-right">
            <div className="science-scope">
              <Oscilloscope
                line="#efece4"
                grid="rgba(239,236,228,0.08)"
                accent="#ff4b00"
                baseAmp={0.6}
                speed={0.7}
              />
            </div>
            <div className="science-data">
              <div className="d">
                <b>7.83 Hz</b>
                <span>Base mode</span>
              </div>
              <div className="d">
                <b>~50 / sec</b>
                <span>Global lightning strikes</span>
              </div>
              <div className="d">
                <b>1952</b>
                <span>Predicted by W.O. Schumann</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="strip" aria-hidden="true">
        <div className="strip-track">
          {[0, 1].map((copy) => (
            <div className="strip-set" key={copy}>
              {stripSet.map((p) => (
                <span className="strip-cell" key={`${copy}-${p.id}`}>
                  <span className="n">N°{pad3(p.id)}</span>
                  <img src={p.image} alt="" loading="lazy" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Reveal className="cta-band">
        <h2>
          {products.length} pieces. <em>One frequency.</em>
        </h2>
        <Link to="/shop" className="btn">
          Open the catalog <span className="arrow">→</span>
        </Link>
      </Reveal>
    </>
  );
}
