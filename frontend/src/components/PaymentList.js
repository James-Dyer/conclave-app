import React from 'react';
import DataTable from './DataTable';
import '../styles/PaymentList.css';
import logo from '../assets/images/UC-Merced-SigmaChi-ExpectMore.svg';

export default function PaymentList({ payments = [], loading = false, onViewDetails = () => {} }) {
  if (!loading && payments.length === 0) {
    return (
      <div className="table-empty">
        <img src={logo} alt="" className="empty-illustration" />
        <p>No payments recorded yet.</p>
      </div>
    );
  }

  const columns = [
    { header: 'Amount', accessor: 'amount' },
    { header: 'Paid On', accessor: 'paidDate' },
    { header: 'Status', accessor: 'status' }
  ];

  const rows = payments.map((p) => ({
    ...p,
    paidDate: new Date(p.date).toLocaleDateString(),
    original: p
  }));
  return (
    <DataTable
      columns={columns}
      data={rows}
      loading={loading}
      onRowClick={(row) => onViewDetails(row.original)}
    />
  );
}
