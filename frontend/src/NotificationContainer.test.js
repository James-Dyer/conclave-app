import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotificationContainer from './components/NotificationContainer';
import { useNotifications } from './NotificationContext';

jest.mock('./NotificationContext');

test('renders notifications from context', () => {
  const removeNotification = jest.fn();
  useNotifications.mockReturnValue({
    notifications: [{ id: 1, message: 'Hello' }],
    removeNotification,
  });
  render(<NotificationContainer />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});

test('close button removes notification', async () => {
  const removeNotification = jest.fn();
  useNotifications.mockReturnValue({
    notifications: [{ id: 2, message: 'Bye' }],
    removeNotification,
  });
  render(<NotificationContainer />);
  const button = screen.getByRole('button', { name: /close notification/i });
  await userEvent.click(button);
  expect(removeNotification).toHaveBeenCalledWith(2);
});
