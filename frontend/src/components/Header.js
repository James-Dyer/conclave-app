import '../styles/Header.css';
import PrimaryButton from './PrimaryButton';

export default function Header({
  onShowLogin,
  onShowDashboard,
  onShowAdmin,
  onShowReview,
  onShowChargeDetails,
  onShowActivity,
  onLogout,
}) {
  return (
    <header className="header">
      <nav className="nav">
        <span className="brand">Conclave ΣΧ-ΛΔ</span>
        <div className="nav-actions">
          {onShowLogin && (
            <PrimaryButton
              type="button"
              className="nav-button login-nav-button"
              onClick={onShowLogin}
            >
              Login
            </PrimaryButton>
          )}
          {onShowDashboard && (
            <PrimaryButton
              type="button"
              className="nav-button dashboard-nav-button"
              onClick={onShowDashboard}
            >
              Dashboard
            </PrimaryButton>
          )}
          {onShowActivity && (
            <PrimaryButton
              type="button"
              className="nav-button activity-nav-button"
              onClick={onShowActivity}
            >
              Account Activity
            </PrimaryButton>
          )}
          {onShowAdmin && (
            <PrimaryButton
              type="button"
              className="nav-button admin-nav-button"
              onClick={onShowAdmin}
            >
              Admin
            </PrimaryButton>
          )}
          {onShowReview && (
            <PrimaryButton
              type="button"
              className="nav-button review-nav-button"
              onClick={onShowReview}
            >
              Payment Review
            </PrimaryButton>
          )}
          {onShowChargeDetails && (
            <PrimaryButton
              type="button"
              className="nav-button charge-details-nav-button"
              onClick={onShowChargeDetails}
            >
              Charge Details
            </PrimaryButton>
          )}
          {onLogout && (
            <PrimaryButton type="button" className="nav-button logout-button" onClick={onLogout}>
              Logout
            </PrimaryButton>
          )}
        </div>
      </nav>
    </header>
  );
}
