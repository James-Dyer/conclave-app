export function getStatusCategory(status) {
  if (!status) return 'neutral';
  const s = status.toLowerCase();
  if (s.includes('denied') || s.includes('delinq')) return 'bad';
  if (s.includes('paid') || s.includes('approved')) return 'good';
  return 'neutral';
}
