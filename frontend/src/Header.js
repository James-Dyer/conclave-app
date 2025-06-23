import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <span className="brand">Conclave</span>
        <a href="#" className="logout-link">Logout</a>
      </nav>
    </header>
  );
}
