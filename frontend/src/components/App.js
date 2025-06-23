import '../styles/App.css';
import { useState } from 'react';
import LoginPage from './LoginPage';
import MemberDashboard from './MemberDashboard';
import AppShell from './AppShell';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  const handleShowDashboard = () => setShowDashboard(true);
  const handleShowLogin = () => setShowDashboard(false);

  return (
    <AppShell onShowDashboard={handleShowDashboard} onShowLogin={handleShowLogin}>
      {showDashboard ? (
        <MemberDashboard />
      ) : (
        <LoginPage />
      )}
    </AppShell>
  );
}

export default App;
