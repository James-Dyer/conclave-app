import '../styles/Header.css';

export default function Header({
  onShowDashboard,
  onShowLogin,
  onShowReview,
  onShowChargeDetails
}) {
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
          {onShowDashboard && (
            <button
              type="button"
              className="nav-button dashboard-nav-button"
              onClick={onShowDashboard}
            >
              Dashboard
            </button>
          )}
          {onShowReview && (
            <button
              type="button"
              className="nav-button review-nav-button"
              onClick={onShowReview}
            >
              Payment Review
            </button>
          )}
          {onShowChargeDetails && (
            <button
              type="button"
              className="nav-button charge-details-nav-button"
              onClick={onShowChargeDetails}
            >
              Charge Details
            </button>
          )}
          <a href="#" className="logout-link">Logout</a>
        </div>
      </nav>
    </header>
  );
}
