import '../styles/Header.css';

export default function Header({ onShowLogin, onLogout }) {
  return (
    <header className="header">
      <nav className="nav">
        <span className="brand">Conclave ΣΧ-ΛΔ</span>
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
          {onLogout && (
            <button type="button" className="nav-button logout-button" onClick={onLogout}>
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
