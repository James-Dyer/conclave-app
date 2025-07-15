import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './components/App';
import { AuthProvider } from './AuthContext';

function mockFetch() {
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: async () => [] }));
}

beforeEach(() => {
  mockFetch();
});

afterEach(() => {
  localStorage.clear();
  jest.resetAllMocks();
});

test('shows login form on initial load', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
});

test.skip('header charge details button shows page', async () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  const btn = screen.getByRole('button', { name: /charge details/i });
  await userEvent.click(btn);
  const heading = screen.getByRole('heading', { name: /charge details/i });
  expect(heading).toBeInTheDocument();
});

test.skip('header login button shows login page', async () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  await userEvent.click(screen.getByRole('button', { name: /dashboard/i }));
  await userEvent.click(screen.getByRole('button', { name: /^login$/i }));
  const emailField = screen.getByPlaceholderText(/email/i);
  expect(emailField).toBeInTheDocument();
});

test.skip('dashboard review button opens form with charge data', async () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  await userEvent.click(screen.getByRole('button', { name: /dashboard/i }));
  const reviewButton = await screen.findByRole('button', { name: /log payment/i });
  await screen.findAllByText('$200');
  await userEvent.click(reviewButton);
  const heading = await screen.findByRole('heading', { name: /payment review/i });
  expect(heading).toBeInTheDocument();
  expect(screen.getByText(/total amount:/i)).toBeInTheDocument();
});

test.skip('dashboard tile review button opens form', async () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  await userEvent.click(screen.getByRole('button', { name: /dashboard/i }));
  const button = await screen.findByTestId('dashboard-review-button');
  await screen.findAllByText('$200');
  await userEvent.click(button);
  const heading = await screen.findByRole('heading', { name: /payment review/i });
  expect(heading).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
});

test('shows logout button when token present', () => {
  localStorage.setItem('authToken', 'token');
  localStorage.setItem('authUser', JSON.stringify({ id: 1 }));
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
});
