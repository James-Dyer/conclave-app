import { useEffect, useState } from 'react';
import useApi from '../apiClient';
import '../styles/AdminDashboard.css';

export default function AdminDashboard({ onShowMembers, onShowCharges }) {
  const api = useApi();
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

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

  async function handleApprove(id) {
    await api.approvePayment(id);
    setReviews(reviews.filter((rev) => rev.id !== id));
  }

  async function handleReject(id) {
    await api.denyPayment(id);
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
                  <button onClick={() => handleApprove(r.id)}>Approve</button>
                  <button onClick={() => handleReject(r.id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
