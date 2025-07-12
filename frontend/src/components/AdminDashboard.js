import { useEffect, useState } from 'react';
import useApi from '../apiClient';
import ConfirmDialog from './ConfirmDialog';
import '../styles/AdminDashboard.css';

export default function AdminDashboard({ onShowMembers, onShowCharges }) {
  const api = useApi();
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [reviewToApprove, setReviewToApprove] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const r = await api.fetchPendingPayments();
        setReviews(r || []);
      } catch (e) {
        setError(e.message);
      }
    }
    load();
  }, []);

  function openApproveDialog(review) {
    setReviewToApprove(review);
  }

  async function confirmApprove() {
    if (!reviewToApprove) return;
    await api.approvePayment(reviewToApprove.id);
    setReviews(reviews.filter((rev) => rev.id !== reviewToApprove.id));
    setReviewToApprove(null);
  }

  async function handleReject(id) {
    const note = window.prompt('Reason for denial?');
    if (!note) return;
    await api.denyPayment(id, note);
    setReviews(reviews.filter((rev) => rev.id !== id));
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-dash-header">
        <h1>Admin Dashboard</h1>
      </header>
      {error && <div className="error">{error}</div>}
      <section className="quick-links">
        <button className="quick-link" onClick={onShowMembers}>
          Members
          <span className="desc">Browse and manage all member accounts</span>
        </button>
        <button className="quick-link" onClick={onShowCharges}>
          Charges
          <span className="desc">View and update all assigned charges</span>
        </button>
      </section>
      <section>
        <h2>Payment Reviews</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Charge Description</th>
              <th>Original Amount</th>
              <th>Amount Paid</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td>{r.chargeDescription}</td>
                <td>{r.originalAmount}</td>
                <td>{r.amountPaid ?? r.amount}</td>
                <td className="flex space-x-2">
                  <button onClick={() => openApproveDialog(r)}>Approve</button>
                  <button onClick={() => handleReject(r.id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <ConfirmDialog
        open={!!reviewToApprove}
        title="Approve Payment"
        confirmText="Approve"
        cancelText="Cancel"
        onConfirm={confirmApprove}
        onCancel={() => setReviewToApprove(null)}
      >
        {reviewToApprove && (
          <div className="space-y-1">
            <div>
              <strong>Description:</strong> {reviewToApprove.chargeDescription}
            </div>
            <div>
              <strong>Original:</strong> {reviewToApprove.originalAmount}
            </div>
            <div>
              <strong>Amount Paid:</strong>{' '}
              {reviewToApprove.amountPaid ?? reviewToApprove.amount}
            </div>
          </div>
        )}
      </ConfirmDialog>
    </div>
  );
}
