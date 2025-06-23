import Header from './Header';
import './AppShell.css';

export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-content">{children}</main>
    </div>
  );
}
