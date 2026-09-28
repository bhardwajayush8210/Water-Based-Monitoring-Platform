import { Navigate } from "react-router-dom";

const dashboardByRole = {
  ADMIN: "/admin/dashboard",
  COMMUNITY_ADMIN: "/community/dashboard",
  RESIDENT: "/resident/dashboard",
};

// requireApproved: set true on Community Admin routes OTHER than the
// dashboard itself. An unapproved admin can still reach their dashboard
// (which shows a "pending" screen) but nothing else.
function ProtectedRoute({ children, role, requireApproved = false }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const approved = localStorage.getItem("approved");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && role !== userRole) {
    return <Navigate to={dashboardByRole[userRole] || "/"} replace />;
  }

  if (
    requireApproved &&
    userRole === "COMMUNITY_ADMIN" &&
    approved !== "true"
  ) {
    return <Navigate to="/community/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
