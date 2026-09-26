import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <main>
      <h1>Conan</h1>
      <p>AI Contract Obligation &amp; Risk Intelligence</p>
      <p>From clauses to consequences.</p>

      <div>
        <Link to="/upload">Upload Contract</Link>
        <Link to="/upload">Try Sample Contract</Link>
      </div>
    </main>
  );
}
