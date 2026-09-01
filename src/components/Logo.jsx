import { brand } from '../config/brand.js';

export function WaveMark({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="14.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M6 16c2.5-6 5-6 7.5 0s5 6 7.5 0 3.5-4.5 5 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function Logo() {
  return (
    <span className="logo">
      <WaveMark />
      {brand.name}
    </span>
  );
}
