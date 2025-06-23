import { render, screen } from '@testing-library/react';
import MemberDashboard from './components/MemberDashboard';

test('renders dashboard sections', () => {
  render(<MemberDashboard />);
  const chargesHeading = screen.getByRole('heading', { name: /outstanding charges/i });
  expect(chargesHeading).toBeInTheDocument();
  const paymentsHeading = screen.getByRole('heading', { name: /recent payments/i });
  expect(paymentsHeading).toBeInTheDocument();
});
