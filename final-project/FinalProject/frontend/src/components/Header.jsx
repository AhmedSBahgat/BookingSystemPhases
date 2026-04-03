import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/" className="logo">
          My Front Page
        </NavLink>

        <nav className="nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/form">Form</NavLink>
          <NavLink to="/submissions">Submissions</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
