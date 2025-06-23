import '../styles/App.css';
import { useState } from 'react';
import LoginPage from './LoginPage';
import MemberDashboard from './MemberDashboard';
import PaymentReviewForm from './PaymentReviewForm';
import ChargeDetails from './ChargeDetails';
import AppShell from './AppShell';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [reviewCharge, setReviewCharge] = useState(null);

  const showDashboard = () => {
    setCurrentPage('dashboard');
    setReviewCharge(null);
  };
  const showLogin = () => setCurrentPage('login');
  const showReview = (charge) => {
    if (charge) {
      setReviewCharge(charge);
    }
    setCurrentPage('review');
  };
  const showChargeDetails = () => setCurrentPage('chargeDetails');

  let pageContent;
  switch (currentPage) {
    case 'dashboard':
      pageContent = <MemberDashboard onRequestReview={showReview} />;
      break;
    case 'review':
      pageContent = (
        <PaymentReviewForm charge={reviewCharge || undefined} onBack={showDashboard} />
      );
      break;
    case 'chargeDetails':
      pageContent = <ChargeDetails />;
      break;
    default:
      pageContent = <LoginPage />;
  }

  return (
    <AppShell
      onShowDashboard={showDashboard}
      onShowLogin={showLogin}
      onShowReview={showReview}
      onShowChargeDetails={showChargeDetails}
    >
      {pageContent}
    </AppShell>
  );
}

export default App;
