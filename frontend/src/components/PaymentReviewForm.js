import { useState } from 'react';
import '../styles/PaymentReviewForm.css';
import useApi from '../apiClient';

const sampleCharge = { id: 1, amount: '$200' };

export default function PaymentReviewForm({ charge = sampleCharge, onBack }) {
  const [memo, setMemo] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const api = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.submitReview({
        chargeId: charge.id,
        amount: amountPaid,
        memo
      });
      setMessage('Review request submitted');
      setMemo('');
      setAmountPaid('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="payment-review-page">
      <h1>Payment Review</h1>
      <form onSubmit={handleSubmit} className="review-form">
        <div className="static-field">
          <strong>Charge ID:</strong> {charge.id}
        </div>
        <div className="static-field">
          <strong>Amount:</strong> {charge.amount}
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
