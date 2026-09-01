import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { products, getVariantPrice } from '../data/catalog.js';

const CartContext = createContext(null);

const STORAGE_KEY = 'tfp-cart-v1';

// A cart line is { key, productId, options: {size, style, color, width}, qty }.
function lineKey(productId, options) {
  return [productId, options.width, options.size, options.style, options.color]
    .map((v) => v ?? '')
    .join('|');
}

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const key = lineKey(action.productId, action.options);
      const existing = state.find((l) => l.key === key);
      if (existing) {
        return state.map((l) => (l.key === key ? { ...l, qty: l.qty + action.qty } : l));
      }
      return [...state, { key, productId: action.productId, options: action.options, qty: action.qty }];
    }
    case 'setQty': {
      if (action.qty <= 0) return state.filter((l) => l.key !== action.key);
      return state.map((l) => (l.key === action.key ? { ...l, qty: action.qty } : l));
    }
    case 'remove':
      return state.filter((l) => l.key !== action.key);
    case 'clear':
      return [];
    default:
      return state;
  }
}

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((l) => products.some((p) => p.id === l.productId));
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, undefined, loadInitial);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable */
    }
  }, [lines]);

  const value = useMemo(() => {
    const detailed = lines
      .map((l) => {
        const product = products.find((p) => p.id === l.productId);
        if (!product) return null;
        const unitPrice = getVariantPrice(product, l.options);
        return { ...l, product, unitPrice, total: unitPrice * l.qty };
      })
      .filter(Boolean);
    const count = detailed.reduce((n, l) => n + l.qty, 0);
    const subtotal = detailed.reduce((n, l) => n + l.total, 0);
    return {
      lines: detailed,
      count,
      subtotal,
      open,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      add: (productId, options, qty = 1) => {
        dispatch({ type: 'add', productId, options, qty });
        setOpen(true);
      },
      setQty: (key, qty) => dispatch({ type: 'setQty', key, qty }),
      remove: (key) => dispatch({ type: 'remove', key }),
      clear: () => dispatch({ type: 'clear' }),
    };
  }, [lines, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
