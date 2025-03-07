import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          © {new Date().getFullYear()} Todo App. Made with ❤️ by{' '}
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Your Name
          </a>
        </p>
      </div>
    </footer>
  );
}; 