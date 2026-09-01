import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="nf">
      <div className="mono code">Error 404 — no signal</div>
      <h1 className="display">Signal lost</h1>
      <p>That page isn&rsquo;t in the catalog. Retune below.</p>
      <Link to="/shop" className="btn">
        Back to the catalog <span className="arrow">→</span>
      </Link>
    </div>
  );
}
