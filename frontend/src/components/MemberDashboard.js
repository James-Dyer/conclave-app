import React, { useEffect, useState } from 'react';
import ChargeList from './ChargeList';
import PaymentList from './PaymentList';
import '../styles/MemberDashboard.css';
import ViewToggle from './ViewToggle';
import PrimaryButton from './PrimaryButton';
import useApi from '../apiClient';
import { useAuth } from '../AuthContext';
import { getBalanceBreakdown } from '../balanceUtils';

const CACHE_TTL_MS = 5 * 60 * 1000;

export default function MemberDashboard({
  onRequestReview = () => {},
  onViewChargeDetails = () => {},
  onViewPaymentDetails = () => {},
  pendingReviewIds = [],
  onShowAdmin,
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
    const now = Date.now();
    let usedCache = false;
    try {
      const cachedCharges = JSON.parse(localStorage.getItem('cachedCharges'));
      if (cachedCharges && now - cachedCharges.ts < CACHE_TTL_MS) {
        setChargeData(cachedCharges.data);
        usedCache = true;
      }
    } catch {}
    try {
      const cachedPayments = JSON.parse(localStorage.getItem('cachedPayments'));
      if (cachedPayments && now - cachedPayments.ts < CACHE_TTL_MS) {
        setPaymentData(cachedPayments.data);
        usedCache = true;
      }
    } catch {}
    if (usedCache) {
      setLoading(false);
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

  const underReviewCount = paymentData.filter(
    (p) => p.status === 'Under Review'
  ).length;

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
        {user?.isAdmin && onShowAdmin && (
          <ViewToggle isAdminView={false} onToggle={onShowAdmin} />
        )}
        <h1>{`Welcome${user?.name ? `, ${user.name}` : ''}!`}</h1>
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
        <div className="review-action">
          <PrimaryButton
            type="button"
            className="dashboard-review-button"
            data-testid="dashboard-review-button"
            disabled={loading || totalBalance === 0}
            onClick={() => onRequestReview({ amount: totalBalance })}
          >
            Mark as Paid
          </PrimaryButton>
          {underReviewCount > 0 && (
            <span
              className="under-review-notice"
              data-testid="under-review-notice"
            >
              {`You have ${underReviewCount} payment${underReviewCount > 1 ? 's' : ''} under review`}
            </span>
          )}
        </div>
      </div>

      <div className="dashboard-content">
        <section className="tables-section">
          <h2>Outstanding Charges</h2>
          <ChargeList
            charges={sortedOutstanding}
            onViewDetails={onViewChargeDetails}
            pendingReviewIds={pendingReviewIds}
            loading={loading}
          />
        </section>

        <aside className="payments-section">
          <h2>Recent Payments</h2>
          <PaymentList
            payments={sortedPayments}
            loading={loading}
            onViewDetails={onViewPaymentDetails}
          />
        </aside>
      </div>
    </div>
  );
}
