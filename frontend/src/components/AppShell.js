import Header from './Header';
import NotificationContainer from './NotificationContainer';
import '../styles/AppShell.css';

export default function AppShell({
  children,
  onShowDashboard,
  onShowLogin,
  onShowReview,
  onShowChargeDetails,
  onShowAdmin,
  onLogout
}) {
  return (
    <div className="app-shell">
      <Header
        onShowDashboard={onShowDashboard}
        onShowLogin={onShowLogin}
        onShowReview={onShowReview}
        onShowChargeDetails={onShowChargeDetails}
        onShowAdmin={onShowAdmin}
        onLogout={onLogout}
      />
      <NotificationContainer />
      <main className="app-content">{children}</main>
    </div>
  );
}
