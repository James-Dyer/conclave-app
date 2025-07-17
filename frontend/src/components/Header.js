import { useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);

  const hasMenuItems =
    onShowDashboard ||
    onShowActivity ||
    onShowManageCharges ||
    onShowManagePayments ||
    onShowMembers ||
    onShowLogin ||
    onLogout;

  function handleNavClick(cb) {
    return () => {
      setMenuOpen(false);
      if (cb) cb();
    };
  }

  const tabs = (
    <>
      {onShowDashboard && (
        <NavTab
          key="dashboard"
          className="dashboard-tab"
          active={currentPage === 'dashboard' || currentPage === 'admin'}
          onClick={handleNavClick(onShowDashboard)}
        >
          Dashboard
        </NavTab>
      )}
      {onShowActivity && (
        <NavTab
          key="activity"
          className="activity-tab"
          active={currentPage === 'activity'}
          onClick={handleNavClick(onShowActivity)}
        >
          Account Activity
        </NavTab>
      )}
      {onShowManageCharges && (
        <NavTab
          key="charges"
          className="charges-tab"
          active={currentPage === 'manageCharges'}
          onClick={handleNavClick(onShowManageCharges)}
        >
          Manage Charges
        </NavTab>
      )}
      {onShowManagePayments && (
        <NavTab
          key="payments"
          className="payments-tab"
          active={currentPage === 'managePayments'}
          onClick={handleNavClick(onShowManagePayments)}
        >
          Manage Payments
        </NavTab>
      )}
      {onShowMembers && (
        <NavTab
          key="members"
          className="members-tab"
          active={currentPage === 'members'}
          onClick={handleNavClick(onShowMembers)}
        >
          Manage Members
        </NavTab>
      )}
    </>
  );

  const actions = (
    <>
      <PrimaryButton
        type="button"
        className="logout-button"
        onClick={handleNavClick(onLogout)}
        style={{ visibility: onLogout ? 'visible' : 'hidden' }}
        disabled={!onLogout}
      >
        Logout
      </PrimaryButton>
      {onShowLogin && (
        <PrimaryButton type="button" onClick={handleNavClick(onShowLogin)}>
          Login
        </PrimaryButton>
      )}
    </>
  );

  return (
    <header className="header">
      <nav className="nav">
        <span className="brand">Conclave ΣΧ-ΛΔ</span>
        {hasMenuItems && (
          <button
            className="hamburger"
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            &#9776;
          </button>
        )}
        <div className="nav-tabs">{tabs}</div>
        <div className="nav-actions">{actions}</div>
        {menuOpen && hasMenuItems && (
          <div className="mobile-menu open">
            <div className="nav-tabs">{tabs}</div>
            <div className="nav-actions">{actions}</div>
          </div>
        )}
      </nav>
    </header>
  );
}
