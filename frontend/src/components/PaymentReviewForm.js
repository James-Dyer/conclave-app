import { useState } from 'react';
import '../styles/PaymentReviewForm.css';
import { submitReview } from '../apiClient';

export default function PaymentReviewForm({ onBack }) {
  const [chargeId, setChargeId] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await submitReview({ chargeId, amount, memo });
      setMessage('Review request submitted');
      setChargeId('');
      setAmount('');
      setMemo('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="payment-review-page">
      <h1>Payment Review</h1>
      <form onSubmit={handleSubmit} className="review-form">
        <label>
          Charge ID
          <input
            type="text"
            value={chargeId}
            onChange={(e) => setChargeId(e.target.value)}
            required
          />
        </label>
        <label>
          Amount
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
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
