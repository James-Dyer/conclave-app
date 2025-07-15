import { useEffect, useState } from 'react';
import useApi from '../apiClient';
import SearchBar from './SearchBar';
import FilterMenu from './FilterMenu';
import ConfirmDialog from './ConfirmDialog';
import { useNotifications } from '../NotificationContext';
import '../styles/ManageCharges.css';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

const STATUS_OPTIONS = ['Active', 'Alumni', 'Inactive', 'Suspended', 'Expelled'];

export default function ManageCharges({ onBack }) {
  const api = useApi();
  const { addNotification } = useNotifications();
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const currentYear = new Date().getFullYear();
  const [dueDate, setDueDate] = useState(() => {
    const dt = new Date();
    dt.setDate(dt.getDate() + 30);
    return dt.toISOString().slice(0, 10);
  });
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.fetchMembers('');
        setMembers(data || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoadingMembers(false);
      }
    }
    load();
  }, [api]);

  const filteredMembers = members
    .filter((m) =>
      !search ? true :
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
    )
    .filter((m) =>
      statusFilter.length ? statusFilter.includes(m.status) : true
    );

  const toggleSelect = (id) => {
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
    );
  };

  const selectAllMatching = () => {
    setSelectedIds(Array.from(new Set([...selectedIds, ...filteredMembers.map((m) => m.id)])));
  };

  const handleDescriptionBlur = () => {
    if (!description.trim()) {
      setDescriptionError('Description is required');
    } else {
      setDescriptionError('');
    }
  };

  const nextDisabled = () => {
    if (step === 1) {
      return (
        !description.trim() ||
        !amount ||
        Number(amount) <= 0 ||
        !dueDate ||
        !!amountError ||
        !!descriptionError
      );
    }
    if (step === 2) {
      return selectedIds.length === 0;
    }
    return false;
  };

  const handleNext = () => {
    if (nextDisabled()) {
      setError('Please complete all required fields');
      return;
    }
    setError('');
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step === 1) {
      onBack && onBack();
    } else {
      setStep((s) => s - 1);
    }
  };

  const submit = async () => {
    setShowConfirm(false);
    try {
      for (const id of selectedIds) {
        await api.createCharge({
          memberId: id,
          amount: Number(amount),
          dueDate,
          description,
          status: 'Outstanding'
        });
      }
      addNotification(`Charges successfully assigned to ${selectedIds.length} members.`);
      onBack && onBack();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="manage-charges-page">
      <header>
        <h1>Manage Charges</h1>
        <div className="step-indicator">Step {step} of 3</div>
      </header>
      {error && <div className="error">{error}</div>}
      {step === 1 && (
        <form className="charge-form" onSubmit={(e) => e.preventDefault()}>
          <label>
            Description
            <textarea
              maxLength="255"
              placeholder={`e.g. Membership Dues - Spring ${currentYear}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
            />
            {descriptionError && <div className="error">{descriptionError}</div>}
          </label>
          <label>
            Amount
            <input
              type="text"
              value={amount}
              onChange={(e) => {
                const val = e.target.value;
                setAmount(val);
                if (val && !/^\d*\.?\d*$/.test(val)) {
                  setAmountError('Amount must be a number');
                } else {
                  setAmountError('');
                }
              }}
            />
            {amountError && <div className="error">{amountError}</div>}
          </label>
          <label>
            Due Date
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>
        </form>
      )}
      {step === 2 && (
        <div className="select-assignees">
          <div className="filters">
            <SearchBar value={search} onChange={setSearch} placeholder="Search members" />
            <FilterMenu
              statusOptions={STATUS_OPTIONS}
              selectedStatuses={statusFilter}
              tagOptions={[]}
              selectedTags={[]}
              onChangeStatuses={setStatusFilter}
              onChangeTags={() => {}}
            />
            <PrimaryButton type="button" onClick={selectAllMatching} disabled={filteredMembers.length === 0}>
              Select All Matching
            </PrimaryButton>
            <div className="selected-count">
              {selectedIds.length} of {members.length} members selected
            </div>
          </div>
          <div className="member-list">
            {loadingMembers ? (
              <div>Loading...</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={filteredMembers.length > 0 && filteredMembers.every((m) => selectedIds.includes(m.id))}
                        onChange={() => {
                          const all = filteredMembers.map((m) => m.id);
                          const allSelected = all.every((id) => selectedIds.includes(id));
                          if (allSelected) {
                            setSelectedIds(selectedIds.filter((id) => !all.includes(id)));
                          } else {
                            setSelectedIds(Array.from(new Set([...selectedIds, ...all])));
                          }
                        }}
                      />
                    </th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(m.id)}
                          onChange={() => toggleSelect(m.id)}
                        />
                      </td>
                      <td>{m.name}</td>
                      <td>{m.email}</td>
                      <td>{m.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="review-step">
          <div className="summary-card">
            <div>
              <strong>Description:</strong> {description}
            </div>
            <div>
              <strong>Amount:</strong> {amount}
            </div>
            <div>
              <strong>Due Date:</strong> {dueDate}
            </div>
            <div>
              <strong>Total Members:</strong> {selectedIds.length}
            </div>
          </div>
          <details>
            <summary>View Members</summary>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {members
                  .filter((m) => selectedIds.includes(m.id))
                  .map((m) => (
                    <tr key={m.id}>
                      <td>{m.name}</td>
                      <td>{m.email}</td>
                      <td>{m.status}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </details>
        </div>
      )}
      <div className="wizard-footer">
        <SecondaryButton type="button" onClick={handleBack}
          >Back</SecondaryButton>
        {step < 3 && (
          <PrimaryButton type="button" onClick={handleNext} disabled={nextDisabled()}>
            Next
          </PrimaryButton>
        )}
        {step === 3 && (
          <PrimaryButton type="button" onClick={() => setShowConfirm(true)}>
            Create Charge
          </PrimaryButton>
        )}
      </div>
      <ConfirmDialog
        open={showConfirm}
        title="Confirm Charges"
        confirmText="Create Charge"
        cancelText="Cancel"
        onConfirm={submit}
        onCancel={() => setShowConfirm(false)}
      >
        <p>
          Assign charge "{description}" of ${amount} due {dueDate} to {selectedIds.length} members?
        </p>
      </ConfirmDialog>
    </div>
  );
}
