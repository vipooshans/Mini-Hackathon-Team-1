import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ReportPage from "./pages/ReportPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import MyReportsPage from "./pages/MyReportsPage.jsx";
import MunicipalDashboardPage from "./pages/MunicipalDashboardPage.jsx";
import SchedulePage from "./pages/SchedulePage.jsx";
import GuidePage from "./pages/GuidePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import RecyclerPage from "./pages/RecyclerPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

/**
 * App — root component for CleanLanka.
 *
 * Citizen: /report, /schedule, /guide, /profile, /my-reports, /recycler (request)
 * Municipality: /dashboard
 * Recycler: /recycler
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
          <Route path="/dashboard" element={<MunicipalDashboardPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/recycler" element={<RecyclerPage />} />

          <Route
            path="*"
            element={
              <main className="interior-page">
                <div className="interior-page__inner">
                  <h1 className="interior-page__title">Page Not Found</h1>
                  <p className="interior-page__copy">
                    The page you are looking for does not exist.
                  </p>
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
