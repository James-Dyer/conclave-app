export function getBalanceBreakdown(charges, today = new Date()) {
  const unpaid = charges.filter(
    (c) => c.status !== 'Paid' && c.status !== 'Deleted by Admin'
  );

  const remaining = (c) =>
    Number(c.amount || 0) - Number(c.partialAmountPaid || 0);

  const totalBalance = unpaid.reduce((sum, c) => sum + remaining(c), 0);
  const overdueBalance = unpaid
    .filter((c) => new Date(c.dueDate) < today)
    .reduce((sum, c) => sum + remaining(c), 0);
  const dueSoonBalance = unpaid
    .filter((c) => {
      const due = new Date(c.dueDate);
      const diff = (due - today) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 7;
    })
    .reduce((sum, c) => sum + remaining(c), 0);
  const upcomingBalance = unpaid
    .filter((c) => {
      const due = new Date(c.dueDate);
      const diff = (due - today) / (1000 * 60 * 60 * 24);
      return diff > 7;
    })
    .reduce((sum, c) => sum + remaining(c), 0);
  return { totalBalance, overdueBalance, dueSoonBalance, upcomingBalance };
}
