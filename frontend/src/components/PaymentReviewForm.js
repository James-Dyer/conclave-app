import { useState, useEffect } from 'react';
import '../styles/PaymentReviewForm.css';
import useApi from '../apiClient';
import { useNotifications } from '../NotificationContext';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

const sampleCharge = { id: 1, amount: '$200', description: 'Charge' };

export default function PaymentReviewForm({
  charge = sampleCharge,
  onBack,
  onSubmitted
}) {
  const [memo, setMemo] = useState('');
  const [memoError, setMemoError] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [platform, setPlatform] = useState('');
  const [otherPlatform, setOtherPlatform] = useState('');
  const [loading, setLoading] = useState(false);
  const api = useApi();
  const { addNotification } = useNotifications();

  const MEMO_LIMIT = 50;

  useEffect(() => {
    if (charge && (charge.id || charge.amount)) {
      setAmountPaid(charge.amount);
      setPaymentDate(new Date().toISOString().split('T')[0]);
    } else {
      setAmountPaid('');
      setPaymentDate(new Date().toISOString().split('T')[0]);
    }
  }, [charge]);

  const handleMemoChange = (val) => {
    setMemo(val);
    if (val.length > MEMO_LIMIT) {
      setMemoError(`Maximum ${MEMO_LIMIT} characters allowed`);
    } else {
      setMemoError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    const plat = platform === 'Other' ? otherPlatform.trim() : platform;
    if (!plat) {
      setError('Payment platform is required');
      return;
    }
    if (Number(amountPaid) > Number(charge.amount)) {
      setError('Payment exceeds outstanding charges');
      return;
    }
    if (memo.length > MEMO_LIMIT) {
      setMemoError(`Maximum ${MEMO_LIMIT} characters allowed`);
      return;
    }
    try {
      await api.submitPayment({
        amount: amountPaid,
        memo,
        date: paymentDate
        , platform: plat
      });
      setMessage('Payment submitted');
      setMemo('');
      setAmountPaid('');
      setPaymentDate('');
      setPlatform('');
      setOtherPlatform('');
      addNotification('Your payment review has been submitted successfully.');
      if (onSubmitted) onSubmitted(charge?.id);
      if (onBack) onBack();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-review-page">
      <div className="review-card">
        <h1>Payment Review</h1>
        <form onSubmit={handleSubmit} className="review-form">
          <div className="static-field">
            <strong>Total Amount:</strong> {charge.amount}
          </div>
        <label>
          Amount Paid
          <input
            type="number"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
          />
        </label>
        <label>
          Payment Date
          <input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />
        </label>
        <label>
          Platform
          <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option value="" disabled>Select one</option>
            <option value="Zelle">Zelle</option>
            <option value="Venmo">Venmo</option>
            <option value="Debit/Credit">Debit/Credit</option>
            <option value="Cash">Cash</option>
            <option value="Other">Other</option>
          </select>
        </label>
        {platform === 'Other' && (
          <label>
            Specify Platform
            <input
              type="text"
              value={otherPlatform}
              onChange={(e) => setOtherPlatform(e.target.value)}
            />
          </label>
        )}
        <label>
          Memo
          <input
            type="text"
            value={memo}
            onChange={(e) => handleMemoChange(e.target.value)}
          />
          <div className="char-count">{memo.length}/{MEMO_LIMIT}</div>
          {memoError && <div className="error">{memoError}</div>}
        </label>
        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}
        <div className="form-actions">
          <PrimaryButton
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            <span className={loading ? 'hidden-text' : undefined}>Submit</span>
            {loading && <span className="spinner" aria-label="loading" />}
          </PrimaryButton>
          {onBack && (
            <SecondaryButton type="button" onClick={onBack} className="back-button">
              Back
            </SecondaryButton>
          )}
        </div>
      </form>
      </div>
    </div>
  );
}
