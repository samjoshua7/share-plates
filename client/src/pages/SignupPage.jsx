import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./AuthPages.css";

const ROLES = [
  { value: "store", label: "🏪 Store / Bakery / Restaurant", desc: "Donate surplus food" },
  { value: "shelter", label: "🏠 Shelter / Family", desc: "Request food for your community" },
  { value: "volunteer", label: "🚗 Volunteer Driver", desc: "Deliver food to those in need" },
];

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
  phone: "",
  address: "",
  organizationName: "",
};

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 2-step form

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const selectRole = (value) => {
    setForm((prev) => ({ ...prev, role: value }));
    setErrors((prev) => ({ ...prev, role: "" }));
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email is required";
    if (!form.password || form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!form.role) e.role = "Please select a role";
    return e;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const e = {};
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.address.trim()) e.address = "Address is required";
    if ((form.role === "store" || form.role === "shelter") && !form.organizationName.trim()) {
      e.organizationName = "Organization name is required for this role";
    }
    return e;
  };

  const nextStep = () => {
    const e = validateStep1();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validateStep2();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        phone: form.phone,
        address: form.address,
        organizationName: form.organizationName,
      };
      const res = await api.post("/auth/register", payload);
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed. Please try again.");
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
            Join the food <br />
            <span className="gradient-text">redistribution movement.</span>
          </h2>
          <p className="auth-left__sub">
            Whether you run a store, manage a shelter, or want to volunteer —
            there's a role for you on Share Plates.
          </p>
          <div className="auth-role-pills">
            <div className="auth-role-pill">🏪 Stores</div>
            <div className="auth-role-pill">🏠 Shelters</div>
            <div className="auth-role-pill">🚗 Volunteers</div>
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
          {/* Progress Bar */}
          <div className="auth-progress">
            <div
              className="auth-progress__bar"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>
          <p className="auth-progress__label">Step {step} of 2</p>

          <div className="auth-form-header">
            <h1>{step === 1 ? "Create your account" : "Almost there!"}</h1>
            <p>{step === 1 ? "Sign up for free in under 2 minutes" : "A few more details to get you started"}</p>
          </div>

          {serverError && <div className="sp-form-error">{serverError}</div>}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="auth-form">
              {/* Role Selection */}
              <div className="sp-form-group">
                <label>I am a…</label>
                <div className="auth-role-selector">
                  {ROLES.map((r) => (
                    <button
                      type="button"
                      key={r.value}
                      className={`auth-role-btn${form.role === r.value ? " auth-role-btn--active" : ""}`}
                      onClick={() => selectRole(r.value)}
                    >
                      <span className="auth-role-btn__emoji">{r.label.split(" ")[0]}</span>
                      <div>
                        <p className="auth-role-btn__name">{r.label.split(" ").slice(1).join(" ")}</p>
                        <p className="auth-role-btn__desc">{r.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.role && <p className="sp-error-text">{errors.role}</p>}
              </div>

              <div className="auth-form-grid">
                <div className="sp-form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name" name="name" type="text"
                    className={`sp-input${errors.name ? " sp-input-error" : ""}`}
                    placeholder="Your name"
                    value={form.name} onChange={handleChange}
                  />
                  {errors.name && <p className="sp-error-text">{errors.name}</p>}
                </div>

                <div className="sp-form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email" name="email" type="email"
                    className={`sp-input${errors.email ? " sp-input-error" : ""}`}
                    placeholder="you@example.com"
                    value={form.email} onChange={handleChange}
                    autoComplete="email"
                  />
                  {errors.email && <p className="sp-error-text">{errors.email}</p>}
                </div>

                <div className="sp-form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password" name="password" type="password"
                    className={`sp-input${errors.password ? " sp-input-error" : ""}`}
                    placeholder="Min. 6 characters"
                    value={form.password} onChange={handleChange}
                    autoComplete="new-password"
                  />
                  {errors.password && <p className="sp-error-text">{errors.password}</p>}
                </div>

                <div className="sp-form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    id="confirmPassword" name="confirmPassword" type="password"
                    className={`sp-input${errors.confirmPassword ? " sp-input-error" : ""}`}
                    placeholder="Repeat your password"
                    value={form.confirmPassword} onChange={handleChange}
                    autoComplete="new-password"
                  />
                  {errors.confirmPassword && <p className="sp-error-text">{errors.confirmPassword}</p>}
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={nextStep}
                style={{ marginTop: "8px" }}
              >
                Continue →
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="auth-form-grid">
                <div className="sp-form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone" name="phone" type="tel"
                    className={`sp-input${errors.phone ? " sp-input-error" : ""}`}
                    placeholder="+91 98765 43210"
                    value={form.phone} onChange={handleChange}
                  />
                  {errors.phone && <p className="sp-error-text">{errors.phone}</p>}
                </div>

                {(form.role === "store" || form.role === "shelter") && (
                  <div className="sp-form-group">
                    <label htmlFor="organizationName">Organization Name</label>
                    <input
                      id="organizationName" name="organizationName" type="text"
                      className={`sp-input${errors.organizationName ? " sp-input-error" : ""}`}
                      placeholder="e.g. Sunrise Bakery, Hope Shelter"
                      value={form.organizationName} onChange={handleChange}
                    />
                    {errors.organizationName && <p className="sp-error-text">{errors.organizationName}</p>}
                  </div>
                )}
              </div>

              <div className="sp-form-group">
                <label htmlFor="address">Full Address</label>
                <textarea
                  id="address" name="address"
                  className={`sp-input${errors.address ? " sp-input-error" : ""}`}
                  placeholder="Street, City, State, PIN Code"
                  rows={3}
                  value={form.address} onChange={handleChange}
                  style={{ resize: "vertical" }}
                />
                {errors.address && <p className="sp-error-text">{errors.address}</p>}
              </div>

              <div className="auth-step2-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setStep(1)}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ flex: 1 }}
                >
                  {loading ? "Creating account…" : "Create Account 🎉"}
                </button>
              </div>
            </form>
          )}

          <div className="sp-divider" style={{ marginTop: "28px" }}>or</div>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Sign in →</Link>
          </p>

          <Link to="/" className="auth-back">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
