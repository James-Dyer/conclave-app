import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MemberDashboard from './components/MemberDashboard';
import { AuthProvider } from './AuthContext';

// helper to mock fetch responses based on the requested url
function mockFetch() {
  global.fetch = jest.fn((url) => {
    if (url.endsWith('/my-charges')) {
      return Promise.resolve({
        ok: true,
        json: async () => [
          { id: 1, status: 'Outstanding', amount: 200, dueDate: '2024-05-01' }
        ]
      });
    }
    if (url.endsWith('/payments')) {
      return Promise.resolve({ ok: true, json: async () => [] });
    }
    return Promise.resolve({ ok: true, json: async () => [] });
  });
}

beforeEach(() => {
  localStorage.setItem('authToken', 'token');
  localStorage.setItem('authUser', JSON.stringify({ id: 1 }));
  mockFetch();
});

afterEach(() => {
  localStorage.clear();
  jest.resetAllMocks();
});

test('renders dashboard sections', async () => {
  render(
    <AuthProvider>
      <MemberDashboard />
    </AuthProvider>
  );
  const chargesHeading = await screen.findByRole('heading', {
    name: /outstanding charges/i
  });
  expect(chargesHeading).toBeInTheDocument();
  const paymentsHeading = screen.getByRole('heading', {
    name: /recent payments/i
  });
  expect(paymentsHeading).toBeInTheDocument();
  const total = screen.getByTestId('total-balance');
  expect(total).toHaveTextContent('$200');
  expect(screen.getByTestId('overdue-balance')).toHaveTextContent('$200');
});


test('shows details button for charges', async () => {
  render(
    <AuthProvider>
      <MemberDashboard />
    </AuthProvider>
  );
  const detailButtons = await screen.findAllByRole('button', { name: /details/i });
  expect(detailButtons.length).toBeGreaterThan(0);
});

test('dashboard payment review button triggers callback', async () => {
  const onRequestReview = jest.fn();
  render(
    <AuthProvider>
      <MemberDashboard onRequestReview={onRequestReview} />
    </AuthProvider>
  );
  await screen.findByTestId('total-balance');
  const button = screen.getByTestId('dashboard-review-button');
  await userEvent.click(button);
  expect(onRequestReview).toHaveBeenCalled();
});

test('pending review charges are excluded from totals', async () => {
  render(
    <AuthProvider>
      <MemberDashboard pendingReviewIds={[1]} />
    </AuthProvider>
  );
  const total = await screen.findByTestId('total-balance');
  expect(total).toHaveTextContent('$0');
});
