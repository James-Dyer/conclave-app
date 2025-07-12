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

  const totalBalance = chargeData
    .filter((c) => c.status !== 'Paid')
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
        <button
          type="button"
          className="dashboard-review-button"
          data-testid="dashboard-review-button"
          onClick={() => onRequestReview()}
        >
          Mark as Paid
        </button>
      </div>

      <section>
        <h2>Outstanding Charges</h2>
        <ChargeList
          charges={chargeData}
          onRequestReview={onRequestReview}
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
