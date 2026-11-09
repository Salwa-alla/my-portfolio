import React from 'react';
import { ExternalLink, Github, MonitorPlay } from 'lucide-react';

export default function ProjectCard({ project }) {
  const sourceUrl = project.github?.trim() || '#';
  const demoUrl = project.demo?.trim() || '#';

  return (
    <article className="project-card glass card-hover">
      <div className="project-media">
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.title} project preview`}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="fallback" aria-hidden="true">
            <MonitorPlay size={48} />
          </div>
        )}
        <div className="overlay" />
      </div>

      <div className="project-card-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.description}</p>
        {project.highlight && <p className="project-hl">{project.highlight}</p>}

        <ul className="project-tags" aria-label="Technologies used">
          {project.tech.map((tag) => (
            <li key={tag} className="tech-chip">{tag}</li>
          ))}
        </ul>

        <div className="project-actions">
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glass"
            aria-label={`Code source de ${project.title}`}
          >
            <Github size={18} aria-hidden="true" />
            <span>Code source</span>
          </a>
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            aria-label={`Démo en direct de ${project.title}`}
          >
            <ExternalLink size={18} aria-hidden="true" />
            <span>Démo en direct</span>
          </a>
        </div>
      </div>
    </article>
  );
}
