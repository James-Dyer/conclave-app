import Header from './Header';
import '../styles/AppShell.css';

export default function AppShell({
  children,
  onShowDashboard,
  onShowLogin,
  onShowReview,
  onShowChargeDetails,
  onLogout
}) {
  return (
    <div className="app-shell">
      <Header
        onShowDashboard={onShowDashboard}
        onShowLogin={onShowLogin}
        onShowReview={onShowReview}
        onShowChargeDetails={onShowChargeDetails}
        onLogout={onLogout}
      />
      <main className="app-content">{children}</main>
    </div>
  );
}
