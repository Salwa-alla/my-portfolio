import React, { useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, FileText, Github, Linkedin, Mail } from 'lucide-react';
import './Contact.css';

const INITIAL_FORM_DATA = {
  name: '',
  email: '',
  message: '',
};

function Contact() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const submissionInProgress = useRef(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
    setFeedback(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submissionInProgress.current) return;

    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name || !email || !message) {
      setFeedback({ type: 'error', message: 'Veuillez remplir tous les champs.' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFeedback({ type: 'error', message: 'Veuillez saisir une adresse e-mail valide.' });
      return;
    }

    submissionInProgress.current = true;
    setIsSubmitting(true);
    setFeedback({ type: 'loading', message: 'Envoi de votre message en cours…' });

    try {
      const response = await fetch(
        'https://salwaalla.app.n8n.cloud/webhook/salwa-portfolio-contact',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message }),
        },
      );

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Le serveur a renvoyé une réponse invalide. Veuillez réessayer plus tard.');
      }

      if (!response.ok || data?.success !== true) {
        throw new Error('Votre message n’a pas pu être envoyé. Veuillez réessayer plus tard.');
      }

      setFormData(INITIAL_FORM_DATA);
      setFeedback({ type: 'success', message: 'Votre message a été envoyé avec succès.' });
    } catch (error) {
      setFeedback({
        type: 'error',
        message:
          error instanceof TypeError
            ? 'Une erreur réseau est survenue. Vérifiez votre connexion et réessayez.'
            : error instanceof Error
              ? error.message
              : 'Votre message n’a pas pu être envoyé. Veuillez réessayer plus tard.',
      });
    } finally {
      submissionInProgress.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="wrap contact-layout">
        <div className="contact-intro reveal">
          <div className="contact-kicker">
            <span className="contact-kicker-dot" />
            <span>Contact</span>
            <span className="contact-kicker-line" />
            <span className="contact-kicker-index">01 — 02</span>
          </div>
          <div className="contact-methods">
            <span className="contact-section-label">CONTACT DIRECT</span>
            <a className="contact-email-card" href="mailto:salwaalla7@gmail.com">
              <span className="contact-icon-box"><Mail size={20} aria-hidden="true" /></span>
              <span className="contact-email-copy">
                <span className="contact-meta">Un e-mail suffit pour commencer</span>
                <span className="contact-email-address">salwaalla7@gmail.com</span>
              </span>
              <ArrowUpRight className="contact-card-arrow" size={19} aria-hidden="true" />
            </a>
          </div>

          <div className="contact-profile-links" aria-label="Profils professionnels">
            <span className="contact-section-label">RETROUVEZ-MOI AUSSI</span>
            <a
              href="https://www.linkedin.com/in/salwa-alla-99801116a/"
              className="contact-profile-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={19} aria-hidden="true" />
              <span className="contact-profile-copy">
                <span className="contact-profile-name">LinkedIn</span>
                <span className="contact-profile-hint">Mon parcours professionnel</span>
              </span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <a
              href="https://github.com/Salwa-alla"
              className="contact-profile-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={19} aria-hidden="true" />
              <span className="contact-profile-copy">
                <span className="contact-profile-name">GitHub</span>
                <span className="contact-profile-hint">Mes projets et mon code</span>
              </span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>

          <a className="contact-cv-link" href="/Salwa-Alla-CV.pdf" target="_blank" rel="noreferrer">
            <span className="contact-cv-icon"><FileText size={18} aria-hidden="true" /></span>
            <span className="contact-cv-copy">
              <span className="contact-cv-label">Pour en savoir plus</span>
              <span className="contact-cv-title">Consulter mon CV</span>
            </span>
            <ArrowDownRight className="contact-cv-arrow" size={18} aria-hidden="true" />
          </a>
        </div>

        <div className="contact-form-card reveal reveal-delay-2">
          <div className="contact-form-header">
            <div>
              <div className="contact-form-eyebrow">
                <span className="contact-form-status-dot" />
                <span>VOTRE MESSAGE</span>
              </div>
              <h3 className="contact-form-title">Commençons la conversation.</h3>
            </div>
          </div>
          <p className="contact-form-copy">
            Quelques détails sur votre idée, votre besoin ou votre projet — je vous répondrai avec plaisir.
          </p>

          <form className="form-stack contact-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="contact-name">Nom</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                className="control"
                placeholder="Votre nom"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="contact-email">E-mail</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                className="control"
                placeholder="vous@exemple.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                className="control"
                placeholder="Parlez-moi de votre projet..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn-submit contact-submit" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Envoi en cours…' : 'Envoyer le message'}</span>
              <ArrowUpRight size={19} aria-hidden="true" />
            </button>
            {feedback && (
              <p
                className={`contact-feedback contact-feedback-${feedback.type}`}
                role={feedback.type === 'error' ? 'alert' : 'status'}
                aria-live={feedback.type === 'error' ? 'assertive' : 'polite'}
              >
                <span className="contact-feedback-indicator" aria-hidden="true" />
                {feedback.message}
              </p>
            )}
          </form>
          <div className="contact-form-footer">
            <span className="contact-form-footer-line" />
            <span>Tous les champs sont nécessaires pour vous répondre.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
