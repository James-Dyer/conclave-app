import { useEffect, useState } from 'react';
import useApi from '../apiClient';
import ConfirmDialog from './ConfirmDialog';
import DataTable from './DataTable';
import ViewToggle from './ViewToggle';
import '../styles/AdminDashboard.css';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

const CACHE_TTL_MS = 5 * 60 * 1000;
const DENY_NOTE_LIMIT = 50;

export default function AdminDashboard({
  onManageCharges,
  onShowMembers,
  onShowMemberDashboard,
  onViewPaymentDetails
}) {
  const api = useApi();
  const [reviews, setReviews] = useState([]);
  const [members, setMembers] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [reviewToApprove, setReviewToApprove] = useState(null);
  const [reviewToDeny, setReviewToDeny] = useState(null);
  const [denyNote, setDenyNote] = useState('');
  const [denyError, setDenyError] = useState('');

  useEffect(() => {
    const now = Date.now();
    let usedCache = false;
    try {
      const cachedReviews = JSON.parse(
        localStorage.getItem('cachedPendingPayments')
      );
      if (cachedReviews && now - cachedReviews.ts < CACHE_TTL_MS) {
        setReviews(cachedReviews.data);
        usedCache = true;
      }
    } catch {}
    try {
      const cachedMembers = JSON.parse(
        localStorage.getItem('cachedAdminMembers')
      );
      if (cachedMembers && now - cachedMembers.ts < CACHE_TTL_MS) {
        const map = {};
        cachedMembers.data.forEach((mem) => {
          map[mem.id] = mem.name;
        });
        setMembers(map);
        usedCache = true;
      }
    } catch {}
    if (usedCache) {
      setLoading(false);
    }
    async function load(skipLoading) {
      if (!skipLoading) {
        setLoading(true);
      }
      try {
        const [r, m] = await Promise.all([
          api.fetchPendingPayments(),
          api.fetchAdminMembers()
        ]);
        setReviews(r || []);
        if (r) {
          localStorage.setItem(
            'cachedPendingPayments',
            JSON.stringify({ ts: Date.now(), data: r })
          );
        }
        const map = {};
        (m || []).forEach((mem) => {
          map[mem.id] = mem.name;
        });
        setMembers(map);
        if (m) {
          localStorage.setItem(
            'cachedAdminMembers',
            JSON.stringify({ ts: Date.now(), data: m })
          );
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load(usedCache);
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

  const handleDenyNoteChange = (val) => {
    setDenyNote(val);
    if (val.length > DENY_NOTE_LIMIT) {
      setDenyError(`Maximum ${DENY_NOTE_LIMIT} characters allowed`);
    } else {
      setDenyError('');
    }
  };

  async function confirmDeny(note) {
    if (!reviewToDeny) return;
    if (!note) {
      setDenyError('Reason is required');
      return;
    }
    if (note.length > DENY_NOTE_LIMIT) {
      setDenyError(`Maximum ${DENY_NOTE_LIMIT} characters allowed`);
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
        {onShowMemberDashboard && (
          <ViewToggle isAdminView={true} onToggle={onShowMemberDashboard} />
        )}
        <h1>Admin Dashboard</h1>
      </header>
      {error && <div className="error">{error}</div>}
      <section className="reviews-section">
        <h2>Payment Reviews</h2>
        <DataTable
          loading={loading}
          columns={[
            { header: 'Member', accessor: 'member' },
            { header: 'Amount Paid', accessor: 'amount' },
            { header: 'Payment Date', accessor: 'date' },
            { header: 'Platform', accessor: 'platform' },
            { header: 'Memo', accessor: 'memo' }
          ]}
          data={reviews.map((r) => ({
            id: r.id,
            member: members[r.memberId] || r.memberId,
            amount: r.amountPaid ?? r.amount,
            date: new Date(r.date).toLocaleDateString(),
            platform: r.platform || '-',
            memo: r.memo || '-',
            original: r
          }))}
          renderActions={(row) => (
            <div className="action-buttons">
              <SecondaryButton
                onClick={(e) => {
                  e.stopPropagation();
                  openApproveDialog(row.original);
                }}
              >
                Approve
              </SecondaryButton>
              <SecondaryButton
                onClick={(e) => {
                  e.stopPropagation();
                  openDenyDialog(row.original);
                }}
              >
                Reject
              </SecondaryButton>
            </div>
          )}
          onRowClick={
            onViewPaymentDetails
              ? (row) => onViewPaymentDetails(row.original)
              : undefined
          }
        />
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
        onInputChange={handleDenyNoteChange}
        errorText={denyError}
        maxLength={DENY_NOTE_LIMIT}
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

