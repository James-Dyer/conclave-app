import React from 'react';
import '../styles/ConfirmDialog.css';
import PrimaryButton from './PrimaryButton';

export default function InfoDialog({ open = false, title = '', children, onClose }) {
  if (!open) return null;
  return (
    <div className="confirm-dialog-overlay" role="dialog" aria-modal="true">
      <div className="confirm-dialog">
        <header className="confirm-dialog-header">
          <h2>{title}</h2>
          <button
            type="button"
            className="confirm-close"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className="confirm-dialog-body">{children}</div>
        <div className="confirm-dialog-actions">
          <PrimaryButton type="button" onClick={onClose} className="confirm-button">
            Close
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
