import Header from './Header';
import NotificationContainer from './NotificationContainer';
import '../styles/AppShell.css';

export default function AppShell({ children, onShowLogin, onLogout }) {
  return (
    <div className="app-shell">
      <Header onShowLogin={onShowLogin} onLogout={onLogout} />
      <NotificationContainer />
      <main className="app-content">{children}</main>
    </div>
  );
}
