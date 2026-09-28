import Sidebar from "../components/layout/Sidebar";
import AdminSidebar from "../components/layout/AdminSidebar";
import TopNavbar from "../components/layout/TopNavbar";
import { Tools } from "react-bootstrap-icons";

// role: "COMMUNITY_ADMIN" (default) or "ADMIN" - decides which sidebar/theme to use
function ComingSoon({ title, role = "COMMUNITY_ADMIN" }) {
  const SidebarComponent = role === "ADMIN" ? AdminSidebar : Sidebar;

  return (
    <>
      <SidebarComponent />
      <TopNavbar title={title} subtitle="Coming soon" />

      <div className="wm-page">
        <div className="wm-empty-state">
          <div className="wm-empty-icon">
            <Tools size={24} />
          </div>
          <h5>{title}</h5>
          <p>This module is on the way. Check back soon.</p>
        </div>
      </div>

      <style>{`
        .wm-page {
          margin-left: 252px;
          padding: 96px 28px 32px;
          background: var(--wm-bg, #F6F8FB);
          min-height: 100vh;
          font-family: var(--wm-font-body, 'Inter', sans-serif);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wm-empty-state {
          text-align: center;
          max-width: 360px;
        }
        .wm-empty-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--wm-accent-soft, #E3FBF6);
          color: var(--wm-accent-dark, #0D9488);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .wm-empty-state h5 {
          font-family: var(--wm-font-display, 'Space Grotesk', sans-serif);
          font-weight: 700;
          color: var(--wm-ink, #0F172A);
          margin-bottom: 6px;
        }
        .wm-empty-state p {
          font-size: 13.5px;
          color: var(--wm-muted, #64748B);
          margin: 0;
        }
        @media (max-width: 991px) {
          .wm-page { margin-left: 0; padding: 90px 16px 24px; }
        }
      `}</style>
    </>
  );
}

export default ComingSoon;
