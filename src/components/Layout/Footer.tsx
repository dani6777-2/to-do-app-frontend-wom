import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          © {new Date().getFullYear()} Todo App. Made with ❤️ by{' '}
          <a
            href="https://github.com/dani6777-2"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Daniel Morales 
          </a>
        </p>
      </div>
    </footer>
  );
}; 