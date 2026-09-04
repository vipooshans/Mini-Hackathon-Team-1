import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ReportPage from "./pages/ReportPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import MyReportsPage from "./pages/MyReportsPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

/**
 * App — root component for CleanLanka.
 *
 * Routes:
 *   /           → Home (landing page with its own Header)
 *   /report     → ReportPage (Report a Waste Issue)
 *   /schedule   → placeholder (teammate feature)
 *   /guide      → placeholder (teammate feature)
 *   /dashboard  → placeholder (teammate feature)
 *
 * Note: The Home page includes its own Header component. Interior pages
 * (report, schedule, etc.) use a simplified top bar — see ReportPage.
 *
 * Teammates: to add your feature page, import it and add a <Route> below.
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/my-reports" element={<MyReportsPage />} />

        {/* Teammate placeholder routes — replace with your page components */}
        <Route
          path="/schedule"
          element={
            <main className="interior-page">
              <div className="interior-page__inner">
                <h1 className="interior-page__title">Collection Schedule</h1>
                <p className="interior-page__copy">Coming soon — this feature is under development.</p>
              </div>
            </main>
          }
        />
        <Route
          path="/guide"
          element={
            <main className="interior-page">
              <div className="interior-page__inner">
                <h1 className="interior-page__title">Disposal Guide</h1>
                <p className="interior-page__copy">Coming soon — this feature is under development.</p>
              </div>
            </main>
          }
        />
        <Route
          path="/dashboard"
          element={
            <main className="interior-page">
              <div className="interior-page__inner">
                <h1 className="interior-page__title">Statistics Dashboard</h1>
                <p className="interior-page__copy">Coming soon — this feature is under development.</p>
              </div>
            </main>
          }
        />

        {/* 404 fallback */}
        <Route
          path="*"
          element={
            <main className="interior-page">
              <div className="interior-page__inner">
                <h1 className="interior-page__title">Page Not Found</h1>
                <p className="interior-page__copy">The page you are looking for does not exist.</p>
              </div>
            </main>
          }
        />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
