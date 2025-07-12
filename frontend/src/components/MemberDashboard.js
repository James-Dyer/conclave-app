import React, { useEffect, useState } from 'react';
import ChargeList from './ChargeList';
import PaymentList from './PaymentList';
import '../styles/MemberDashboard.css';
import useApi from '../apiClient';
import { useAuth } from '../AuthContext';
import { getBalanceBreakdown } from '../balanceUtils';

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

  let breakdownError = false;
  let breakdown = {
    totalBalance: 0,
    overdueBalance: 0,
    dueSoonBalance: 0,
    upcomingBalance: 0
  };
  try {
    breakdown = getBalanceBreakdown(chargeData);
  } catch {
    breakdownError = true;
  }
  const {
    totalBalance,
    overdueBalance,
    dueSoonBalance,
    upcomingBalance
  } = breakdown;

  return (
    <div className="member-dashboard">
      <h1>Dashboard</h1>

      <div className="balance-info" data-testid="balance-info">
        <div className="balance-summary">
          <div
            className="balance-card total"
            data-testid="total-balance"
          >
            <div className="amount">{`$${totalBalance}`}</div>
            <div className="label">Total Balance Due</div>
          </div>
          {!breakdownError && (
            <>
              <div
                className="balance-card overdue"
                data-testid="overdue-balance"
              >
                <div className="amount">{`$${overdueBalance}`}</div>
                <div className="label">Overdue</div>
              </div>
              <div
                className="balance-card due-soon"
                data-testid="due-soon-balance"
              >
                <div className="amount">{`$${dueSoonBalance}`}</div>
                <div className="label">Due Soon (≤7d)</div>
              </div>
              <div
                className="balance-card upcoming"
                data-testid="upcoming-balance"
              >
                <div className="amount">{`$${upcomingBalance}`}</div>
                <div className="label">Upcoming</div>
              </div>
            </>
          )}
          {breakdownError && (
            <div className="breakdown-error">Unable to calculate breakdown.</div>
          )}
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
          charges={chargeData.filter(
            (c) => c.status !== 'Paid' && c.status !== 'Deleted by Admin'
          )}
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
