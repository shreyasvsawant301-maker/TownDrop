import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

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
        await signUp(email, password, fullName, role);
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

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-md">
      <div className="w-full max-w-md space-y-md">
        {/* Brand Header */}
        <div className="text-center space-y-xs">
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary">
            TownDrop
          </h1>
          <p className="font-body-md text-secondary">
            Hyperlocal Commerce & Delivery Platform for Underserved Towns
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-md space-y-md">
          <div className="text-center">
            <h2 className="font-headline-md font-bold text-on-surface">
              {isSignUpMode ? 'Create TownDrop Account' : 'Sign in to TownDrop'}
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
              <span>{isSignUpMode ? 'Complete Registration →' : 'Sign In →'}</span>
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
      </div>
    </div>
  );
}
