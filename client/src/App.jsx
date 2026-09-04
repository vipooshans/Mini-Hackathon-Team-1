import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ReportPage from "./pages/ReportPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import MyReportsPage from "./pages/MyReportsPage.jsx";
import MunicipalDashboardPage from "./pages/MunicipalDashboardPage.jsx";
import SchedulePage from "./pages/SchedulePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import RecyclerPage from "./pages/RecyclerPage.jsx";
import RecyclingGuidePage from "./pages/RecyclingGuidePage.jsx";
import WasteGuideDetailsPage from "./pages/WasteGuideDetailsPage.jsx";
import RecyclingCentersPage from "./pages/RecyclingCentersPage.jsx";
import RecyclingCentersMapPage from "./pages/RecyclingCentersMapPage.jsx";
import RecyclingCenterDetailsPage from "./pages/RecyclingCenterDetailsPage.jsx";
import SavedPage from "./pages/SavedPage.jsx";
import RecyclerCenterPage from "./pages/RecyclerCenterPage.jsx";
import RecyclingDashboardPage from "./pages/admin/RecyclingDashboardPage.jsx";
import AdminWasteGuidesPage from "./pages/admin/AdminWasteGuidesPage.jsx";
import AdminWasteGuideFormPage from "./pages/admin/AdminWasteGuideFormPage.jsx";
import AdminRecyclingCentersPage from "./pages/admin/AdminRecyclingCentersPage.jsx";
import AdminRecyclingCenterFormPage from "./pages/admin/AdminRecyclingCenterFormPage.jsx";
import AdminCenterReportsPage from "./pages/admin/AdminCenterReportsPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { LowDataProvider } from "./context/LowDataContext.jsx";
import CitizenBottomNav from "./components/recycling/CitizenBottomNav.jsx";
import LanguageSwitcher from "./components/recycling/LanguageSwitcher.jsx";
import "./i18n.js";

/**
 * App — root component for CleanLanka.
 *
 * Component 3: /recycling-guide, /recycling-centers, /saved, /admin/recycling-*
 */
function App() {
  return (
    <AuthProvider>
      <LowDataProvider>
        <BrowserRouter>
          <LanguageSwitcher />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/my-reports" element={<MyReportsPage />} />
            <Route path="/dashboard" element={<MunicipalDashboardPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/guide" element={<Navigate to="/recycling-guide" replace />} />
            <Route path="/recycling-guide" element={<RecyclingGuidePage />} />
            <Route path="/recycling-guide/:id" element={<WasteGuideDetailsPage />} />
            <Route path="/recycling-centers" element={<RecyclingCentersPage />} />
            <Route path="/recycling-centers/map" element={<RecyclingCentersMapPage />} />
            <Route path="/recycling-centers/:id" element={<RecyclingCenterDetailsPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/my-recycling-centers" element={<Navigate to="/saved" replace />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/recycler" element={<RecyclerPage />} />
            <Route path="/recycler/center" element={<RecyclerCenterPage />} />

            <Route path="/admin/recycling-dashboard" element={<RecyclingDashboardPage />} />
            <Route path="/admin/waste-guides" element={<AdminWasteGuidesPage />} />
            <Route path="/admin/waste-guides/new" element={<AdminWasteGuideFormPage />} />
            <Route path="/admin/waste-guides/:id/edit" element={<AdminWasteGuideFormPage />} />
            <Route path="/admin/recycling-centers" element={<AdminRecyclingCentersPage />} />
            <Route
              path="/admin/recycling-centers/new"
              element={<AdminRecyclingCenterFormPage />}
            />
            <Route
              path="/admin/recycling-centers/:id/edit"
              element={<AdminRecyclingCenterFormPage />}
            />
            <Route path="/admin/center-reports" element={<AdminCenterReportsPage />} />

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
          <CitizenBottomNav />
        </BrowserRouter>
      </LowDataProvider>
    </AuthProvider>
  );
}

export default App;
