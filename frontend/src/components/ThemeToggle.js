import '../styles/ViewToggle.css';

export default function ThemeToggle({ isDark = false, onToggle }) {
  return (
    <div className="view-toggle" role="group">
      <button
        type="button"
        className={!isDark ? 'active' : ''}
        onClick={() => {
          if (isDark && onToggle) onToggle();
        }}
      >
        Light
      </button>
      <button
        type="button"
        className={isDark ? 'active' : ''}
        onClick={() => {
          if (!isDark && onToggle) onToggle();
        }}
      >
        Dark
      </button>
    </div>
  );
}
