import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { products, categories, categoryLabel, priceRange } from '../data/catalog.js';

const SORTS = {
  featured: { label: 'Sort: Catalog', fn: null },
  'price-asc': { label: 'Sort: Price ↑', fn: (a, b) => priceRange(a).min - priceRange(b).min },
  'price-desc': { label: 'Sort: Price ↓', fn: (a, b) => priceRange(b).min - priceRange(a).min },
  'name-asc': { label: 'Sort: A–Z', fn: (a, b) => a.name.localeCompare(b.name) },
};

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const activeCat = params.get('cat') || '';
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');

  const setCat = (cat) => {
    if (cat) setParams({ cat });
    else setParams({});
  };

  const filtered = useMemo(() => {
    let list = products;
    if (activeCat) list = list.filter((p) => p.category === activeCat);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    const sortFn = SORTS[sort]?.fn;
    if (sortFn) list = [...list].sort(sortFn);
    return list;
  }, [activeCat, query, sort]);

  return (
    <>
      <div className="shop-head">
        <h1 className="display">{activeCat ? categoryLabel(activeCat) : 'The Catalog'}</h1>
        <div className="meta">
          <div className="mono dim">Catalog — every piece imprinted at 7.83 Hz</div>
          <div className="big">
            [{filtered.length}/{products.length}]
          </div>
        </div>
      </div>

      <div className="mobile-cats" role="tablist" aria-label="Filter by category">
        <button className={!activeCat ? 'active' : ''} onClick={() => setCat('')}>
          All [{products.length}]
        </button>
        {categories.map((c) => (
          <button key={c} className={activeCat === c ? 'active' : ''} onClick={() => setCat(c)}>
            {categoryLabel(c)}
          </button>
        ))}
      </div>

      <div className="shop-body">
        <aside className="shop-side">
          <div className="shop-side-inner">
            <div className="mono side-label">Categories</div>
            <button className={`side-cat ${!activeCat ? 'active' : ''}`} onClick={() => setCat('')}>
              <span>Everything</span>
              <span className="n">{products.length}</span>
            </button>
            {categories.map((c) => (
              <button
                key={c}
                className={`side-cat ${activeCat === c ? 'active' : ''}`}
                onClick={() => setCat(c)}
              >
                <span>{categoryLabel(c)}</span>
                <span className="n">{products.filter((p) => p.category === c).length}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="shop-grid">
          <div className="shop-tools">
            <label className="tool-search">
              <span className="mono dim">⌕</span>
              <input
                type="search"
                placeholder="Search the catalog"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search products"
              />
            </label>
            <span className="tool-sort">
              <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
                {Object.entries(SORTS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </span>
          </div>

          <div className="mono shop-count">
            {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
            {activeCat && ` — ${categoryLabel(activeCat)}`}
            {query.trim() && ` — “${query.trim()}”`}
          </div>

          {filtered.length === 0 ? (
            <div className="shop-empty">
              <h3>No signal</h3>
              <p>Nothing matches. Try a different search or category.</p>
            </div>
          ) : (
            <div className="cells">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} showCategory={!activeCat} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
