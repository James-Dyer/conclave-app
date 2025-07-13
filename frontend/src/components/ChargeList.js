import React from 'react';
import DataTable from './DataTable';
import '../styles/ChargeList.css';

export default function ChargeList({
  charges = [],
  onRequestReview = () => {},
  onViewDetails = () => {},
  pendingReviewIds = [],
  loading = false,
}) {
  const visible = (charges || []).filter(
    (c) => c.status !== 'Paid' && c.status !== 'Deleted by Admin'
  );

  if (!loading && visible.length === 0) {
    return <div className="charge-list-empty">No charges found.</div>;
  }

  const columns = [
    { header: 'Description', accessor: 'description' },
    { header: 'Original Amount', accessor: 'amount' },
    { header: 'Due Date', accessor: 'dueDate' },
    { header: 'Status', accessor: 'statusDisplay' },
    { header: 'Partial Amount Paid', accessor: 'partial' }
  ];

  const rows = visible.map((charge) => {
    const pending = pendingReviewIds.includes(charge.id);
    const effectiveStatus = pending ? 'Under Review' : charge.status;
    const statusDisplay = effectiveStatus;
    return {
      id: charge.id,
      description: charge.description || '-',
      amount: charge.amount,
      dueDate: new Date(charge.dueDate).toLocaleDateString(),
      statusDisplay,
      partial: charge.partialAmountPaid > 0 ? charge.partialAmountPaid : '',
      original: charge
    };
  });

  return (
    <DataTable
      loading={loading}
      columns={columns}
      data={rows}
      renderActions={(row) => (
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() =>
              onViewDetails({
                id: row.original.id,
                status: row.original.status,
                amount: row.original.amount,
                dueDate: row.original.dueDate
              })
            }
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded"
          >
            Details
          </button>
        </div>
      )}
    />
  );
}
