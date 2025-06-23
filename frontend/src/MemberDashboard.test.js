import { render, screen } from '@testing-library/react';
import MemberDashboard from './components/MemberDashboard';

test('renders dashboard sections', () => {
  render(<MemberDashboard />);
  const chargesHeading = screen.getByRole('heading', { name: /outstanding charges/i });
  expect(chargesHeading).toBeInTheDocument();
  const paymentsHeading = screen.getByRole('heading', { name: /recent payments/i });
  expect(paymentsHeading).toBeInTheDocument();
});

test('shows review payment button for charges', () => {
  render(<MemberDashboard />);
  const reviewButtons = screen.getAllByRole('button', { name: /review payment/i });
  expect(reviewButtons.length).toBeGreaterThan(0);
});

test('shows details button for charges', () => {
  render(<MemberDashboard />);
  const detailButtons = screen.getAllByRole('button', { name: /details/i });
  expect(detailButtons.length).toBeGreaterThan(0);
});
