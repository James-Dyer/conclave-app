import '../styles/Button.css';

export default function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button className={`primary-button ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
