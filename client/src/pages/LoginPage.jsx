import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./AuthPages.css";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      {/* Left: Branding Panel */}
      <div className="auth-left">
        <div className="auth-left__inner">
          <Link to="/" className="lp-logo" style={{ marginBottom: "48px" }}>
            <span className="lp-logo__icon">🌿</span>
            <span>Share<strong>Plates</strong></span>
          </Link>
          <h2 className="auth-left__headline">
            Redistributing food.<br />
            <span className="gradient-text">Rebuilding community.</span>
          </h2>
          <p className="auth-left__sub">
            Thousands of meals delivered every day by stores, shelters, and
            volunteers working together.
          </p>
          <div className="auth-left__stats">
            <div className="auth-stat"><span>50K+</span><p>Meals Shared</p></div>
            <div className="auth-stat"><span>300+</span><p>Partner Stores</p></div>
            <div className="auth-stat"><span>120+</span><p>Volunteers</p></div>
          </div>
        </div>
        <div className="auth-left__orbs">
          <div className="auth-orb auth-orb--1" />
          <div className="auth-orb auth-orb--2" />
        </div>
      </div>

      {/* Right: Form Panel */}
      <div className="auth-right">
        <div className="auth-form-box">
          <div className="auth-form-header">
            <h1>Welcome back</h1>
            <p>Sign in to your Share Plates account</p>
          </div>

          {error && <div className="sp-form-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="sp-form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                className="sp-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="sp-form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="sp-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
              style={{ marginTop: "8px" }}
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <div className="sp-divider" style={{ marginTop: "28px" }}>or</div>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/signup">Create one free →</Link>
          </p>

          <Link to="/" className="auth-back">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
