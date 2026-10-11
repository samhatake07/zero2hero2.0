export default function Header() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <a className="logo" href="#">
          0→<span>Shipped</span>
        </a>
        <nav className="nav-links">
          <a href="#how">How it works</a>
        </nav>
        <a className="btn btn-small" href="#upload">
          Upload resume
        </a>
      </div>
    </header>
  );
}
