import './App.css';
import { useState } from 'react';
import LoginPage from './LoginPage';
import MemberDashboard from './MemberDashboard';
import AppShell from './AppShell';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <AppShell>
      {showDashboard ? (
        <MemberDashboard />
      ) : (
        <LoginPage onShowDashboard={() => setShowDashboard(true)} />
      )}
    </AppShell>
  );
}

export default App;
