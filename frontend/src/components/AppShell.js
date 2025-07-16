import Header from './Header';
import NotificationContainer from './NotificationContainer';
import '../styles/AppShell.css';

export default function AppShell({
  children,
  onShowDashboard,
  onShowActivity,
  onShowManageCharges,
  onShowManagePayments,
  onShowMembers,
  onLogout,
  currentPage,
}) {
  return (
    <div className="app-shell">
      <Header
        onShowDashboard={onShowDashboard}
        onShowActivity={onShowActivity}
        onShowManageCharges={onShowManageCharges}
        onShowManagePayments={onShowManagePayments}
        onShowMembers={onShowMembers}
        onLogout={onLogout}
        currentPage={currentPage}
      />
      <NotificationContainer />
      <main className="app-content">{children}</main>
    </div>
  );
}
