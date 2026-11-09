import React from 'react';

function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <header className="section-header reveal">
          <p className="section-kicker">About me</p>
          <h2 className="section-title">Who I Am</h2>
          <p className="section-subtitle">
            I am a front-end developer passionate about building modern web applications with React and
            Next.js, focusing on clean interfaces, performance and user experience.
          </p>
        </header>

        <div className="about-grid">
          <article className="about-card reveal reveal-delay-1">
            <h3 className="about-card-title">Professional focus</h3>
            <p className="about-card-text">
              I enjoy turning ideas into responsive websites and polished interfaces that are simple,
              modern and easy to use.
            </p>
          </article>

          <article className="about-card reveal reveal-delay-2">
            <h3 className="about-card-title">What I build</h3>
            <p className="about-card-text">
              Landing pages, portfolio websites, React applications, API-connected projects and
              workflow-driven front-end experiences.
            </p>
          </article>

          <article className="about-card reveal reveal-delay-3">
            <h3 className="about-card-title">My goal</h3>
            <p className="about-card-text">
              To create professional digital products that help businesses, brands and recruiters quickly
              understand the value of a project.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default About;
