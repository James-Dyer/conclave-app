import { render, screen } from '@testing-library/react';
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
  const paymentsHeading = screen.getByRole('heading', { name: /recent payments/i });
  expect(paymentsHeading).toBeInTheDocument();
});

test('shows review payment button for charges', async () => {
  render(
    <AuthProvider>
      <MemberDashboard />
    </AuthProvider>
  );
  const reviewButtons = await screen.findAllByRole('button', { name: /request review/i });
  expect(reviewButtons.length).toBeGreaterThan(0);
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
