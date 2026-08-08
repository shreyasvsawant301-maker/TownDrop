import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import logoImg from '../assets/logo.png';

export default function LoginScreen() {
  const { login, signUp } = useApp();
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('customer');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isSignUpMode) {
        if (!fullName.trim() || !email.trim() || !password.trim()) {
          setErrorMsg('Please fill in all required fields.');
          setLoading(false);
          return;
        }
        await signUp(email, password, fullName, role, phone);
      } else {
        if (!email.trim() || !password.trim()) {
          setErrorMsg('Please enter your email and password.');
          setLoading(false);
          return;
        }
        await login(email, password);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoRole) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const demoEmail = `${demoRole}@localconnect.demo`;
      const demoPassword = 'demo123456';
      await login(demoEmail, demoPassword);
    } catch {
      // Fallback: login still creates a local session via signInUser mock
    } finally {
      setLoading(false);
    }
  };

  const demoRoles = [
    { key: 'customer', label: 'Customer', icon: 'shopping_bag', desc: 'Browse & order' },
    { key: 'merchant', label: 'Merchant', icon: 'storefront', desc: 'Manage store' },
    { key: 'rider', label: 'Rider', icon: 'two_wheeler', desc: 'Deliver orders' },
    { key: 'admin', label: 'Admin', icon: 'admin_panel_settings', desc: 'Platform ops' }
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-md">
      <div className="w-full max-w-md space-y-md">
        {/* Brand Header with Official Logo */}
        <div className="text-center space-y-xs flex flex-col items-center">
          <img
            src={logoImg}
            alt="LocalConnect"
            className="h-20 md:h-24 object-contain mb-xs"
          />
          <p className="font-body-md text-secondary max-w-sm">
            Your town. Your shops. Delivered.
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-md space-y-md">
          <div className="text-center">
            <h2 className="font-headline-md font-bold text-on-surface">
              {isSignUpMode ? 'Create Account' : 'Sign in to LocalConnect'}
            </h2>
            <p className="font-body-sm text-xs text-secondary mt-xs">
              {isSignUpMode
                ? 'Register as a Customer, Merchant, or Rider'
                : 'Enter your credentials to access your dashboard'}
            </p>
          </div>

          {errorMsg && (
            <div className="bg-error-container text-on-error-container p-sm rounded-xl text-xs font-medium animate-fadeIn">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-md">
            {isSignUpMode && (
              <div>
                <label className="block font-label-sm text-xs text-secondary mb-xs font-bold">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patil"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-sm bg-surface border border-outline-variant rounded-xl font-body-md text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            <div>
              <label className="block font-label-sm text-xs text-secondary mb-xs font-bold">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-sm bg-surface border border-outline-variant rounded-xl font-body-md text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-label-sm text-xs text-secondary mb-xs font-bold">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-sm bg-surface border border-outline-variant rounded-xl font-body-md text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
            </div>

            {isSignUpMode && (
              <>
                <div>
                  <label className="block font-label-sm text-xs text-secondary mb-xs font-bold">
                    Select Account Role
                  </label>
                  <div className="grid grid-cols-3 gap-xs">
                    {[
                      { key: 'customer', label: '🛍️ Customer' },
                      { key: 'merchant', label: '🏪 Merchant' },
                      { key: 'rider', label: '🛵 Rider' }
                    ].map((r) => (
                      <button
                        type="button"
                        key={r.key}
                        onClick={() => setRole(r.key)}
                        className={`p-xs rounded-xl text-xs font-bold transition-all border ${
                          role === r.key
                            ? 'bg-primary text-on-primary border-primary shadow-xs'
                            : 'bg-surface text-secondary border-outline-variant hover:bg-surface-container-high'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-label-sm text-xs text-secondary mb-xs font-bold">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-sm bg-surface border border-outline-variant rounded-xl font-body-md text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary font-label-md py-sm rounded-xl font-bold hover:bg-primary-container transition-colors shadow-sm flex items-center justify-center gap-xs"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
              ) : null}
              <span>{isSignUpMode ? 'Create Account →' : 'Sign In →'}</span>
            </button>
          </form>

          {/* Toggle between Sign In and Sign Up */}
          <div className="text-center pt-xs border-t border-surface-variant">
            <button
              type="button"
              onClick={() => {
                setIsSignUpMode(!isSignUpMode);
                setErrorMsg(null);
              }}
              className="text-xs font-bold text-primary hover:underline"
            >
              {isSignUpMode
                ? 'Already have an account? Sign in'
                : "Don't have an account? Create account"}
            </button>
          </div>
        </div>

        {/* Demo Access Section */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md shadow-sm space-y-sm">
          <div className="text-center">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">Demo Access</span>
            <p className="text-[11px] text-secondary mt-xs">Quick login as any role to explore the platform</p>
          </div>

          <div className="grid grid-cols-4 gap-xs">
            {demoRoles.map((dr) => (
              <button
                key={dr.key}
                onClick={() => handleDemoLogin(dr.key)}
                disabled={loading}
                className="flex flex-col items-center gap-xs p-sm rounded-xl border border-outline-variant bg-surface hover:bg-primary-fixed hover:border-primary hover:text-on-primary-fixed transition-all group"
              >
                <span className="material-symbols-outlined text-xl text-secondary group-hover:text-primary transition-colors">
                  {dr.icon}
                </span>
                <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                  {dr.label}
                </span>
                <span className="text-[10px] text-secondary leading-tight">{dr.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-secondary">
          Smart Hyperlocal Commerce & Logistics for Tier-2/Tier-3 Towns
        </p>
      </div>
    </div>
  );
}
