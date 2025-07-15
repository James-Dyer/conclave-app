import React, { useEffect, useState } from 'react';
import ChargeList from './ChargeList';
import PaymentList from './PaymentList';
import '../styles/MemberDashboard.css';
import ViewToggle from './ViewToggle';
import PrimaryButton from './PrimaryButton';
import useApi from '../apiClient';
import { useAuth } from '../AuthContext';
import { getBalanceBreakdown } from '../balanceUtils';

export default function MemberDashboard({
  onRequestReview = () => {},
  onViewDetails = () => {},
  pendingReviewIds = [],
  onShowAdmin,
  onShowActivity,
}) {
  const [chargeData, setChargeData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();
  const { token, user } = useAuth();

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

  const mergedCharges = chargeData.map((c) =>
    pendingReviewIds.includes(c.id) ? { ...c, status: 'Under Review' } : c
  );

  const sortedOutstanding = mergedCharges
    .filter((c) => c.status !== 'Paid' && c.status !== 'Deleted by Admin')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const sortedPayments = [...paymentData].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  let breakdownError = false;
  let breakdown = {
    totalBalance: 0,
    overdueBalance: 0,
    dueSoonBalance: 0,
    upcomingBalance: 0
  };
  try {
    breakdown = getBalanceBreakdown(mergedCharges);
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
      <header className="member-dash-header">
        <h1>Dashboard</h1>
        {user?.isAdmin && onShowAdmin && (
          <ViewToggle isAdminView={false} onToggle={onShowAdmin} />
        )}
        {onShowActivity && (
          <PrimaryButton
            type="button"
            className="activity-button"
            onClick={onShowActivity}
          >
            Account Activity
          </PrimaryButton>
        )}
      </header>
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
        <PrimaryButton
          type="button"
          className="dashboard-review-button"
          data-testid="dashboard-review-button"
          disabled={loading || totalBalance === 0}
          onClick={() => onRequestReview({ amount: totalBalance })}
        >
          Mark as Paid
        </PrimaryButton>
      </div>

      <div className="dashboard-content">
        <section className="tables-section">
          <h2>Outstanding Charges</h2>
          <ChargeList
            charges={sortedOutstanding}
            onViewDetails={onViewDetails}
            pendingReviewIds={pendingReviewIds}
            loading={loading}
          />

          <h2>Recent Payments</h2>
          <PaymentList payments={sortedPayments} loading={loading} />
        </section>

        <aside className="activity-section">
          <h2>Activity</h2>
          <div className="activity-placeholder">Activity feed coming soon</div>
        </aside>
      </div>
    </div>
  );
}
