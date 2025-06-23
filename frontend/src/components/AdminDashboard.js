import { useEffect, useState } from 'react';
import useApi from '../apiClient';
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
  const api = useApi();
  const [members, setMembers] = useState([]);
  const [charges, setCharges] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [m, c, r] = await Promise.all([
          api.fetchMembers(),
          api.fetchAllCharges(),
          api.fetchReviews()
        ]);
        setMembers(m || []);
        setCharges(c || []);
        setReviews(r || []);
      } catch (e) {
        setError(e.message);
      }
    }
    load();
  }, []);

  async function handleApprove(id) {
    await api.approveReview(id);
    setReviews(reviews.filter((rev) => rev.id !== id));
  }

  async function handleReject(id) {
    await api.rejectReview(id);
    setReviews(reviews.filter((rev) => rev.id !== id));
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {error && <div className="error">{error}</div>}
      <section>
        <h2>Members</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Admin</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td>{m.isAdmin ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h2>Charges</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Member</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {charges.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.memberId}</td>
                <td>{c.status}</td>
                <td>{c.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h2>Payment Reviews</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Charge</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.chargeId}</td>
                <td>{r.amount}</td>
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
