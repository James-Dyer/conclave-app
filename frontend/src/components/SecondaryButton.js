import '../styles/Button.css';

export default function SecondaryButton({ children, className = '', ...props }) {
  return (
    <button className={`secondary-button ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
