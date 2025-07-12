import { useState, useEffect } from 'react';
import '../styles/PaymentReviewForm.css';
import useApi from '../apiClient';
import { useNotifications } from '../NotificationContext';

const sampleCharge = { id: 1, amount: '$200', description: 'Charge' };

export default function PaymentReviewForm({
  charge = sampleCharge,
  onBack,
  onSubmitted
}) {
  const [memo, setMemo] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const api = useApi();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (charge && (charge.id || charge.amount)) {
      setAmountPaid(charge.amount);
      setPaymentDate(new Date().toISOString().split('T')[0]);
    } else {
      setAmountPaid('');
      setPaymentDate(new Date().toISOString().split('T')[0]);
    }
  }, [charge]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (Number(amountPaid) > Number(charge.amount)) {
      setError('Payment exceeds outstanding charges');
      return;
    }
    try {
      await api.submitReview({
        chargeId: charge.id,
        amount: amountPaid,
        memo,
        date: paymentDate
      });
      setMessage('Review request submitted');
      setMemo('');
      setAmountPaid('');
      setPaymentDate('');
      addNotification('Your payment review has been submitted successfully.');
      if (onSubmitted) onSubmitted(charge?.id);
      if (onBack) onBack();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="payment-review-page">
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
          Memo
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </label>
        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}
        <div className="form-actions">
          <button type="submit">Submit</button>
          {onBack && (
            <button type="button" onClick={onBack} className="back-button">
              Back
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
