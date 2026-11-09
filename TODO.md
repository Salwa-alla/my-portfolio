# Portfolio Modernization Plan

## Information Gathered
- React portfolio for Salwa Alla (Front-End Developer)
- Dark theme with red accent (#ff3040), already has light/dark toggle
- Components: Navbar, Hero, About, Skills, Projects, Contact
- Missing: Footer, scroll animations, scroll-spy navbar

## Plan

### 1. Global Improvements
- Add `scroll-behavior: smooth` globally
- Add Intersection Observer-based fade-in animation utility
- Improve focus/accessibility states

### 2. Navbar Enhancement
- Add scroll-spy: highlight active section based on scroll position
- Close mobile menu on link click (already done)
- Add subtle backdrop blur improvement

### 3. Hero Section
- Add subtle floating animation to avatar
- Add staggered fade-in on load

### 4. About, Skills, Projects, Contact
- Add scroll-reveal fade-up animation
- Add subtle hover lift to cards

### 5. Project Cards
- Add image thumbnails to projects
- Improve hover state with lift and glow

### 6. Footer (New Component)
- Add professional footer with copyright and quick links

### 7. Back to Top Button (New Component)
- Appears after scrolling down

## Dependent Files
- `src/index.css` - Add animation utilities and smooth scroll
- `src/App.css` - Add reveal animations, footer styles, back-to-top styles
- `src/App.js` - Add Footer and BackToTop components
- `src/components/Navbar.jsx` - Add scroll spy
- `src/components/Hero.jsx` - Add load animations
- `src/components/About.jsx` - Add reveal wrapper
- `src/components/Skills.jsx` - Add reveal wrapper
- `src/components/Projects.jsx` - Add reveal wrapper
- `src/components/Contact.jsx` - Add reveal wrapper
- `src/components/Footer.jsx` - New file
- `src/components/BackToTop.jsx` - New file
- `src/Component/ProjectCard.js` - Add image support
- `src/projectsData.js` - Add image placeholders

## Followup
- Test responsive behavior
- Verify theme toggle still works

