import React, { useEffect, useState } from 'react';
import ChargeList from './ChargeList';
import PaymentList from './PaymentList';
import '../styles/MemberDashboard.css';
import useApi from '../apiClient';
import { useAuth } from '../AuthContext';

export default function MemberDashboard({
  onRequestReview = () => {},
  onViewDetails = () => {},
  pendingReviewIds = [],
}) {
  const [chargeData, setChargeData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();
  const { token } = useAuth();

  useEffect(() => {
    window.api = api;
  }, [api]);

  // Load data from the API for the logged in member
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
        if (c) setChargeData(c);
        if (p) setPaymentData(p);
      } catch (err) {
        console.error('API error', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token, api]);


  // Render
  if (loading) {
    return <div>Loading…</div>;
  }

  const unpaidCharges = chargeData.filter((c) => c.status !== 'Paid');
  const totalBalance = unpaidCharges.reduce(
    (sum, c) => sum + Number(c.amount || 0),
    0
  );
  const today = new Date();
  const overdueBalance = unpaidCharges
    .filter((c) => new Date(c.dueDate) < today)
    .reduce((sum, c) => sum + Number(c.amount || 0), 0);
  const dueSoonBalance = unpaidCharges
    .filter((c) => {
      const due = new Date(c.dueDate);
      const diff = (due - today) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 7;
    })
    .reduce((sum, c) => sum + Number(c.amount || 0), 0);
  const upcomingBalance = unpaidCharges
    .filter((c) => {
      const due = new Date(c.dueDate);
      const diff = (due - today) / (1000 * 60 * 60 * 24);
      return diff > 7;
    })
    .reduce((sum, c) => sum + Number(c.amount || 0), 0);

  return (
    <div className="member-dashboard">
      <h1>Dashboard</h1>

      <div className="balance-info" data-testid="balance-info">
        <div className="balance-amount">{`$${totalBalance}`}</div>
        <div className="balance-text">
          Total balance due. Please send payment to the chapter Zelle and submit
          a payment review when complete.
        </div>
        <div className="balance-breakdown">
          <div>{`Overdue Balance: $${overdueBalance}`}</div>
          <div>{`Due Soon (≤7 days): $${dueSoonBalance}`}</div>
          <div>{`Upcoming (>7 days): $${upcomingBalance}`}</div>
        </div>
        <button
          type="button"
          className="dashboard-review-button"
          data-testid="dashboard-review-button"
          disabled={totalBalance === 0}
          onClick={() => onRequestReview({ amount: totalBalance })}
        >
          Mark as Paid
        </button>
      </div>

      <section>
        <h2>Outstanding Charges</h2>
        <ChargeList
          charges={chargeData}
          onViewDetails={onViewDetails}
          pendingReviewIds={pendingReviewIds}
        />
      </section>

      <section>
        <h2>Recent Payments</h2>
        <PaymentList payments={paymentData} />
      </section>
    </div>
  );
}
