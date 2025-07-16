import { render, screen } from '@testing-library/react';
import PaymentDetails from './components/PaymentDetails';

test('shows payment platform in details', () => {
  const payment = {
    amount: 50,
    date: '2025-01-01',
    status: 'Approved',
    memo: 'Dues',
    adminNote: '',
    platform: 'Venmo'
  };
  render(<PaymentDetails payment={payment} />);
  expect(screen.getByText(/venmo/i)).toBeInTheDocument();
});
