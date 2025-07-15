import '../styles/App.css';
import { useState } from 'react';
import { useAuth } from '../AuthContext';
import LoginPage from './LoginPage';
import MemberDashboard from './MemberDashboard';
import AdminDashboard from './AdminDashboard';
import MembersList from './MembersList';
import ManageChargesPage from './ManageChargesPage';
import AddMember from './AddMember';
import PaymentReviewForm from './PaymentReviewForm';
import ChargeDetails from './ChargeDetails';
import AppShell from './AppShell';
import AccountActivityPage from './AccountActivityPage';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [reviewCharge, setReviewCharge] = useState(null);
  const [detailsCharge, setDetailsCharge] = useState(null);
  const [pendingReviewIds, setPendingReviewIds] = useState([]);
  const { setToken, setUser, user } = useAuth();

  const showDashboard = () => {
    setCurrentPage('dashboard');
    setReviewCharge(null);
    setDetailsCharge(null);
  };
  const showLogin = () => setCurrentPage('login');
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    showLogin();
  };
  const showAdmin = () => setCurrentPage('admin');
  const showMembersList = () => setCurrentPage('members');
  const showManageCharges = () => setCurrentPage('manageCharges');
  const showAddMember = () => setCurrentPage('addMember');
  const showActivity = () => setCurrentPage('activity');
  const showReview = (charge) => {
    if (charge) {
      setReviewCharge(charge);
    }
    setCurrentPage('review');
  };

  const markPendingReview = (id) => {
    if (!id) return;
    setPendingReviewIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
  };
  const showChargeDetails = (charge) => {
    if (charge) {
      setDetailsCharge(charge);
    }
    setCurrentPage('chargeDetails');
  };

  let pageContent;
  switch (currentPage) {
    case 'dashboard':
      pageContent = (
        <MemberDashboard
          onRequestReview={showReview}
          onViewDetails={showChargeDetails}
          pendingReviewIds={pendingReviewIds}
          onShowAdmin={user?.isAdmin ? showAdmin : undefined}
          onShowActivity={showActivity}
        />
      );
      break;
    case 'activity':
      pageContent = <AccountActivityPage onBack={showDashboard} />;
      break;
    case 'review':
      pageContent = (
        <PaymentReviewForm
          charge={reviewCharge || undefined}
          onBack={showDashboard}
          onSubmitted={markPendingReview}
        />
      );
      break;
    case 'chargeDetails':
      pageContent = (
        <ChargeDetails
          charge={detailsCharge || undefined}
          onRequestReview={showReview}
          onBack={showDashboard}
        />
      );
      break;
    case 'admin':
      pageContent = (
        <AdminDashboard
          onManageCharges={showManageCharges}
          onShowMembers={showMembersList}
          onShowMemberDashboard={showDashboard}
        />
      );
      break;
    case 'members':
      pageContent = (
        <MembersList onBack={showAdmin} onAdd={showAddMember} />
      );
      break;
    case 'manageCharges':
      pageContent = <ManageChargesPage onBack={showAdmin} />;
      break;
    case 'addMember':
      pageContent = <AddMember onCancel={showMembersList} />;
      break;
    default:
      pageContent = <LoginPage onLogin={showDashboard} />;
  }

  return (
    <AppShell
      onShowDashboard={showDashboard}
      onShowLogin={showLogin}
      onShowReview={showReview}
      onShowChargeDetails={showChargeDetails}
      onShowAdmin={user?.isAdmin ? showAdmin : undefined}
      onLogout={handleLogout}
    >
      {pageContent}
    </AppShell>
  );
}

export default App;
