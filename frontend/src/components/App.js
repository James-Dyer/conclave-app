import '../styles/App.css';
import { useState } from 'react';
import { useAuth } from '../AuthContext';
import LoginPage from './LoginPage';
import MemberDashboard from './MemberDashboard';
import AdminDashboard from './AdminDashboard';
import MembersList from './MembersList';
import ChargesList from './ChargesList';
import CreateCharges from './CreateCharges';
import AddMember from './AddMember';
import PaymentReviewForm from './PaymentReviewForm';
import ChargeDetails from './ChargeDetails';
import AppShell from './AppShell';

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
  const showChargesList = () => setCurrentPage('charges');
  const showCreateCharges = () => setCurrentPage('createCharges');
  const showAddMember = () => setCurrentPage('addMember');
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
        />
      );
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
          onCreateCharges={showCreateCharges}
          onShowMembers={showMembersList}
          onShowCharges={showChargesList}
        />
      );
      break;
    case 'createCharges':
      pageContent = <CreateCharges onBack={showAdmin} />;
      break;
    case 'members':
      pageContent = (
        <MembersList onBack={showAdmin} onAdd={showAddMember} />
      );
      break;
    case 'addMember':
      pageContent = <AddMember onCancel={showMembersList} />;
      break;
    case 'charges':
      pageContent = <ChargesList onBack={showAdmin} />;
      break;
    case 'createCharges':
      pageContent = <CreateCharges onBack={showAdmin} />;
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
