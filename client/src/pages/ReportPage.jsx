import { Link } from "react-router-dom";
import ReportForm from "../components/report/ReportForm.jsx";

/**
 * ReportPage — interior page for the "Report a Waste Issue" feature.
 *
 * Includes a top bar with brand + back link, then the ReportForm card.
 * Styled to match the landing page's Fraunces/Outfit design system.
 */
function ReportPage() {
  return (
    <main className="interior-page">
      <nav className="interior-topbar">
        <Link to="/" className="interior-topbar__brand">CleanLanka</Link>
        <Link to="/" className="interior-topbar__back">← Back to home</Link>
      </nav>
      <div className="interior-page__inner">
        <ReportForm />
      </div>
    </main>
  );
}

export default ReportPage;
