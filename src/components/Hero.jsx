import React from 'react';

function Hero() {
  return (
    <section id="hero" className="section">
      <div className="container hero">
        <div className="hero-left reveal">
          <p className="section-kicker hero-kicker">Hi, I&apos;m Salwa Alla</p>

          <h1 className="hero-heading">
            <span className="hero-heading-intro">I am</span>{' '}
            <span className="hero-heading-accent">
              Front-End Developer
            </span>
          </h1>

          <p className="hero-subtitle">
            I build modern, responsive web interfaces using React, Next.js,
            APIs, automation tools and AI.
          </p>

          <div className="hero-actions">
            <a
              href="/Salwa-Alla-CV.pdf"
              className="btn-primary"
              target="_blank"
              rel="noreferrer"
              download
            >
              Download CV
            </a>

            <a href="#contact" className="btn-ghost">
              Contact Me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
