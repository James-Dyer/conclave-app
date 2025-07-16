import Header from './Header';
import NotificationContainer from './NotificationContainer';
import '../styles/AppShell.css';

export default function AppShell({
  children,
  onShowDashboard,
  onShowActivity,
  onLogout,
  isDarkMode,
  onToggleDarkMode,
}) {
  return (
    <div className="app-shell">
      <Header
        onShowDashboard={onShowDashboard}
        onShowActivity={onShowActivity}
        onLogout={onLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
      />
      <NotificationContainer />
      <main className="app-content">{children}</main>
    </div>
  );
}
