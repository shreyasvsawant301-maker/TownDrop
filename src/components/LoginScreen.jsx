import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function LoginScreen() {
  const { login, signUp, demoLogin } = useApp();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState('customer'); // 'customer' | 'merchant' | 'rider'
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!fullName) {
          setErrorMsg('Please enter your full name');
          setLoading(false);
          return;
        }
        await signUp(email, password, fullName, selectedRole);
      } else {
        await login(email, password);
      }
    } catch (e) {
      setErrorMsg(e.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (role) => {
    setLoading(true);
    try {
      await demoLogin(role);
    } catch (e) {
      console.error('Demo login error', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-container-margin py-xl">
      <div className="max-w-md w-full space-y-lg">
        {/* Brand Logo & Tagline */}
        <div className="text-center space-y-xs">
          <h1 className="font-headline-xl text-headline-xl font-bold text-primary">LocalConnect</h1>
          <p className="font-body-md text-body-md text-secondary font-medium">Your town. Your shops. Delivered.</p>
        </div>

        {/* Auth Card */}
        <div className="bg-surface-container-lowest rounded-xl p-lg md:p-xl shadow-[0px_4px_12px_rgba(26,26,26,0.05)] border border-outline-variant space-y-lg">
          <div className="text-center pb-sm border-b border-surface-variant">
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              {isRegister ? 'Create LocalConnect Account' : 'Sign in to LocalConnect'}
            </h2>
            <p className="font-body-sm text-secondary mt-xs">
              {isRegister ? 'Select your role to register' : 'Enter your credentials to access your dashboard'}
            </p>
          </div>

          {errorMsg && (
            <div className="bg-error-container text-on-error-container p-sm rounded-lg font-body-sm text-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-md">
            {isRegister && (
              <>
                <div>
                  <label className="block font-label-sm text-label-sm text-secondary mb-xs font-bold">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full p-sm bg-surface-container border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary"
                    placeholder="e.g. Shreyas"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                {/* Role Selection during signup */}
                <div>
                  <label className="block font-label-sm text-label-sm text-secondary mb-xs font-bold">I am a...</label>
                  <div className="grid grid-cols-3 gap-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('customer')}
                      className={`p-sm rounded-lg border text-center transition-all flex flex-col items-center gap-xs ${
                        selectedRole === 'customer'
                          ? 'border-primary bg-primary-container text-on-primary-container font-bold'
                          : 'border-outline-variant bg-surface-container text-secondary hover:bg-surface-container-high'
                      }`}
                    >
                      <span className="text-xl">🛍️</span>
                      <span className="font-label-sm text-label-sm">Customer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('merchant')}
                      className={`p-sm rounded-lg border text-center transition-all flex flex-col items-center gap-xs ${
                        selectedRole === 'merchant'
                          ? 'border-primary bg-primary-container text-on-primary-container font-bold'
                          : 'border-outline-variant bg-surface-container text-secondary hover:bg-surface-container-high'
                      }`}
                    >
                      <span className="text-xl">🏪</span>
                      <span className="font-label-sm text-label-sm">Merchant</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('rider')}
                      className={`p-sm rounded-lg border text-center transition-all flex flex-col items-center gap-xs ${
                        selectedRole === 'rider'
                          ? 'border-primary bg-primary-container text-on-primary-container font-bold'
                          : 'border-outline-variant bg-surface-container text-secondary hover:bg-surface-container-high'
                      }`}
                    >
                      <span className="text-xl">🛵</span>
                      <span className="font-label-sm text-label-sm">Rider</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block font-label-sm text-label-sm text-secondary mb-xs font-bold">Email Address</label>
              <input
                type="email"
                required
                className="w-full p-sm bg-surface-container border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-secondary mb-xs font-bold">Password</label>
              <input
                type="password"
                required
                className="w-full p-sm bg-surface-container border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary"
                placeholder="•••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary font-label-md text-label-md py-md rounded-lg hover:bg-primary-container transition-colors shadow-sm font-bold flex items-center justify-center gap-xs"
            >
              <span>{isRegister ? 'Create Account →' : 'Sign In →'}</span>
            </button>
          </form>

          {/* Toggle Register vs Login */}
          <div className="text-center pt-xs">
            <button
              onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); }}
              className="font-body-sm text-body-sm text-primary font-semibold hover:underline"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Create account"}
            </button>
          </div>

          {/* HACKATHON INSTANT DEMO ACCESS AREA */}
          <div className="pt-md border-t border-surface-variant space-y-sm">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                ⚡ Instant Hackathon Demo Access
              </span>
              <span className="bg-primary-fixed text-on-primary-fixed-variant px-xs py-unit rounded text-[10px] font-bold">
                1-Click Login
              </span>
            </div>

            <div className="grid grid-cols-2 gap-sm">
              <button
                type="button"
                onClick={() => handleDemoClick('customer')}
                className="p-sm bg-surface-container hover:bg-primary-container hover:text-on-primary-container rounded-lg border border-outline-variant font-label-md text-label-md transition-colors flex items-center justify-center gap-xs font-semibold"
              >
                <span>🛍️</span> Customer
              </button>
              <button
                type="button"
                onClick={() => handleDemoClick('merchant')}
                className="p-sm bg-surface-container hover:bg-primary-container hover:text-on-primary-container rounded-lg border border-outline-variant font-label-md text-label-md transition-colors flex items-center justify-center gap-xs font-semibold"
              >
                <span>🏪</span> Merchant
              </button>
              <button
                type="button"
                onClick={() => handleDemoClick('rider')}
                className="p-sm bg-surface-container hover:bg-primary-container hover:text-on-primary-container rounded-lg border border-outline-variant font-label-md text-label-md transition-colors flex items-center justify-center gap-xs font-semibold"
              >
                <span>🛵</span> Rider
              </button>
              <button
                type="button"
                onClick={() => handleDemoClick('admin')}
                className="p-sm bg-surface-container hover:bg-tertiary-container hover:text-on-tertiary-container rounded-lg border border-outline-variant font-label-md text-label-md transition-colors flex items-center justify-center gap-xs font-semibold"
              >
                <span>⚡</span> Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
