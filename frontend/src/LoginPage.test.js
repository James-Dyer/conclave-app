import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './components/LoginPage';

// simple test to ensure the forgot email link opens the dialog

test('forgot email link opens help dialog', async () => {
  render(<LoginPage />);
  const link = screen.getByRole('link', { name: /forgot email/i });
  await userEvent.click(link);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
