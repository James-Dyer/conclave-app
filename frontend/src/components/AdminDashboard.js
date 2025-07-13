import { useEffect, useState } from 'react';
import useApi from '../apiClient';
import ConfirmDialog from './ConfirmDialog';
import '../styles/AdminDashboard.css';

export default function AdminDashboard({
  onCreateCharges,
  onShowMembers,
  onShowCharges
}) {
  const api = useApi();
  const [reviews, setReviews] = useState([]);
  const [members, setMembers] = useState({});
  const [error, setError] = useState('');
  const [reviewToApprove, setReviewToApprove] = useState(null);
  const [reviewToDeny, setReviewToDeny] = useState(null);
  const [denyNote, setDenyNote] = useState('');
  const [denyError, setDenyError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [r, m] = await Promise.all([
          api.fetchPendingPayments(),
          api.fetchMembers()
        ]);
        setReviews(r || []);
        const map = {};
        (m || []).forEach((mem) => {
          map[mem.id] = mem.name;
        });
        setMembers(map);
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

  function openDenyDialog(review) {
    setReviewToDeny(review);
    setDenyNote('');
    setDenyError('');
  }

  async function confirmDeny(note) {
    if (!reviewToDeny) return;
    if (!note) {
      setDenyError('Reason is required');
      return;
    }
    await api.denyPayment(reviewToDeny.id, note);
    setReviews(reviews.filter((rev) => rev.id !== reviewToDeny.id));
    setReviewToDeny(null);
    setDenyError('');
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-dash-header">
        <h1>Admin Dashboard</h1>
      </header>
      {error && <div className="error">{error}</div>}
      <section className="quick-links">
        <button className="quick-link" onClick={onCreateCharges}>
          Manage Charges
          <span className="desc">Assign, update, or delete charges to members</span>
        </button>
        <button className="quick-link" onClick={onShowMembers}>
          Manage Members
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
              <th>Member</th>
              <th>Amount Paid</th>
              <th>Payment Date</th>
              <th>Memo</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td>{members[r.memberId] || r.memberId}</td>
                <td>{r.amountPaid ?? r.amount}</td>
                <td>{new Date(r.date).toLocaleDateString()}</td>
                <td>{r.memo || '-'}</td>
                <td className="flex space-x-2">
                  <button onClick={() => openApproveDialog(r)}>Approve</button>
                  <button onClick={() => openDenyDialog(r)}>Reject</button>
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
              <strong>Member:</strong> {members[reviewToApprove.memberId] || reviewToApprove.memberId}
            </div>
            <div>
              <strong>Amount Paid:</strong> {reviewToApprove.amountPaid ?? reviewToApprove.amount}
            </div>
            <div>
              <strong>Payment Date:</strong> {new Date(reviewToApprove.date).toLocaleDateString()}
            </div>
            <div>
              <strong>Memo:</strong> {reviewToApprove.memo || '-'}
            </div>
          </div>
        )}
      </ConfirmDialog>
      <ConfirmDialog
        open={!!reviewToDeny}
        title="Deny Payment"
        confirmText="Deny"
        cancelText="Cancel"
        onConfirm={confirmDeny}
        onCancel={() => {
          setReviewToDeny(null);
          setDenyError('');
        }}
        inputLabel="Reason for denial"
        inputValue={denyNote}
        onInputChange={setDenyNote}
        errorText={denyError}
      >
        {reviewToDeny && (
          <div className="space-y-1">
            <div>
              <strong>Member:</strong> {members[reviewToDeny.memberId] || reviewToDeny.memberId}
            </div>
            <div>
              <strong>Amount Paid:</strong> {reviewToDeny.amountPaid ?? reviewToDeny.amount}
            </div>
            <div>
              <strong>Payment Date:</strong> {new Date(reviewToDeny.date).toLocaleDateString()}
            </div>
            <div>
              <strong>Memo:</strong> {reviewToDeny.memo || '-'}
            </div>
          </div>
        )}
      </ConfirmDialog>
    </div>
  );
}

