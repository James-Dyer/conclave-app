import '../styles/ViewToggle.css';

export default function ViewToggle({ isAdminView = false, onToggle }) {
  return (
    <div className="view-toggle" role="group">
      <button
        type="button"
        className={!isAdminView ? 'active' : ''}
        onClick={() => {
          if (isAdminView && onToggle) onToggle();
        }}
      >
        Member
      </button>
      <button
        type="button"
        className={isAdminView ? 'active' : ''}
        onClick={() => {
          if (!isAdminView && onToggle) onToggle();
        }}
      >
        Admin
      </button>
    </div>
  );
}
