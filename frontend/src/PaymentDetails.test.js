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

test('amount is prefixed with dollar sign', () => {
  const payment = {
    amount: 25,
    date: '2025-01-02',
    status: 'Approved',
    memo: '',
    adminNote: '',
    platform: 'Cash'
  };
  render(<PaymentDetails payment={payment} />);
  expect(screen.getByText('$25')).toBeInTheDocument();
});
