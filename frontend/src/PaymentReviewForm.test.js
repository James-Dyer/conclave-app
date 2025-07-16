import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaymentReviewForm from './components/PaymentReviewForm';
import { AuthProvider } from './AuthContext';

function setupLocalStorage() {
  localStorage.setItem('authToken', 'token');
  localStorage.setItem('authUser', JSON.stringify({ id: 1 }));
}

afterEach(() => {
  jest.resetAllMocks();
  localStorage.clear();
});

test('successful submit shows confirmation message', async () => {
  setupLocalStorage();
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: async () => ({ success: true }) })
  );
  render(
    <AuthProvider>
      <PaymentReviewForm charge={{ id: 1, amount: 100 }} />
    </AuthProvider>
  );
  await userEvent.selectOptions(screen.getByLabelText(/platform/i), 'Zelle');
  const input = screen.getByLabelText(/amount paid/i);
  expect(input).toHaveValue(100);
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  expect(await screen.findByText(/submitted/i)).toBeInTheDocument();
});

test('failed submit shows error message', async () => {
  setupLocalStorage();
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: false, text: async () => 'Bad request' })
  );
  render(
    <AuthProvider>
      <PaymentReviewForm charge={{ id: 1, amount: 100 }} />
    </AuthProvider>
  );
  await userEvent.selectOptions(screen.getByLabelText(/platform/i), 'Zelle');
  const input = screen.getByLabelText(/amount paid/i);
  await userEvent.clear(input);
  await userEvent.type(input, '50');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  expect(await screen.findByText('Bad request')).toBeInTheDocument();
});

test('prefills amount for lump sum payment', async () => {
  setupLocalStorage();
  render(
    <AuthProvider>
      <PaymentReviewForm charge={{ amount: 250 }} />
    </AuthProvider>
  );
  await userEvent.selectOptions(screen.getByLabelText(/platform/i), 'Zelle');
  const input = screen.getByLabelText(/amount paid/i);
  expect(input).toHaveValue(250);
});

test('shows error on overpayment', async () => {
  setupLocalStorage();
  render(
    <AuthProvider>
      <PaymentReviewForm charge={{ id: 1, amount: 100 }} />
    </AuthProvider>
  );
  await userEvent.selectOptions(screen.getByLabelText(/platform/i), 'Zelle');
  const input = screen.getByLabelText(/amount paid/i);
  await userEvent.clear(input);
  await userEvent.type(input, '150');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  expect(
    await screen.findByText(/exceeds outstanding charges/i)
  ).toBeInTheDocument();
});

test('requires custom platform when other selected', async () => {
  setupLocalStorage();
  render(
    <AuthProvider>
      <PaymentReviewForm charge={{ id: 1, amount: 100 }} />
    </AuthProvider>
  );
  await userEvent.selectOptions(screen.getByLabelText(/platform/i), 'Other');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  expect(
    await screen.findByText(/payment platform is required/i)
  ).toBeInTheDocument();
});
