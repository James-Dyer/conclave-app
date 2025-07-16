import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './components/App';
import { AuthProvider } from './AuthContext';

function setupFetch() {
  global.fetch = jest.fn((url) => {
    if (url.endsWith('/my-charges')) {
      return Promise.resolve({
        ok: true,
        json: async () => [
          {
            id: 1,
            status: 'Outstanding',
            amount: 200,
            dueDate: '2024-05-01',
            description: 'Semester dues'
          }
        ]
      });
    }
    if (url.endsWith('/payments')) {
      return Promise.resolve({
        ok: true,
        json: async () => [
          {
            id: 1,
            amount: 50,
            date: '2024-04-01',
            status: 'Approved',
            memo: 'Dues'
          }
        ]
      });
    }
    return Promise.resolve({ ok: true, json: async () => [] });
  });
}

function setupAuth() {
  localStorage.setItem('authToken', 'token');
  localStorage.setItem('authUser', JSON.stringify({ id: 1 }));
}

afterEach(() => {
  jest.resetAllMocks();
  localStorage.clear();
});

function renderApp() {
  setupFetch();
  setupAuth();
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

test('user can view charge details from dashboard', async () => {
  renderApp();
  await userEvent.click(screen.getByRole('button', { name: /^dashboard$/i }));
  await screen.findByText(/semester dues/i);
  const row = screen.getByText(/semester dues/i).closest('tr');
  await userEvent.click(row);
  expect(
    await screen.findByRole('heading', { name: /charge details/i })
  ).toBeInTheDocument();
  expect(screen.getByText('$200')).toBeInTheDocument();
});

test('user can view payment details from dashboard', async () => {
  renderApp();
  await userEvent.click(screen.getByRole('button', { name: /^dashboard$/i }));
  await screen.findByText('$50');
  const row = screen.getByText('$50').closest('tr');
  await userEvent.click(row);
  expect(
    await screen.findByRole('heading', { name: /payment details/i })
  ).toBeInTheDocument();
  expect(screen.getByText('50')).toBeInTheDocument();
});
