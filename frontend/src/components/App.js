import '../styles/App.css';
import { useState } from 'react';
import LoginPage from './LoginPage';
import MemberDashboard from './MemberDashboard';
import PaymentReviewForm from './PaymentReviewForm';
import ChargeDetails from './ChargeDetails';
import AppShell from './AppShell';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const showDashboard = () => setCurrentPage('dashboard');
  const showLogin = () => setCurrentPage('login');
  const showReview = () => setCurrentPage('review');
  const showChargeDetails = () => setCurrentPage('chargeDetails');

  let pageContent;
  switch (currentPage) {
    case 'dashboard':
      pageContent = <MemberDashboard />;
      break;
    case 'review':
      pageContent = <PaymentReviewForm onBack={showDashboard} />;
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
