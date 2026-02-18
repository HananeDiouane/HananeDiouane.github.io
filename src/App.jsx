import React, { useState, useEffect, useRef } from 'react';
import {
  Menu, X,
  GraduationCap, Mail, Linkedin, ArrowRight, ArrowUpRight,
  CheckCircle, MapPin, Briefcase, Send, ChevronDown, AlertCircle,
  BookOpen, FolderOpen, Award
} from 'lucide-react';
import { translations, certBadges } from './translations';

function useScrollReveal() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, isVisible];
}

const App = () => {
  const [lang, setLang] = useState('fr');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState(null);

  // TODO: Replace {FORM_ID} with your Formspree form ID
  // See docs/EMAIL-SETUP.md for instructions
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/{FORM_ID}';
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const t = translations[lang];
  const isRTL = lang === 'ar';

  useEffect(() => {
    document.title = "Hanane Diouane — Architecture & Sustainable Performance";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Éco-conception & AMO Environnementale — LEED AP, WELL AP, HQE. Paris, France.');
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = ['home', 'about', 'services', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');

    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setFormStatus('success');
        e.target.reset();
        setTimeout(() => setFormStatus(null), 4000);
      } else {
        setFormStatus('error');
        setTimeout(() => setFormStatus(null), 4000);
      }
    } catch {
      setFormStatus('error');
      setTimeout(() => setFormStatus(null), 4000);
    }
  };

  const navLinks = [
    { key: 'home', href: '#home' },
    { key: 'about', href: '#about' },
    { key: 'services', href: '#services' },
    { key: 'contact', href: '#contact' },
  ];

  const navBg = scrollY > 60;

  const [aboutRef, aboutVisible] = useScrollReveal();
  const [servicesRef, servicesVisible] = useScrollReveal();
  const [contactRef, contactVisible] = useScrollReveal();

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen">

      <nav
        style={{
          position: 'fixed', width: '100%', zIndex: 100, top: 0,
          background: navBg ? 'rgba(244,246,243,0.92)' : 'transparent',
          backdropFilter: navBg ? 'blur(16px)' : 'none',
          borderBottom: navBg ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
          transition: 'all 0.4s ease',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 72 }}>
          <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'var(--c-charcoal)' }}>
            <div style={{ width: 36, height: 36, background: 'var(--c-forest)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--c-mint)', fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>HD</span>
            </div>
            <span className="font-display" style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>
              Hanane Diouane
            </span>
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden md:flex">
            {navLinks.map(link => (
              <a
                key={link.key}
                href={link.href}
                className={`nav-link ${activeSection === link.key ? 'nav-active' : ''}`}
                style={{
                  position: 'relative',
                  textDecoration: 'none',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: activeSection === link.key ? 'var(--c-forest)' : 'var(--c-muted)',
                  transition: 'color 0.3s',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {t.nav[link.key]}
                <div className="nav-dot" />
              </a>
            ))}

            <div style={{ display: 'flex', gap: 2, background: 'rgba(0,0,0,0.04)', borderRadius: 20, padding: 3, marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }}>
              {['fr', 'en', 'ar'].map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 16,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    background: lang === l ? 'white' : 'transparent',
                    color: lang === l ? 'var(--c-forest)' : 'var(--c-muted)',
                    boxShadow: lang === l ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-charcoal)', padding: 4, zIndex: 101 }}
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-overlay" dir={isRTL ? 'rtl' : 'ltr'}>
          <button
            onClick={() => setIsMenuOpen(false)}
            style={{
              position: 'absolute', top: 20, right: isRTL ? 'auto' : 24, left: isRTL ? 24 : 'auto',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--c-charcoal)', zIndex: 102,
            }}
          >
            <X size={28} />
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            {navLinks.map(link => (
              <a
                key={link.key}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  textDecoration: 'none',
                  fontSize: 28,
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  color: activeSection === link.key ? 'var(--c-forest)' : 'var(--c-text)',
                  padding: '12px 0',
                  letterSpacing: '-0.01em',
                  transition: 'color 0.2s',
                }}
              >
                {t.nav[link.key]}
              </a>
            ))}
          </div>

          <div style={{ position: 'absolute', bottom: 60, display: 'flex', gap: 12 }}>
            {['fr', 'en', 'ar'].map(l => (
              <button
                key={l}
                onClick={() => { setLang(l); setIsMenuOpen(false); }}
                style={{
                  padding: '10px 24px', borderRadius: 10, border: '1.5px solid',
                  borderColor: lang === l ? 'var(--c-forest)' : 'rgba(0,0,0,0.1)',
                  background: lang === l ? 'var(--c-forest)' : 'white',
                  color: lang === l ? 'white' : 'var(--c-muted)',
                  fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      <section id="home" className="grain" style={{
        position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center',
        background: 'var(--c-cream)', overflow: 'hidden', paddingTop: 72,
      }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.06 }}>
          <div style={{ position: 'absolute', top: 0, left: '25%', width: 1, height: '100%', background: 'var(--c-charcoal)' }} />
          <div style={{ position: 'absolute', top: 0, left: '50%', width: 1, height: '100%', background: 'var(--c-charcoal)' }} />
          <div style={{ position: 'absolute', top: 0, left: '75%', width: 1, height: '100%', background: 'var(--c-charcoal)' }} />
          <div style={{ position: 'absolute', top: '33%', left: 0, width: '100%', height: 1, background: 'var(--c-charcoal)' }} />
          <div style={{ position: 'absolute', top: '66%', left: 0, width: '100%', height: 1, background: 'var(--c-charcoal)' }} />
        </div>

        <div style={{
          position: 'absolute',
          top: '-10%', right: isRTL ? 'auto' : '-5%', left: isRTL ? '-5%' : 'auto',
          width: '45vw', height: '45vw', maxWidth: 600, maxHeight: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197,213,192,0.35) 0%, transparent 70%)',
          zIndex: 0,
        }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2, width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24, alignItems: 'center' }}>

            <div style={{ gridColumn: 'span 12', textAlign: isRTL ? 'right' : 'left' }} className="md:col-span-6">
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 16px', borderRadius: 24,
                background: 'rgba(122,158,126,0.08)', border: '1px solid rgba(122,158,126,0.12)',
                marginBottom: 32,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--c-green)' }} />
                <span className="font-body" style={{ fontSize: 13, fontWeight: 500, color: 'var(--c-green)', letterSpacing: '0.02em' }}>
                  {t.hero.role}
                </span>
              </div>

              <h1 className="font-display hero-title" style={{
                fontSize: 'clamp(36px, 5vw, 68px)',
                lineHeight: 1.02,
                fontWeight: 600,
                color: 'var(--c-charcoal)',
                marginBottom: 28,
                letterSpacing: '-0.01em',
                whiteSpace: 'pre-line',
              }}>
                {t.hero.title}
              </h1>

              <p className="font-body" style={{
                fontSize: 17, lineHeight: 1.7, color: 'var(--c-muted)',
                maxWidth: 520, marginBottom: 40, fontWeight: 300,
              }}>
                {t.hero.subtitle}
              </p>

              <div className="cert-badges" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 40 }}>
                {certBadges.map((badge, i) => (
                  <span key={i} style={{
                    padding: '6px 16px', borderRadius: 6,
                    background: badge.color, color: '#D8F3DC',
                    fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-body)',
                  }}>
                    {badge.label}
                  </span>
                ))}
              </div>

              <div className="hero-cta-buttons" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <a href="#services" className="font-body" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '14px 32px', borderRadius: 10,
                  background: 'var(--c-forest)', color: 'white',
                  fontSize: 14, fontWeight: 600, textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(43,58,66,0.25)',
                  transition: 'all 0.3s',
                }}>
                  {t.hero.cta}
                </a>
                <a href="#about" className="font-body" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 28px', borderRadius: 10,
                  background: 'transparent', color: 'var(--c-text)',
                  fontSize: 14, fontWeight: 600, textDecoration: 'none',
                  border: '1.5px solid rgba(0,0,0,0.12)',
                  transition: 'all 0.3s',
                }}>
                  {t.hero.cta_secondary}
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* Hero Image — right side */}
            <div className="hero-image-container md:block" style={{
              gridColumn: 'span 6',
              display: 'none',
              position: 'relative',
              height: '75vh',
              maxHeight: 700,
              borderRadius: 20,
              overflow: 'hidden',
              background: 'linear-gradient(135deg, var(--c-forest) 0%, var(--c-sage) 50%, var(--c-green) 100%)',
            }}>
              <img
                src="https://images.unsplash.com/photo-1518005068251-37900150dfca?auto=format&fit=crop&w=1200&q=80"
                alt="Sustainable green architecture building"
                loading="eager"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block',
                }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              {/* Left gradient overlay for smooth transition */}
              <div style={{
                position: 'absolute',
                top: 0,
                [isRTL ? 'right' : 'left']: 0,
                width: '40%',
                height: '100%',
                background: isRTL
                  ? 'linear-gradient(to left, var(--c-cream), transparent)'
                  : 'linear-gradient(to right, var(--c-cream), transparent)',
                pointerEvents: 'none',
              }} />
              {/* Bottom gradient */}
              <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: '25%',
                background: 'linear-gradient(to top, var(--c-cream), transparent)',
                pointerEvents: 'none',
              }} />
            </div>
          </div>
        </div>

        <div className="scroll-indicator" style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          opacity: 0.4, marginTop: 24,
        }}>
          <span className="font-body" style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500 }}>{t.hero.scroll}</span>
          <ChevronDown size={16} className="animate-bounce" />
        </div>
      </section>

      <section id="about" ref={aboutRef} style={{ padding: '120px 0', background: 'white', position: 'relative' }}>
        <div className={`reveal ${aboutVisible ? 'visible' : ''}`} style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

          <div style={{ marginBottom: 72, maxWidth: 640 }}>
            <span className="font-body" style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
              color: 'var(--c-green)', display: 'block', marginBottom: 16,
            }}>{t.about.label}</span>
            <h2 className="font-display" style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.15,
              color: 'var(--c-charcoal)', marginBottom: 24,
              whiteSpace: 'pre-line', fontWeight: 600,
              letterSpacing: '-0.01em',
            }}>
              {t.about.title}
            </h2>
            <p className="font-body" style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--c-muted)', fontWeight: 300 }}>
              {t.about.bio}
            </p>
          </div>

          <div className="about-grid md:grid-cols-2" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 64 }}>

            <div>
              <h3 className="font-body" style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                color: 'var(--c-sage)', marginBottom: 40,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <Briefcase size={16} />
                {t.about.exp_title}
              </h3>

              <div style={{ position: 'relative', paddingLeft: isRTL ? 0 : 32, paddingRight: isRTL ? 32 : 0 }}>
                <div style={{
                  position: 'absolute',
                  top: 6, bottom: 0,
                  [isRTL ? 'right' : 'left']: 5,
                  width: 1,
                  background: 'linear-gradient(to bottom, var(--c-green), rgba(122,158,126,0.08))',
                }} />

                {t.about.timeline.map((item, i) => (
                  <div key={i} style={{
                    position: 'relative',
                    paddingBottom: i === t.about.timeline.length - 1 ? 0 : 40,
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 6,
                      width: 11, height: 11,
                      borderRadius: '50%',
                      background: i === 0 ? 'var(--c-green)' : 'white',
                      border: `2px solid var(--c-green)`,
                      boxShadow: i === 0 ? '0 0 0 4px rgba(122,158,126,0.12)' : 'none',
                      zIndex: 2,
                      ...(isRTL ? { right: -32 } : { left: -32 }),
                    }} />

                    <span style={{
                      display: 'inline-block',
                      padding: '3px 12px', borderRadius: 20,
                      background: i === 0 ? 'rgba(122,158,126,0.1)' : 'var(--c-cream)',
                      fontSize: 11, fontWeight: 600, color: 'var(--c-green)',
                      letterSpacing: '0.03em', marginBottom: 10,
                      fontFamily: 'var(--font-body)',
                    }}>
                      {item.year}
                    </span>

                    <h4 className="font-display" style={{
                      fontSize: 21, color: 'var(--c-charcoal)', fontWeight: 600,
                      lineHeight: 1.25, marginBottom: 4,
                      letterSpacing: '-0.01em',
                    }}>
                      {item.role}
                    </h4>

                    <span className="font-body" style={{
                      fontSize: 13, fontWeight: 600, color: 'var(--c-sage)',
                      display: 'block', marginBottom: 8,
                    }}>
                      {item.company}
                    </span>

                    {item.desc && (
                      <p className="font-body" style={{
                        fontSize: 14, lineHeight: 1.65, color: 'var(--c-muted)',
                        maxWidth: 420, fontWeight: 300,
                      }}>
                        {item.desc}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-body" style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                color: 'var(--c-sage)', marginBottom: 40,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <GraduationCap size={16} />
                {t.about.edu_title}
              </h3>

              <div style={{ position: 'relative', paddingLeft: isRTL ? 0 : 32, paddingRight: isRTL ? 32 : 0 }}>
                <div style={{
                  position: 'absolute',
                  top: 6, bottom: 0,
                  [isRTL ? 'right' : 'left']: 5,
                  width: 1,
                  background: 'linear-gradient(to bottom, var(--c-green), rgba(122,158,126,0.08))',
                }} />

                {t.about.formation.map((item, i) => (
                  <div key={i} style={{
                    position: 'relative',
                    paddingBottom: i === t.about.formation.length - 1 ? 0 : 36,
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 6,
                      width: 11, height: 11,
                      borderRadius: '50%',
                      background: 'white',
                      border: '2px solid var(--c-green)',
                      zIndex: 2,
                      ...(isRTL ? { right: -32 } : { left: -32 }),
                    }} />

                    <span style={{
                      display: 'inline-block',
                      padding: '3px 12px', borderRadius: 20,
                      background: 'var(--c-cream)',
                      fontSize: 11, fontWeight: 600, color: 'var(--c-green)',
                      letterSpacing: '0.03em', marginBottom: 10,
                      fontFamily: 'var(--font-body)',
                    }}>
                      {item.year}
                    </span>

                    <h4 className="font-display" style={{
                      fontSize: 19, color: 'var(--c-charcoal)', fontWeight: 600,
                      lineHeight: 1.25, marginBottom: 4,
                      letterSpacing: '-0.01em',
                    }}>
                      {item.title}
                    </h4>

                    <span className="font-body" style={{
                      fontSize: 13, fontWeight: 600, color: 'var(--c-sage)',
                    }}>
                      {item.org}
                    </span>
                  </div>
                ))}
              </div>

              <h3 className="font-body" style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                color: 'var(--c-sage)', marginBottom: 40, marginTop: 56,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <Award size={16} />
                {t.about.cert_title}
              </h3>

              <div style={{ position: 'relative', paddingLeft: isRTL ? 0 : 32, paddingRight: isRTL ? 32 : 0 }}>
                <div style={{
                  position: 'absolute',
                  top: 6, bottom: 0,
                  [isRTL ? 'right' : 'left']: 5,
                  width: 1,
                  background: 'linear-gradient(to bottom, var(--c-green), rgba(122,158,126,0.08))',
                }} />

                {t.about.certifications.map((item, i) => (
                  <div key={i} style={{
                    position: 'relative',
                    paddingBottom: i === t.about.certifications.length - 1 ? 0 : 32,
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 6,
                      width: 11, height: 11,
                      borderRadius: '50%',
                      background: 'var(--c-green)',
                      border: '2px solid var(--c-green)',
                      boxShadow: '0 0 0 3px rgba(122,158,126,0.1)',
                      zIndex: 2,
                      ...(isRTL ? { right: -32 } : { left: -32 }),
                    }} />

                    <h4 style={{
                      fontSize: 14, color: 'var(--c-charcoal)', fontWeight: 600,
                      lineHeight: 1.25, marginBottom: 6,
                      fontFamily: 'var(--font-body)',
                    }}>
                      {item.title}
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px', borderRadius: 20,
                        background: '#e8efe9', color: '#4a6b50',
                        fontSize: 11, fontWeight: 600,
                        fontFamily: 'var(--font-body)',
                        letterSpacing: '0.02em',
                      }}>
                        {item.org}
                      </span>
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noreferrer" className="font-body" style={{
                          fontSize: 11, fontWeight: 600, color: 'var(--c-green)',
                          textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '2px 10px', borderRadius: 12,
                          background: 'rgba(122,158,126,0.06)',
                          transition: 'background 0.2s',
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(122,158,126,0.14)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(122,158,126,0.06)'}
                        >
                          Credential <ArrowUpRight size={11} />
                        </a>
                      )}
                    </div>

                    {item.desc && (
                      <p style={{
                        fontSize: 13, lineHeight: 1.6, color: '#7a7a7a',
                        maxWidth: 420, fontWeight: 300,
                        fontFamily: 'var(--font-body)',
                      }}>
                        {item.desc}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" ref={servicesRef} className="grain" style={{ padding: '120px 0', background: 'var(--c-cream)', position: 'relative' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

          <div className={`reveal ${servicesVisible ? 'visible' : ''}`} style={{ marginBottom: 64, maxWidth: 500 }}>
            <span className="font-body" style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
              color: 'var(--c-green)', display: 'block', marginBottom: 16,
            }}>{t.services.label}</span>
            <h2 className="font-display" style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.15,
              color: 'var(--c-charcoal)', marginBottom: 16,
              whiteSpace: 'pre-line', fontWeight: 600,
              letterSpacing: '-0.01em',
            }}>
              {t.services.title}
            </h2>
            <p className="font-body" style={{ fontSize: 15, color: 'var(--c-muted)', fontWeight: 300 }}>{t.services.subtitle}</p>
          </div>

          <div className={`stagger services-grid ${servicesVisible ? 'visible' : ''}`} style={{
            display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: 0,
          }}>
            {t.services.list.map((service, i) => (
              <div key={i} className="service-card" style={{
                padding: '36px 0',
                borderTop: '1px solid rgba(0,0,0,0.08)',
                display: 'grid', gridTemplateColumns: '1fr', gap: 16, alignItems: 'start',
                cursor: 'default',
                transition: 'padding-left 0.4s ease',
              }}
                onMouseEnter={e => { if (window.innerWidth > 768) e.currentTarget.style.paddingLeft = '16px'; }}
                onMouseLeave={e => { e.currentTarget.style.paddingLeft = '0px'; }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }} className="md:grid-cols-12">
                  <div className="md:col-span-1" style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-green)', opacity: 0.5, fontFamily: 'var(--font-body)' }}>{service.num}</span>
                  </div>
                  <div className="md:col-span-3">
                    <h3 className="font-display" style={{ fontSize: 24, color: 'var(--c-charcoal)', fontWeight: 600, whiteSpace: 'pre-line', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                      {service.title}
                    </h3>
                  </div>
                  <div className="md:col-span-5">
                    <p className="font-body" style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--c-muted)', fontWeight: 300 }}>{service.desc}</p>
                  </div>
                  <div className="md:col-span-3" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                    {service.tags.map((tag, j) => (
                      <span key={j} style={{
                        padding: '4px 12px', borderRadius: 4,
                        background: 'rgba(122,158,126,0.06)', fontSize: 11,
                        fontWeight: 600, color: 'var(--c-green)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-body)',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="service-line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" ref={contactRef} style={{
        padding: '120px 0', background: 'var(--c-charcoal)', color: 'white', position: 'relative',
      }}>
        <div className={`reveal ${contactVisible ? 'visible' : ''}`} style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="contact-grid md:grid-cols-2" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 64 }}>

            <div>
              <span className="font-body" style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                color: 'var(--c-mint)', display: 'block', marginBottom: 16,
              }}>{t.contact.label}</span>
              <h2 className="font-display" style={{
                fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.15,
                color: 'white', marginBottom: 24,
                whiteSpace: 'pre-line', fontWeight: 600,
                letterSpacing: '-0.01em',
              }}>
                {t.contact.title}
              </h2>
              <p className="font-body" style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.5)', marginBottom: 48, maxWidth: 440, fontWeight: 300 }}>
                {t.contact.text}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={18} color="var(--c-mint)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{t.contact.location}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}>{t.contact.available}</div>
                  </div>
                </div>

                <a href="https://www.linkedin.com/in/hananed" target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none', color: 'white' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s' }}>
                    <Linkedin size={18} color="var(--c-mint)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                      LinkedIn <ArrowUpRight size={14} style={{ opacity: 0.5 }} />
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}>{t.contact.linkedin_text}</div>
                  </div>
                </a>
              </div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: 20,
              padding: 36, border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label className="font-body" style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {t.contact.form_name}
                  </label>
                  <input
                    name="name"
                    type="text" required
                    style={{
                      width: '100%', padding: '14px 16px', borderRadius: 10,
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white', fontSize: 15, outline: 'none',
                      transition: 'border-color 0.3s',
                      fontFamily: 'var(--font-body)', fontWeight: 300,
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--c-mint)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
                <div>
                  <label className="font-body" style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {t.contact.form_email}
                  </label>
                  <input
                    name="email"
                    type="email" required
                    style={{
                      width: '100%', padding: '14px 16px', borderRadius: 10,
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white', fontSize: 15, outline: 'none',
                      transition: 'border-color 0.3s',
                      fontFamily: 'var(--font-body)', fontWeight: 300,
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--c-mint)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
                <div>
                  <label className="font-body" style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {t.contact.form_message}
                  </label>
                  <textarea
                    name="message"
                    rows="4" required
                    style={{
                      width: '100%', padding: '14px 16px', borderRadius: 10,
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white', fontSize: 15, outline: 'none', resize: 'vertical',
                      transition: 'border-color 0.3s',
                      fontFamily: 'var(--font-body)', fontWeight: 300,
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--c-mint)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
                <button
                  type="submit"
                  disabled={formStatus === 'sending' || formStatus === 'success'}
                  style={{
                    width: '100%', padding: '16px', borderRadius: 10,
                    background: formStatus === 'success' ? 'var(--c-green)' : formStatus === 'error' ? '#E57373' : 'white',
                    color: formStatus === 'success' ? 'white' : formStatus === 'error' ? 'white' : 'var(--c-charcoal)',
                    fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'all 0.3s',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {formStatus === 'sending' ? (
                    <div style={{ width: 20, height: 20, border: '2px solid var(--c-charcoal)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  ) : formStatus === 'success' ? (
                    <><CheckCircle size={16} /> {t.contact.form_success}</>
                  ) : formStatus === 'error' ? (
                    <><AlertCircle size={16} /> {t.contact.form_error}</>
                  ) : (
                    <>{t.contact.form_btn} <Send size={14} /></>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer style={{
        background: 'var(--c-charcoal)', borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '48px 24px',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>

          <div className="footer-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, background: 'var(--c-forest)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'var(--c-mint)', fontSize: 11, fontWeight: 700, letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>HD</span>
                </div>
                <span className="font-display" style={{ fontSize: 16, color: 'white', fontWeight: 600 }}>Hanane Diouane</span>
              </div>
              <p className="font-body" style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', maxWidth: 300, fontWeight: 300 }}>
                hananediouane.com
              </p>
            </div>

            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
              {[
                { icon: <BookOpen size={14} />, label: t.footer.resources },
                { icon: <FolderOpen size={14} />, label: t.footer.portfolio },
                { icon: <GraduationCap size={14} />, label: t.footer.courses },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500 }}>
                    {item.icon} {item.label}
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'var(--c-mint)', opacity: 0.5,
                    fontFamily: 'var(--font-body)',
                  }}>
                    {t.footer.soon}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <span className="font-body" style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontWeight: 300 }}>
              © {new Date().getFullYear()} Hanane Diouane. {t.footer.rights}
            </span>
            <div style={{ display: 'flex', gap: 20 }}>
              <a href="https://www.linkedin.com/in/hananed" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.3)', transition: 'color 0.3s' }}>
                <Linkedin size={16} />
              </a>
              <a href="mailto:contact@hananediouane.com" style={{ color: 'rgba(255,255,255,0.3)', transition: 'color 0.3s' }}>
                <Mail size={16} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
