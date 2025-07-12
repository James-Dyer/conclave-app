import React from 'react';
import '../styles/ConfirmDialog.css';

export default function ConfirmDialog({
  open = false,
  title = 'Confirm',
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  inputLabel,
  inputValue = '',
  onInputChange = () => {}
}) {
  if (!open) return null;
  const handleConfirm = () => {
    if (inputLabel) {
      onConfirm(inputValue);
    } else {
      onConfirm();
    }
  };
  return (
    <div className="confirm-dialog-overlay" role="dialog" aria-modal="true">
      <div className="confirm-dialog">
        <header className="confirm-dialog-header">
          <h2>{title}</h2>
          <button
            type="button"
            className="confirm-close"
            aria-label="Close"
            onClick={onCancel}
          >
            ×
          </button>
        </header>
        <div className="confirm-dialog-body">
          {children}
          {inputLabel && (
            <label className="confirm-input">
              {inputLabel}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
              />
            </label>
          )}
        </div>
        <div className="confirm-dialog-actions">
          <button type="button" onClick={handleConfirm} className="confirm-button">
            {confirmText}
          </button>
          <button type="button" onClick={onCancel} className="cancel-button">
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
