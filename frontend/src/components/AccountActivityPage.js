import { useState, useEffect } from 'react';
import ChargeList from './ChargeList';
import PaymentList from './PaymentList';
import useApi from '../apiClient';
import { useAuth } from '../AuthContext';
import '../styles/AccountActivityPage.css';

export default function AccountActivityPage({ onBack }) {
  const api = useApi();
  const { token } = useAuth();
  const [charges, setCharges] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    async function load() {
      try {
        const [c, p] = await Promise.all([
          api.fetchCharges(),
          api.fetchPayments()
        ]);
        if (c) setCharges(c);
        if (p) setPayments(p);
      } catch (err) {
        console.error('API error', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token, api]);

  const sortedCharges = [...charges].sort(
    (a, b) => new Date(b.dueDate) - new Date(a.dueDate)
  );
  const sortedPayments = [...payments].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="account-activity-page">
      <header className="member-dash-header">
        <h1>Account Activity</h1>
        {onBack && (
          <button onClick={onBack} className="back-button">
            Back
          </button>
        )}
      </header>
      <section>
        <h2>All Charges</h2>
        <ChargeList charges={sortedCharges} loading={loading} />
      </section>
      <section>
        <h2>Payment History</h2>
        <PaymentList payments={sortedPayments} loading={loading} />
      </section>
    </div>
  );
}
