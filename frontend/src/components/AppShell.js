import Header from './Header';
import '../styles/AppShell.css';

export default function AppShell({ children, onShowDashboard, onShowLogin }) {
  return (
    <div className="app-shell">
      <Header onShowDashboard={onShowDashboard} onShowLogin={onShowLogin} />
      <main className="app-content">{children}</main>
    </div>
  );
}
