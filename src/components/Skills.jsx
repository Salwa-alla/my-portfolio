import React from 'react';

const skills = [
  'HTML5',
  'CSS3',
  'JavaScript',
  'React',
  'Next.js',
  'REST APIs',
  'AI Tools',
  'n8n',
  'Git & GitHub',
  'Responsive Design'
];

function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <header className="section-header reveal">
          <p className="section-kicker">Skills</p>
          <h2 className="section-title">Technologies I Work With</h2>
          <p className="section-subtitle">
            I build front-end interfaces with modern tools and focus on responsive design, APIs,
            automation and clean user experiences.
          </p>
        </header>

        <div className="skills-showcase">
          {skills.map((skill, index) => (
            <div key={skill} className={'skills-card reveal reveal-delay-' + Math.min(index + 1, 5)}>
              {skill}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
