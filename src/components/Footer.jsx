import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          Developer <span>Salwa</span>
        </div>
        <div className="footer-links">
          <a href="#hero" className="footer-link">Home</a>
          <a href="#about" className="footer-link">About</a>
          <a href="#skills" className="footer-link">Skills</a>
          <a href="#projects" className="footer-link">Projects</a>
          <a href="#contact" className="footer-link">Contact</a>
        </div>
        <div className="footer-copy">
          © {currentYear} Salwa Alla. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
