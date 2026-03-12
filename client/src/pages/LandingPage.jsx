import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import "./LandingPage.css";

const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "For Stores", href: "#roles" },
  { label: "For Shelters", href: "#roles" },
  { label: "Volunteers", href: "#roles" },
];

const STEPS = [
  {
    icon: "🏪",
    step: "01",
    title: "Stores Post Surplus Food",
    desc: "Restaurants, bakeries, and grocery stores list surplus food with quantity, expiry, and pickup details — all in under a minute.",
  },
  {
    icon: "🏠",
    step: "02",
    title: "Shelters Browse & Claim",
    desc: "Shelters, old-age homes, and families in need browse real-time listings and request pickup of available food.",
  },
  {
    icon: "🚗",
    step: "03",
    title: "Volunteers Deliver",
    desc: "Community volunteers accept delivery tasks, pick up food from stores, and drop it off — completing the cycle of care.",
  },
];

const ROLES = [
  {
    emoji: "🏪",
    title: "Stores & Bakeries",
    color: "#16a34a",
    points: [
      "Post surplus food in seconds",
      "Track all your donations",
      "See volunteer assignments",
      "Reduce food waste guilt-free",
    ],
  },
  {
    emoji: "🏠",
    title: "Shelters & Families",
    color: "#f97316",
    points: [
      "Browse available food nearby",
      "One-click food claim",
      "Real-time delivery tracking",
      "Zero cost to receive",
    ],
  },
  {
    emoji: "🚗",
    title: "Volunteers",
    color: "#6366f1",
    points: [
      "See delivery requests nearby",
      "Accept tasks on your schedule",
      "Confirm pickups & deliveries",
      "Track your community impact",
    ],
  },
];

const STATS = [
  { value: "50K+", label: "Meals Redistributed" },
  { value: "300+", label: "Partner Stores" },
  { value: "120+", label: "Active Volunteers" },
  { value: "80+", label: "Shelters Served" },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="lp-root">
      {/* ===== NAVBAR ===== */}
      <nav className={`lp-nav${scrolled ? " lp-nav--scrolled" : ""}`}>
        <div className="lp-nav__inner">
          <Link to="/" className="lp-logo">
            <span className="lp-logo__icon">🌿</span>
            <span>Share<strong>Plates</strong></span>
          </Link>

          {/* Desktop links */}
          <ul className="lp-nav__links">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>

          <div className="lp-nav__actions">
            <button className="lp-theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <Link to="/login" className="btn btn-outline">Log In</Link>
            <Link to="/signup" className="btn btn-primary">Get Started</Link>
          </div>

          {/* Hamburger */}
          <button
            className="lp-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lp-mobile-menu">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}>
                {l.label}
              </a>
            ))}
            <div className="lp-mobile-actions">
              <button className="lp-theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme" style={{marginRight: 'auto'}}>
                {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
              </button>
              <Link to="/login" className="btn btn-outline" onClick={() => setMenuOpen(false)}>Log In</Link>
              <Link to="/signup" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <section className="lp-hero">
        <div className="lp-hero__bg">
          <div className="lp-orb lp-orb--1" />
          <div className="lp-orb lp-orb--2" />
          <div className="lp-orb lp-orb--3" />
        </div>

        <div className="lp-hero__content">
          <div className="lp-hero__badge">
            <span>🌱</span>
            <span>Fighting Food Waste, One Meal at a Time</span>
          </div>

          <h1 className="lp-hero__title">
            Connecting Surplus Food<br />
            with <span className="gradient-text">People Who Need It</span>
          </h1>

          <p className="lp-hero__subtitle">
            Share Plates bridges grocery stores, bakeries, and restaurants with
            shelters and families — powered by a community of volunteer drivers who
            make redistribution possible.
          </p>

          <div className="lp-hero__cta">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Join the Movement →
            </Link>
            <a href="#how-it-works" className="btn btn-outline btn-lg">
              See How It Works
            </a>
          </div>

          {/* Stats */}
          <div className="lp-stats">
            {STATS.map((s) => (
              <div key={s.label} className="lp-stat">
                <span className="lp-stat__value">{s.value}</span>
                <span className="lp-stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Food Card floats */}
        <div className="lp-hero__visual" aria-hidden="true">
          <div className="lp-food-card lp-food-card--1">
            <span className="lp-food-card__emoji">🍞</span>
            <div>
              <p className="lp-food-card__name">Sourdough Bread</p>
              <p className="lp-food-card__meta">Sunrise Bakery · 12 loaves</p>
            </div>
            <span className="sp-badge sp-badge-available">Available</span>
          </div>
          <div className="lp-food-card lp-food-card--2">
            <span className="lp-food-card__emoji">🥗</span>
            <div>
              <p className="lp-food-card__name">Mixed Salads</p>
              <p className="lp-food-card__meta">Green Bowl · 8 servings</p>
            </div>
            <span className="sp-badge sp-badge-claimed">Claimed</span>
          </div>
          <div className="lp-food-card lp-food-card--3">
            <span className="lp-food-card__emoji">🍚</span>
            <div>
              <p className="lp-food-card__name">Rice & Curry</p>
              <p className="lp-food-card__meta">Spice Garden · 20 portions</p>
            </div>
            <span className="sp-badge sp-badge-delivered">Delivered</span>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="lp-section">
        <div className="lp-section__inner">
          <div className="lp-section__header">
            <p className="lp-section__tag">Simple Process</p>
            <h2 className="lp-section__title">How Share Plates Works</h2>
            <p className="lp-section__sub">
              Three simple steps connect surplus food to people who need it most.
            </p>
          </div>

          <div className="lp-steps">
            {STEPS.map((s) => (
              <div key={s.step} className="lp-step">
                <div className="lp-step__number">{s.step}</div>
                <div className="lp-step__icon">{s.icon}</div>
                <h3 className="lp-step__title">{s.title}</h3>
                <p className="lp-step__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ROLES ===== */}
      <section id="roles" className="lp-section lp-section--alt">
        <div className="lp-section__inner">
          <div className="lp-section__header">
            <p className="lp-section__tag">Built For Everyone</p>
            <h2 className="lp-section__title">Your Role in the Chain</h2>
          </div>

          <div className="lp-roles">
            {ROLES.map((r) => (
              <div key={r.title} className="lp-role-card" style={{ "--role-color": r.color }}>
                <div className="lp-role-card__emoji">{r.emoji}</div>
                <h3 className="lp-role-card__title">{r.title}</h3>
                <ul className="lp-role-card__points">
                  {r.points.map((p) => (
                    <li key={p}>
                      <span className="lp-check">✓</span> {p}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className="btn btn-outline" style={{ width: "100%", marginTop: "auto" }}>
                  Join as {r.title.split(" ")[0]}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="lp-cta-banner">
        <div className="lp-cta-banner__inner">
          <h2>Ready to make a difference?</h2>
          <p>Join thousands of stores, shelters, and volunteers already on Share Plates.</p>
          <div className="lp-cta-banner__actions">
            <Link to="/signup" className="btn btn-primary btn-lg">Create Free Account</Link>
            <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="lp-footer">
        <div className="lp-footer__inner">
          <div className="lp-logo">
            <span className="lp-logo__icon">🌿</span>
            <span>Share<strong>Plates</strong></span>
          </div>
          <p className="lp-footer__tagline">
            Reducing food waste. Building community. One plate at a time.
          </p>
          <p className="lp-footer__copy">© {new Date().getFullYear()} SharePlates. Built with ♥ for the community.</p>
        </div>
      </footer>
    </div>
  );
}
