import { products as rawProducts } from './products.js';

// Image paths in products.js are root-absolute; prefix the deploy base so
// the site works when hosted from a subpath (e.g. GitHub Pages).
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const products = BASE
  ? rawProducts.map((p) => ({ ...p, image: BASE + p.image }))
  : rawProducts;

// Categories in a deliberate display order; anything new falls to the end.
const CATEGORY_ORDER = [
  'Bracelets',
  'Bangles',
  'Rings',
  'Necklaces',
  'EMF Protection',
  'Socks & Insoles',
  'Tech Accessories',
  'Topical Creams',
  'Pet Products',
  'Household Items',
  'Water Based Temporary Tattoos',
  'Custom Imprinting: Your Jewelry, our Technology',
  'Distributor / Affiliate Add On Services',
];

// Friendlier short labels for navigation chips.
export const CATEGORY_LABELS = {
  'Water Based Temporary Tattoos': 'Temporary Tattoos',
  'Custom Imprinting: Your Jewelry, our Technology': 'Custom Imprinting',
  'Distributor / Affiliate Add On Services': 'Distributor Services',
};

export function categoryLabel(cat) {
  return CATEGORY_LABELS[cat] || cat;
}

export const categories = [...new Set(products.map((p) => p.category))].sort((a, b) => {
  const ia = CATEGORY_ORDER.indexOf(a);
  const ib = CATEGORY_ORDER.indexOf(b);
  return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
});

export function getProduct(slug) {
  return products.find((p) => p.slug === slug);
}

// Per-variant price overrides, mirrored from the original storefront
// (socks by style, tattoo pack size, tumbler size).
export function getVariantPrice(product, { style, size } = {}) {
  let price = product.price;
  if (product.id === 1 && style) {
    price = style === 'Boot' || style === 'Crew' ? 20 : 18;
  } else if (product.id === 54) {
    price = (size || '').includes('40 Pack') ? 38 : 20;
  } else if (product.id === 133 && style) {
    price = style.includes('30oz') ? 99.95 : 89.95;
  }
  return price;
}

export function formatPrice(n) {
  const isWhole = Math.round(n * 100) % 100 === 0;
  return '$' + n.toLocaleString('en-US', {
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

// True when a product has any selectable options.
export function hasOptions(p) {
  return Boolean(
    (p.sizes && p.sizes.length > 1) ||
      (p.styles && p.styles.length) ||
      (p.colors && p.colors.length) ||
      (p.widths && p.widths.length)
  );
}

// "From $X" display for products whose variants change the price.
export function priceRange(p) {
  if (p.id === 1) return { min: 18, max: 20 };
  if (p.id === 54) return { min: 20, max: 38 };
  if (p.id === 133) return { min: 89.95, max: 99.95 };
  return { min: p.price, max: p.price };
}
