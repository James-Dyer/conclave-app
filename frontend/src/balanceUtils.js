export function getBalanceBreakdown(charges, today = new Date()) {
  // 1) Only consider charges that can actually have a balance
  const unpaid = charges.filter(c => {
    if (['Outstanding', 'Delinquent', 'Partially Paid'].includes(c.status)) {
      return true;
    }
    if (c.status === 'Under Review') {
      const paid = Number(c.partialAmountPaid || 0);
      const amt = Number(c.amount || 0);
      return paid > 0 && paid < amt;
    }
    return false;
  });

  // 2) Compute “remaining” on each one
  const remaining = c =>
    Number(c.amount || 0) - Number(c.partialAmountPaid || 0);

  // 3) Totals
  const totalBalance = unpaid.reduce((sum, c) => sum + remaining(c), 0);

  const overdueBalance = unpaid
    .filter(c => new Date(c.dueDate) < today)
    .reduce((sum, c) => sum + remaining(c), 0);

  const dueSoonBalance = unpaid
    .filter(c => {
      const days = (new Date(c.dueDate) - today) / (1000 * 60 * 60 * 24);
      return days >= 0 && days <= 7;
    })
    .reduce((sum, c) => sum + remaining(c), 0);

  const upcomingBalance = unpaid
    .filter(c => {
      const days = (new Date(c.dueDate) - today) / (1000 * 60 * 60 * 24);
      return days > 7;
    })
    .reduce((sum, c) => sum + remaining(c), 0);

  return { totalBalance, overdueBalance, dueSoonBalance, upcomingBalance };
}
