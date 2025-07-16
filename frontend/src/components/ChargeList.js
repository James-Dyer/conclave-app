import React from 'react';
import DataTable from './DataTable';
import '../styles/ChargeList.css';
import logo from '../assets/images/UC-Merced-SigmaChi-ExpectMore.svg';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import { getStatusCategory } from '../statusUtils';

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
    return (
      <div className="table-empty">
        <img src={logo} alt="" className="empty-illustration" />
        <p>Looks like you've got no outstanding charges.</p>
      </div>
    );
  }

  const columns = [
    { header: 'Description', accessor: 'description' },
    { header: 'Amount', accessor: 'amount' },
    { header: 'Due Date', accessor: 'dueDate' },
    { header: 'Status', accessor: 'statusDisplay' },
    { header: '', accessor: 'statusIndicator' }
  ];

  const rows = visible.map((charge) => {
    const pending = pendingReviewIds.includes(charge.id);
    const effectiveStatus = pending ? 'Under Review' : charge.status;
    const statusDisplay = effectiveStatus;
    const statusIndicator = (
      <span className={`status-circle ${getStatusCategory(effectiveStatus)}`} />
    );
    return {
      id: charge.id,
      description: charge.description || '-',
      amount: charge.amount,
      dueDate: new Date(charge.dueDate).toLocaleDateString(),
      statusDisplay,
      statusIndicator,
      original: charge
    };
  });

  return (
    <DataTable
      loading={loading}
      columns={columns}
      data={rows}
      onRowClick={(row) =>
        onViewDetails({
          id: row.original.id,
          status: row.original.status,
          amount: row.original.amount,
          dueDate: row.original.dueDate
        })
      }
    />
  );
}
