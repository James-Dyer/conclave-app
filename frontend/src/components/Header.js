import '../styles/Header.css';

export default function Header({ onShowDashboard, onShowLogin }) {
  return (
    <header className="header">
      <nav className="nav">
        <span className="brand">Conclave</span>
        <div className="nav-actions">
          {onShowLogin && (
            <button
              type="button"
              className="nav-button login-nav-button"
              onClick={onShowLogin}
            >
              Login
            </button>
          )}
          {onShowDashboard && (
            <button
              type="button"
              className="nav-button dashboard-nav-button"
              onClick={onShowDashboard}
            >
              Dashboard
            </button>
          )}
          <a href="#" className="logout-link">Logout</a>
        </div>
      </nav>
    </header>
  );
}
