import '../styles/NavTab.css';

export default function NavTab({ active = false, children, className = '', ...props }) {
  return (
    <button
      className={`nav-tab ${active ? 'active' : ''} ${className}`.trim()}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
