import { Link, NavLink } from 'react-router-dom';

function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo">My Front Page</Link>

        <nav className="nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/form">Form</NavLink>
          <a href="/#features">Features</a>
          <a href="/#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
