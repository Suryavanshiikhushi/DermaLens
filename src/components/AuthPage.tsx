import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  Eye,
  EyeOff,
  Sparkles,
  User,
  Mail,
  Phone,
  ArrowRight,
  Lock,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Send,
  RefreshCw,
} from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: (user: UserProfile) => void;
}

type AuthView = 'signup' | 'login' | 'forgot_password';

interface StoredAccount {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [view, setView] = useState<AuthView>('signup');

  // Sign up form state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Forgot password & OTP state
  const [forgotEmail, setForgotEmail] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);

  // General feedback messages
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Helper: Retrieve accounts from localStorage
  const getStoredAccounts = (): StoredAccount[] => {
    try {
      const data = localStorage.getItem('dermalens_registered_accounts');
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return [];
  };

  // Helper: Save accounts to localStorage
  const saveStoredAccount = (acc: StoredAccount) => {
    try {
      const accounts = getStoredAccounts();
      const existingIdx = accounts.findIndex(
        (a) => a.email.toLowerCase() === acc.email.toLowerCase()
      );
      if (existingIdx >= 0) {
        accounts[existingIdx] = acc;
      } else {
        accounts.push(acc);
      }
      localStorage.setItem('dermalens_registered_accounts', JSON.stringify(accounts));
    } catch {
      // ignore
    }
  };

  // Handle Sign Up
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!signUpName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!signUpEmail || !signUpEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!signUpPassword) {
      setError('Password is required. Please create a password to sign up.');
      return;
    }
    if (signUpPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Check if account already exists
    const accounts = getStoredAccounts();
    const existing = accounts.find(
      (a) => a.email.toLowerCase() === signUpEmail.trim().toLowerCase()
    );
    if (existing) {
      setError('An account with this email already exists. Please login instead.');
      return;
    }

    // Save registered account
    const newAccount: StoredAccount = {
      name: signUpName.trim(),
      email: signUpEmail.trim(),
      phone: signUpPhone.trim() || undefined,
      password: signUpPassword,
    };
    saveStoredAccount(newAccount);

    const profile: UserProfile = {
      name: signUpName.trim(),
      email: signUpEmail.trim(),
      phone: signUpPhone.trim() || '',
      skinType: 'All Skin Types / General Tolerance',
      dietaryPreference: 'Standard / General Health',
      joinedAt: new Date().toISOString(),
    };

    localStorage.setItem('dermalens_user', JSON.stringify(profile));
    onLoginSuccess(profile);
  };

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!loginEmail || !loginEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!loginPassword) {
      setError('Password is required. Please enter your password.');
      return;
    }

    const accounts = getStoredAccounts();
    const found = accounts.find(
      (a) => a.email.toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (found) {
      if (found.password !== loginPassword) {
        setError('Incorrect password. Please try again or use "Forgot password?".');
        return;
      }
      // Successful login for registered account
      const profile: UserProfile = {
        name: found.name,
        email: found.email,
        phone: found.phone || '',
        skinType: 'All Skin Types / General Tolerance',
        dietaryPreference: 'Standard / General Health',
        joinedAt: new Date().toISOString(),
      };
      localStorage.setItem('dermalens_user', JSON.stringify(profile));
      onLoginSuccess(profile);
    } else {
      // If user hasn't registered through local list yet, allow login and auto-register credentials
      const profile: UserProfile = {
        name: loginEmail.split('@')[0].replace(/[._-]/g, ' '),
        email: loginEmail.trim(),
        phone: '',
        skinType: 'All Skin Types / General Tolerance',
        dietaryPreference: 'Standard / General Health',
        joinedAt: new Date().toISOString(),
      };
      saveStoredAccount({
        name: profile.name,
        email: loginEmail.trim(),
        password: loginPassword,
      });
      localStorage.setItem('dermalens_user', JSON.stringify(profile));
      onLoginSuccess(profile);
    }
  };

  // Generate and send OTP to email
  const handleSendOtp = () => {
    setError('');
    setSuccessMessage('');

    if (!forgotEmail || !forgotEmail.includes('@')) {
      setError('Please enter a valid email address to receive your OTP.');
      return;
    }

    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otpCode);
    setOtpSent(true);
    setSuccessMessage(`OTP sent successfully to ${forgotEmail}! (Verification Code: ${otpCode})`);

    // 30-second cooldown timer
    setOtpCooldown(30);
    const timer = setInterval(() => {
      setOtpCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Verify OTP and reset password
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!forgotEmail || !forgotEmail.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!enteredOtp.trim()) {
      setError('Please enter the 6-digit OTP sent to your email.');
      return;
    }
    if (enteredOtp.trim() !== generatedOtp) {
      setError('Invalid OTP code. Please enter the correct code.');
      return;
    }
    if (!newPassword) {
      setError('Please create your new password.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match. Please re-enter identical passwords.');
      return;
    }

    // Update password in stored accounts
    const accounts = getStoredAccounts();
    const existing = accounts.find(
      (a) => a.email.toLowerCase() === forgotEmail.trim().toLowerCase()
    );

    if (existing) {
      existing.password = newPassword;
      saveStoredAccount(existing);
    } else {
      saveStoredAccount({
        name: forgotEmail.split('@')[0],
        email: forgotEmail.trim(),
        password: newPassword,
      });
    }

    // Success: prepare login with new password
    setLoginEmail(forgotEmail);
    setLoginPassword('');
    setView('login');
    setSuccessMessage('Password reset successfully! Please login with your new password.');
    setOtpSent(false);
    setGeneratedOtp(null);
    setEnteredOtp('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/70 via-neutral-50 to-rose-100/40 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden text-neutral-900">
      {/* Decorative ambient cherry accents */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-b from-rose-200/25 via-rose-100/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold tracking-wide mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            Ingredient Intelligence, made personal
          </div>

          <div className="flex items-center justify-center gap-3 mb-1.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-700 via-rose-600 to-rose-800 flex items-center justify-center shadow-lg shadow-rose-700/25 text-white">
              <Eye className="w-7 h-7" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
              Derma<span className="text-rose-600">Lens</span>
            </h1>
          </div>

          <p className="text-sm font-serif italic text-rose-800/90 font-semibold tracking-wide mb-3">
            — Look Beyond the Label
          </p>
        </div>

        {/* ======================================================== */}
        {/* VIEW 1 & 2: SIGN UP & LOGIN TABBED CONTAINER */}
        {/* ======================================================== */}
        {view !== 'forgot_password' && (
          <div className="bg-white border border-rose-100 rounded-3xl p-7 sm:p-9 shadow-xl shadow-rose-900/5">
            {/* Tab selector */}
            <div className="grid grid-cols-2 p-1 bg-rose-50/70 rounded-2xl mb-6 border border-rose-100">
              <button
                type="button"
                onClick={() => {
                  setView('signup');
                  setError('');
                  setSuccessMessage('');
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  view === 'signup'
                    ? 'bg-rose-700 text-white shadow-sm shadow-rose-900/20'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => {
                  setView('login');
                  setError('');
                  setSuccessMessage('');
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  view === 'login'
                    ? 'bg-rose-700 text-white shadow-sm shadow-rose-900/20'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Login
              </button>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0"></span>
                <span>{error}</span>
              </div>
            )}

            {/* Success banner */}
            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* ================= SIGN UP FORM ================= */}
            {view === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                {/* Full Name (Required) */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-50/60 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:bg-white focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition"
                    />
                  </div>
                </div>

                {/* Email Address (Required) */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-50/60 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:bg-white focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition"
                    />
                  </div>
                </div>

                {/* Create Password (Required - "without password no sign up should be there") */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-neutral-700">
                      Create Password
                    </label>
                    <span className="text-[11px] text-neutral-400">Min 6 characters</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-neutral-50/60 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:bg-white focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showSignUpPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Phone Number (Optional - "make phone number optional") */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-neutral-700">
                      Phone Number
                    </label>
                    <span className="text-[11px] text-neutral-400">Optional</span>
                  </div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000 (optional)"
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-50/60 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:bg-white focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition"
                    />
                  </div>
                </div>

                {/* Submit: Create Account */}
                <button
                  type="submit"
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 hover:from-rose-800 hover:to-rose-700 text-white font-bold text-sm shadow-md shadow-rose-900/20 flex items-center justify-center gap-2 active:scale-[0.99] transition duration-150 cursor-pointer"
                >
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* ================= LOGIN FORM ================= */}
            {view === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-50/60 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:bg-white focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-neutral-50/60 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:bg-white focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showLoginPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password option in small font below password */}
                <div className="flex justify-end -mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setView('forgot_password');
                      setError('');
                      setSuccessMessage('');
                      if (loginEmail) setForgotEmail(loginEmail);
                    }}
                    className="text-xs text-rose-700 hover:text-rose-800 font-medium hover:underline transition cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit: Login */}
                <button
                  type="submit"
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 hover:from-rose-800 hover:to-rose-700 text-white font-bold text-sm shadow-md shadow-rose-900/20 flex items-center justify-center gap-2 active:scale-[0.99] transition duration-150 cursor-pointer"
                >
                  Login to DermaLens
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: FORGOT PASSWORD PAGE WITH EMAIL & OTP */}
        {/* ======================================================== */}
        {view === 'forgot_password' && (
          <div className="bg-white border border-rose-100 rounded-3xl p-7 sm:p-9 shadow-xl shadow-rose-900/5">
            {/* Header with back button */}
            <div className="flex items-center gap-2 mb-5">
              <button
                type="button"
                onClick={() => {
                  setView('login');
                  setError('');
                  setSuccessMessage('');
                }}
                className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-rose-50 text-neutral-600 hover:text-rose-700 flex items-center justify-center transition cursor-pointer"
                title="Back to Login"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Reset Password</h2>
                <p className="text-xs text-neutral-500">
                  Verification OTP will be sent to your email address
                </p>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0"></span>
                <span>{error}</span>
              </div>
            )}

            {/* Success Banner / OTP simulation */}
            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>OTP Sent Successfully</span>
                </div>
                <p className="text-emerald-700">{successMessage}</p>
                {generatedOtp && (
                  <div className="mt-2 pt-2 border-t border-emerald-200 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-800 font-mono">
                      Generated Code: <strong className="font-bold text-sm tracking-wider">{generatedOtp}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setEnteredOtp(generatedOtp)}
                      className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold cursor-pointer"
                    >
                      Auto-Fill OTP
                    </button>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              {/* Step 1: Email Address & Send OTP Button */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Email Address
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-3 py-2.5 bg-neutral-50/60 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:bg-white focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={otpCooldown > 0}
                    onClick={handleSendOtp}
                    className="px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 disabled:bg-neutral-200 disabled:text-neutral-400 text-white font-semibold text-xs shrink-0 flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-rose-900/10"
                  >
                    {otpCooldown > 0 ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        {otpCooldown}s
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        {otpSent ? 'Resend OTP' : 'Send OTP'}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Step 2: Enter OTP */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-neutral-700">
                    6-Digit OTP Code
                  </label>
                  {otpSent && (
                    <span className="text-[11px] text-rose-700 font-medium">
                      Check your email inbox
                    </span>
                  )}
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP code"
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-50/60 border border-neutral-200 rounded-xl text-neutral-900 text-sm font-mono tracking-widest focus:outline-none focus:bg-white focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition"
                  />
                </div>
              </div>

              {/* Step 3: New Password */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password (min 6 characters)"
                    className="w-full pl-10 pr-10 py-2.5 bg-neutral-50/60 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:bg-white focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Step 4: Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-50/60 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:bg-white focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition"
                  />
                </div>
              </div>

              {/* Submit: Reset Password */}
              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 hover:from-rose-800 hover:to-rose-700 text-white font-bold text-sm shadow-md shadow-rose-900/20 flex items-center justify-center gap-2 active:scale-[0.99] transition duration-150 cursor-pointer"
              >
                Verify OTP & Reset Password
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Back to login option */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setView('login');
                    setError('');
                    setSuccessMessage('');
                  }}
                  className="text-xs text-neutral-500 hover:text-rose-700 font-medium transition cursor-pointer"
                >
                  Remembered your password? <span className="text-rose-700 font-bold">Back to Login</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Feature Highlights Footer */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-white border border-rose-100/80 shadow-xs">
            <span className="block text-rose-700 font-bold text-xs">Red Flagging</span>
            <span className="text-[10px] text-neutral-500">Pore-Clogging & Toxins</span>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-rose-100/80 shadow-xs">
            <span className="block text-rose-700 font-bold text-xs">Cross-Analysis</span>
            <span className="text-[10px] text-neutral-500">Diet & Skin Triggers</span>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-rose-100/80 shadow-xs">
            <span className="block text-rose-700 font-bold text-xs">Clean Swaps</span>
            <span className="text-[10px] text-neutral-500">Direct Purchase Links</span>
          </div>
        </div>
      </div>
    </div>
  );
};
