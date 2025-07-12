import { getBalanceBreakdown } from './balanceUtils';

test('computes balance categories relative to reference date', () => {
  const charges = [
    { id: 1, status: 'Outstanding', amount: 50, dueDate: '2024-01-01' },
    { id: 2, status: 'Outstanding', amount: 75, dueDate: '2024-01-05' },
    { id: 3, status: 'Outstanding', amount: 100, dueDate: '2024-01-20' },
    { id: 4, status: 'Paid', amount: 200, dueDate: '2024-01-01' },
  ];
  const today = new Date('2024-01-03');
  const result = getBalanceBreakdown(charges, today);
  expect(result.totalBalance).toBe(225);
  expect(result.overdueBalance).toBe(50);
  expect(result.dueSoonBalance).toBe(75);
  expect(result.upcomingBalance).toBe(100);
});

test('accounts for partial payments', () => {
  const charges = [
    {
      id: 1,
      status: 'Partially Paid',
      amount: 100,
      partialAmountPaid: 25,
      dueDate: '2024-01-01'
    },
    { id: 2, status: 'Outstanding', amount: 50, dueDate: '2024-01-02' }
  ];
  const result = getBalanceBreakdown(charges, new Date('2024-01-03'));
  expect(result.totalBalance).toBe(125);
  expect(result.overdueBalance).toBe(125);
});
