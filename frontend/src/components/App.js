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
import PaymentDetails from './PaymentDetails';
import AppShell from './AppShell';
import AccountActivityPage from './AccountActivityPage';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [reviewCharge, setReviewCharge] = useState(null);
  const [detailsCharge, setDetailsCharge] = useState(null);
  const [detailsPayment, setDetailsPayment] = useState(null);
  const [pendingReviewIds, setPendingReviewIds] = useState([]);
  const [isAdminView, setIsAdminView] = useState(false);
  const { token, setToken, setUser, user } = useAuth();

  const showMemberDashboard = () => {
    setIsAdminView(false);
    setCurrentPage('dashboard');
    setReviewCharge(null);
    setDetailsCharge(null);
  };
  const showAdminDashboard = () => {
    setIsAdminView(true);
    setCurrentPage('admin');
    setReviewCharge(null);
    setDetailsCharge(null);
  };
  const showDashboard = () => {
    if (isAdminView) {
      showAdminDashboard();
    } else {
      showMemberDashboard();
    }
  };
  const showLogin = () => setCurrentPage('login');
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setIsAdminView(false);
    showLogin();
  };
  const showAdmin = () => {
    setIsAdminView(true);
    setCurrentPage('admin');
  };
  const showMembersList = () => {
    setIsAdminView(true);
    setCurrentPage('members');
  };
  const showManageCharges = () => {
    setIsAdminView(true);
    setCurrentPage('manageCharges');
  };
  const showAddMember = () => {
    setIsAdminView(true);
    setCurrentPage('addMember');
  };
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

  const showPaymentDetails = (payment) => {
    if (payment) {
      setDetailsPayment(payment);
    }
    setCurrentPage('paymentDetails');
  };

  let pageContent;
  switch (currentPage) {
    case 'dashboard':
      pageContent = (
        <MemberDashboard
          onRequestReview={showReview}
          onViewChargeDetails={showChargeDetails}
          onViewPaymentDetails={showPaymentDetails}
          pendingReviewIds={pendingReviewIds}
          onShowAdmin={user?.isAdmin ? showAdmin : undefined}
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
    case 'paymentDetails':
      pageContent = (
        <PaymentDetails
          payment={detailsPayment || undefined}
          onBack={showDashboard}
        />
      );
      break;
    case 'admin':
      pageContent = (
        <AdminDashboard
          onManageCharges={showManageCharges}
          onShowMembers={showMembersList}
          onShowMemberDashboard={showMemberDashboard}
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
      onShowDashboard={token ? showDashboard : undefined}
      onShowActivity={token && !isAdminView ? showActivity : undefined}
      onLogout={token ? handleLogout : undefined}
    >
      {pageContent}
    </AppShell>
  );
}

export default App;
