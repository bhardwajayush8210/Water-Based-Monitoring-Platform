import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import UnifiedLogin from "./pages/UnifiedLogin";
import RegisterChoice from "./pages/RegisterChoice";
import InviteRegister from "./pages/InviteRegister";
import AdminDashboard from "./pages/AdminDashboard";
import PendingApprovals from "./pages/PendingApprovals";

import ResidentRegister from "./pages/ResidentRegister";
import ResidentDashboard from "./pages/ResidentDashboard";

import CommunityAdminDashboard from "./pages/CommunityAdminDashboard";
import CommunityAdminRegister from "./pages/CommunityAdminRegister";
import ApartmentManagement from "./pages/ApartmentManagement";
import ResidentManagement from "./pages/ResidentManagement";
import MyApartment from "./pages/MyApartment";
import CommunityUsageManagement from "./pages/CommunityUsageManagement";
import BillingManagement from "./pages/BillingManagement";
import CommunityAlerts from "./pages/CommunityAlerts";
import WaterPurchaseManagement from "./pages/WaterPurchaseManagement";
import BillingCycles from "./pages/BillingCycles";

import AdminCommunitiesOverview from "./pages/AdminCommunitiesOverview";

import CommunityTickets from "./pages/CommunityTickets";
import AdminTickets from "./pages/AdminTickets";

import ComingSoon from "./pages/ComingSoon";
import CommunityReports from "./components/CommunityReports";
import AdminReports from "./pages/AdminReports";
import AdminBillingOverview from "./pages/AdminBillingOverview";

import ProtectedRoute from "./components/common/ProtectedRoute";

// ✅ Chatbot Import
// import ChatBot from "./components/ChatBot";
import AquaTrackAI from "./components/AquaTrackAI";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<UnifiedLogin />} />

        <Route path="/register" element={<RegisterChoice />} />

        <Route path="/invite/:token" element={<InviteRegister />} />

        {/* Resident */}

        <Route path="/resident/register" element={<ResidentRegister />} />

        <Route
          path="/resident/dashboard"
          element={
            <ProtectedRoute role="RESIDENT">
              <ResidentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Community Admin */}

        <Route
          path="/community/register"
          element={<CommunityAdminRegister />}
        />

        <Route
          path="/community/dashboard"
          element={
            <ProtectedRoute role="COMMUNITY_ADMIN">
              <CommunityAdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community/residents"
          element={
            <ProtectedRoute role="COMMUNITY_ADMIN" requireApproved>
              <ResidentManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community/apartments"
          element={
            <ProtectedRoute role="COMMUNITY_ADMIN" requireApproved>
              <MyApartment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community/meter"
          element={
            <ProtectedRoute role="COMMUNITY_ADMIN" requireApproved>
              <CommunityUsageManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community/billing"
          element={
            <ProtectedRoute role="COMMUNITY_ADMIN" requireApproved>
              <BillingManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community/billing-cycles"
          element={
            <ProtectedRoute role="COMMUNITY_ADMIN" requireApproved>
              <BillingCycles />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community/alerts"
          element={
            <ProtectedRoute role="COMMUNITY_ADMIN" requireApproved>
              <CommunityAlerts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community/water-purchase"
          element={
            <ProtectedRoute role="COMMUNITY_ADMIN" requireApproved>
              <WaterPurchaseManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community/tickets"
          element={
            <ProtectedRoute role="COMMUNITY_ADMIN" requireApproved>
              <CommunityTickets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community/reports"
          element={
            <ProtectedRoute role="COMMUNITY_ADMIN" requireApproved>
              <CommunityReports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community/settings"
          element={
            <ProtectedRoute role="COMMUNITY_ADMIN" requireApproved>
              <ComingSoon title="Settings" />
            </ProtectedRoute>
          }
        />

        {/* Super Admin */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/pending-approvals"
          element={
            <ProtectedRoute role="ADMIN">
              <PendingApprovals />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/apartments"
          element={
            <ProtectedRoute role="ADMIN">
              <ApartmentManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/residents"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminCommunitiesOverview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/tickets"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminTickets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminReports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/billing-overview"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminBillingOverview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute role="ADMIN">
              <ComingSoon title="Settings" role="ADMIN" />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}

        <Route path="*" element={<LandingPage />} />
      </Routes>

      {/* ✅ Global Smart Water Billing Assistant */}
      <AquaTrackAI />
    </>
  );
}

export default App;
