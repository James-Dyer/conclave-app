import '../styles/App.css';
import { useState } from 'react';
import { useAuth } from '../AuthContext';
import LoginPage from './LoginPage';
import MemberDashboard from './MemberDashboard';
import AdminDashboard from './AdminDashboard';
import PaymentReviewForm from './PaymentReviewForm';
import ChargeDetails from './ChargeDetails';
import AppShell from './AppShell';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [reviewCharge, setReviewCharge] = useState(null);
  const [detailsCharge, setDetailsCharge] = useState(null);
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
  const showReview = (charge) => {
    if (charge) {
      setReviewCharge(charge);
    }
    setCurrentPage('review');
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
        />
      );
      break;
    case 'review':
      pageContent = (
        <PaymentReviewForm charge={reviewCharge || undefined} onBack={showDashboard} />
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
      pageContent = <AdminDashboard />;
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
