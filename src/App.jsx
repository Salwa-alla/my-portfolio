import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import profileImage from './images/profile.png';
import projectsData from './projectsData.js';
import ProjectCard from './Component/ProjectCard.jsx';
import AIChatbot from './components/AIChatbot';
import Contact from './components/Contact';
import {
  Code2,
  Terminal,
  Cpu,
  Globe,
  Github,
  Linkedin,
  Mail,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Layers,
  Sparkles,
  Briefcase,
  GraduationCap,
  Database,
  Server,
  FileCode,
  GitBranch,
  Cog
} from 'lucide-react';

/* =============================================================
   Custom Cursor (logique intacte)
   ============================================================= */
const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <>
      <motion.div
        className="custom-cursor"
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
        }}
      />
      <motion.div
        className="custom-cursor-follower"
        style={{
          left: mousePosition.x - 20,
          top: mousePosition.y - 20,
        }}
      />
    </>
  );
};

/* =============================================================
   Navbar (logique scroll + active section intacte)
   ============================================================= */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'formation', 'contact'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '#home' },
    { name: 'À propos', href: '#about' },
    { name: 'Compétences', href: '#skills' },
    { name: 'Projets', href: '#projects' },
    { name: 'Expérience', href: '#experience' },
    { name: 'Formation', href: '#formation' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`app-nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="wrap">
        <div className="glass-nav nav-shell">
          <a href="#home" className="nav-logo">
            SA<span className="dot">.</span>
          </a>

          {/* Desktop Nav */}
          <div className="nav-desktop visible-desktop">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`nav-link ${activeSection === link.href.slice(1) ? 'active' : ''}`}
              >
                {link.name}
              </a>
            ))}
            <a href="#contact" className="btn-glass" style={{ padding: '10px 20px', fontWeight: 600 }}>
              Me contacter
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="nav-toggle-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="nav-mobile glass-nav"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </nav>
  );
};

const HeroVisual = () => (
  <div className="hero-float profile-ring">
    <div className="profile-photo">
      <img src={profileImage} alt="Salwa Alla" />
    </div>
  </div>
);

/* =============================================================
   Hero Section (logique framer-motion parallax intacte)
   ============================================================= */
const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <section id="home" className="hero-root">
      <motion.div style={{ y: y1 }} className="hero-blob b1" />
      <motion.div style={{ y: y2 }} className="hero-blob b2" />
      <div className="hero-blob b3" />

      <div className="wrap hero-inner">
        <div className="hero-grid">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-badge glass border-white-15"
            >
              <Sparkles className="spark" />
              <span className="label">Développeuse Front-End · React &amp; Next.js</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hero-title"
            >
              <span className="text-white">Bonjour, je suis</span>
              <br />
              <span className="name">Salwa Alla</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hero-subtitle"
            >
              Développeuse Front-End passionnée par la création d&apos;interfaces modernes et responsives.
              Maîtrise HTML5, CSS3, JavaScript, React et Next.js.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="hero-actions"
            >
              <a
                href="/Salwa-Alla-CV.pdf"
                className="btn-primary"
                target="_blank"
                rel="noreferrer"
                download
              >
                Download CV
              </a>
              <a href="#contact" className="btn-glass">
                Me contacter
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="hero-socials"
            >
              <a href="https://github.com/Salwa-alla" target="_blank" rel="noopener noreferrer" className="icon-wrap glass">
                <Github size={24} />
              </a>
              <a href="https://linkedin.com/in/salwa-alla" target="_blank" rel="noopener noreferrer" className="icon-wrap glass">
                <Linkedin size={24} />
              </a>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="hero-media"
          >
            <HeroVisual />
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="hero-scroll glass"
        >
          <ChevronDown size={20} />
        </motion.div>
      </div>
    </section>
  );
};

/* =============================================================
   About Section
   ============================================================= */
const About = () => {
  const focusAreas = [
    { icon: Code2, title: 'Développement Front-End', desc: 'React.js, Next.js, Redux Toolkit' },
    { icon: Server, title: 'API et back-end', desc: 'API REST, PHP' },
    { icon: Database, title: 'Bases de données', desc: 'MySQL, SQL Server' },
    { icon: GitBranch, title: 'Outils & versioning', desc: 'Git, GitHub' },
  ];

  return (
    <section id="about" className="section about-section">
      <div className="wrap">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="section-head"
        >
          <h2>À <span className="accent">propos</span></h2>
          <div className="divider" />
        </motion.div>

        <div className="about-redesign">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="about-copy glass-panel"
          >
            <span className="about-kicker">Développeuse Front-End</span>
            <h3>Qui suis-je ?</h3>
            <p className="lead">
              Je conçois et développe des interfaces web modernes, performantes et centrées sur l&apos;expérience
              utilisateur. Avec React.js et Next.js, je construis des applications responsives et organise leur état
              avec Redux Toolkit.
            </p>
            <p className="lead">
              Ma formation en développement Front-End chez Simplon et mes projets pratiques m&apos;ont permis de consolider
              mes bases en HTML, CSS et JavaScript. Curieuse et rigoureuse, je continue à approfondir mes compétences
              en réalisant des applications web concrètes.
            </p>

            <div className="about-inline-stats">
              <div>
                <span className="stat-number">5+</span>
                <span className="stat-label">Projets réalisés</span>
              </div>
              <div>
                <span className="stat-number">Simplon</span>
                <span className="stat-label">Formation Front-End</span>
              </div>
              <div>
                <span className="stat-number">Casablanca</span>
                <span className="stat-label">Localisation</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="about-visual glass-panel"
          >
            <div className="visual-orb orb-one" />
            <div className="visual-orb orb-two" />

            <div className="mini-profile-card">
              <div className="mini-profile-header">
                <div className="mini-profile-dots" aria-hidden="true">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
                <span className="mini-tag">Portefeuille</span>
              </div>
            </div>

            <div className="about-focus-list">
              {focusAreas.map((item, idx) => (
                <div key={idx} className="about-focus-item">
                  <div className="about-icon-box">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <h5>{item.title}</h5>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* =============================================================
   Skills Section
   ============================================================= */
const Skills = () => {
  const skills = [
    { name: 'HTML5', level: 95, icon: FileCode },
    { name: 'CSS3', level: 95, icon: Layers },
    { name: 'JavaScript', level: 85, icon: Terminal },
    { name: 'React.js', level: 90, icon: Code2 },
    { name: 'Next.js', level: 85, icon: Globe },
    { name: 'Redux Toolkit', level: 80, icon: Cog },
    { name: 'PHP', level: 75, icon: Server },
    { name: 'MySQL', level: 75, icon: Database },
    { name: 'Git &amp; GitHub', level: 85, icon: GitBranch },
  ];

  return (
    <section id="skills" className="section section-fade-darker">
      <div className="wrap">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="section-head"
        >
          <h2>Mes <span className="accent">Compétences</span></h2>
          <div className="divider" />
        </motion.div>

        <div className="skills-grid">
          {skills.map((skill, idx) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <div className="skill-card glass card-hover">
                <div className="skill-row">
                  <div className="skill-icon">
                    <skill.icon size={24} />
                  </div>
                  <div className="skill-head">
                    <div className="skill-label">
                      <span>{skill.name}</span>
                      <span className="pct">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: idx * 0.08 + 0.2 }}
                        className="fill"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* =============================================================
   Projects Section
   ============================================================= */
const Projects = () => {
  const projects = projectsData;

  return (
    <section id="projects" className="section">
      <div className="wrap">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="section-head"
        >
          <h2>Mes <span className="accent">Projets</span></h2>
          <div className="divider" />
        </motion.div>

        <div className="projects-grid">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* =============================================================
   Experience Section
   ============================================================= */
const Experience = () => {
  const experiences = [
    {
      title: 'Stage Développement Web',
      company: 'CASTE-IT',
      period: 'Avril 2026 - Juillet 2026',
      description: "Développement d'interfaces web modernes, intégration responsive avec HTML/CSS/Bootstrap, développement de pages web avec PHP et gestion de base de données MySQL.",
      tech: ['HTML', 'CSS', 'Bootstrap', 'PHP', 'MySQL'],
    },
    {
      title: 'Stagiaire',
      company: 'Barid Al Maghrib, Rabat',
      period: 'Avril 2016 - Mai 2016',
      description: "Développement de modules en C# orienté objet, création d'une application de gestion avec ADO.NET et SQL Server.",
      tech: ['C#', 'ADO.NET', 'SQL Server'],
    },
    {
      title: 'Stagiaire',
      company: "Division de l'Action Sociale, Casablanca",
      period: 'Mars 2018 - Août 2018',
      description: 'Saisie et gestion des données du programme INDH, création et gestion d\'une base de données Access.',
      tech: ['Access'],
    },
  ];

  return (
    <section id="experience" className="section section-fade-darker">
      <div className="wrap">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="section-head"
        >
          <h2>Mon <span className="accent">Expérience</span></h2>
          <div className="divider" />
        </motion.div>

        <div className="exp-wrap">
          <div className="timeline-line" />

          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className={`exp-row ${idx % 2 === 0 ? 'left' : 'right'}`}
            >
              <div className="exp-dot">
                <div className="inner anim-pulseGlow" />
              </div>

              <div className="exp-content">
                <div className="exp-card glass card-hover">
                  <div className="exp-head">
                    <div className="icon-box">
                      <Briefcase size={20} />
                    </div>
                    <span className="period-pill">{exp.period}</span>
                  </div>
                  <h3>{exp.title}</h3>
                  <p className="company">{exp.company}</p>
                  <p className="desc">{exp.description}</p>
                  <div className="tags">
                    {exp.tech.map((t, i) => (
                      <span key={i} className="tech-chip">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* =============================================================
   Formation Section
   ============================================================= */
const Formation = () => {
  const formations = [
    {
      title: 'Front-End Augmented AI',
      school: 'Simplon Maghreb x JobIn Tech',
      period: '2025 - Février 2026',
      description: "Formation intensive en développement Front-End avec intégration d'IA.",
    },
    {
      title: 'Front-End',
      school: 'Centre Atlantique',
      period: '2024 - 2025',
      description: 'Formation de 6 mois en HTML, CSS, JavaScript.',
    },
    {
      title: 'Technicien Spécialisé en Développement Informatique',
      school: 'ISTA',
      period: 'Juillet 2017',
      description: 'Formation technique en développement informatique.',
    },
  ];

  return (
    <section id="formation" className="section">
      <div className="wrap">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="section-head"
        >
          <h2>Ma <span className="accent">Formation</span></h2>
          <div className="divider" />
        </motion.div>

        <div className="form-list">
          {formations.map((form, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              <div className="form-card glass card-hover">
                <div className="form-row">
                  <div className="form-left">
                    <div className="icon-box">
                      <GraduationCap size={28} />
                    </div>
                    <div>
                      <h3>{form.title}</h3>
                      <p className="school">{form.school}</p>
                    </div>
                  </div>
                  <span className="form-period glass">{form.period}</span>
                </div>
                <p>{form.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* =============================================================
   Footer
   ============================================================= */
const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="wrap">
        <div className="footer-inner">
          <p className="footer-copy">
            © {new Date().getFullYear()} Salwa Alla. Tous droits réservés.
          </p>
          <div className="footer-built">
            <p>Built with</p>
            <Sparkles className="sp" size={16} />
            <p>React &amp; CSS</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* =============================================================
   Main App — avec le Chatbot intégré à l'intérieur
   ============================================================= */
function App() {
  return (
    <div className="app-shell">
      <CustomCursor />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Formation />
      <Contact />
      <Footer />
      
    
      <AIChatbot />
    </div>
  );
}

export default App;
