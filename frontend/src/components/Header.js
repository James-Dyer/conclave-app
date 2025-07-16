import '../styles/Header.css';
import PrimaryButton from './PrimaryButton';
import NavTab from './NavTab';

export default function Header({
  onShowLogin,
  onShowDashboard,
  onShowActivity,
  onShowManageCharges,
  onShowManagePayments,
  onShowMembers,
  onLogout,
  currentPage,
}) {
  return (
    <header className="header">
      <nav className="nav">
        <span className="brand">Conclave ΣΧ-ΛΔ</span>
        <div className="nav-tabs">
          {onShowDashboard && (
            <NavTab
              className="dashboard-tab"
              active={currentPage === 'dashboard' || currentPage === 'admin'}
              onClick={onShowDashboard}
            >
              Dashboard
            </NavTab>
          )}
          {onShowActivity && (
            <NavTab
              className="activity-tab"
              active={currentPage === 'activity'}
              onClick={onShowActivity}
            >
              Account Activity
            </NavTab>
          )}
          {onShowManageCharges && (
            <NavTab
              className="charges-tab"
              active={currentPage === 'manageCharges'}
              onClick={onShowManageCharges}
            >
              Manage Charges
            </NavTab>
          )}
          {onShowManagePayments && (
            <NavTab
              className="payments-tab"
              active={currentPage === 'managePayments'}
              onClick={onShowManagePayments}
            >
              Manage Payments
            </NavTab>
          )}
          {onShowMembers && (
            <NavTab
              className="members-tab"
              active={currentPage === 'members'}
              onClick={onShowMembers}
            >
              Manage Members
            </NavTab>
          )}
        </div>
        <div className="nav-actions">
          <PrimaryButton
            type="button"
            className="logout-button"
            onClick={onLogout}
            style={{ visibility: onLogout ? 'visible' : 'hidden' }}
            disabled={!onLogout}
          >
            Logout
          </PrimaryButton>
          {onShowLogin && (
            <PrimaryButton type="button" onClick={onShowLogin}>
              Login
            </PrimaryButton>
          )}
        </div>
      </nav>
    </header>
  );
}
