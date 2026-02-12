import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer surface">
      <div className="footer-content">
        <p className="footer-brand">DocsGenius &copy; {new Date().getFullYear()}</p>
        <nav className="footer-nav">
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/articles" className="footer-link">Articles</Link>
          <Link to="/contact" className="footer-link">Contact</Link>
        </nav>
      </div>
    </footer>
  )
}
