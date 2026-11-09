import React, { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a href="#home" className="navbar-logo">
          <span>{'<'}</span> Salwa Alla <span>{'/>'}</span>
        </a>

        <button
          className="nav-toggle"
          aria-label="Toggle navigation"
          onClick={() => setOpen((prev) => !prev)}
        >
          ☰
        </button>

        <div className="nav-links">
          <a href="#home" className="nav-link">
            Home
          </a>
          <a href="#projects" className="nav-link">
            Projects
          </a>
          <a href="#skills" className="nav-link">
            Skills
          </a>
          <a href="#contact" className="nav-link">
            Contact
          </a>
          <a href="#contact" className="nav-cta">
            Hire me
          </a>
        </div>
      </div>

      {open && (
        <div className="nav-links-mobile">
          <a href="#home" className="nav-link" onClick={() => setOpen(false)}>
            Home
          </a>
          <a href="#projects" className="nav-link" onClick={() => setOpen(false)}>
            Projects
          </a>
          <a href="#skills" className="nav-link" onClick={() => setOpen(false)}>
            Skills
          </a>
          <a href="#contact" className="nav-link" onClick={() => setOpen(false)}>
            Contact
          </a>
          <a href="#contact" className="nav-cta" onClick={() => setOpen(false)}>
            Hire me
          </a>
        </div>
      )}
    </nav>
  );
}
