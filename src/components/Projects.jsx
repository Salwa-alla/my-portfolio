import React from 'react';
import ProjectCard from '../Component/ProjectCard.jsx';
import projects from '../projectsData';

function Projects() {
  return (
    <section id="projects" className="section">
      <div className="container">
        <header className="section-header reveal">
          <p className="section-kicker">Projects</p>
          <h2 className="section-title">Selected work</h2>
          <p className="section-subtitle">
            A selection of projects including React apps, a personal website, an AI integration and n8n
            automation.
          </p>
        </header>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={project.id} className={'reveal reveal-delay-' + Math.min(index + 1, 5)}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
