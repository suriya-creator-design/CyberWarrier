import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Clock,
  ExternalLink,
} from 'lucide-react';

type LoginStep = 'login' | 'forgot_password' | 'email_sent' | 'reset_password' | 'first_time_setup';

export const AuthScreen: React.FC = () => {
  const {
    login,
    requestPasswordReset,
    resetPasswordWithToken,
    setupFirstTimePassword,
    lastSimulatedEmail,
    users,
  } = useAuth();

  const [step, setStep] = useState<LoginStep>('login');

  // Basic login inputs
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Messages & lockout
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lockSeconds, setLockSeconds] = useState(0);

  // Password reset state
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // First-time user setup
  const [pendingUser, setPendingUser] = useState<{ id: string; name: string } | null>(null);

  // 5-minute countdown timer
  useEffect(() => {
    if (!isLocked || lockSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockSeconds((prev) => {
        if (prev <= 1) {
          setIsLocked(false);
          setError(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isLocked, lockSeconds]);

  // Check if current typed user is locked
  useEffect(() => {
    const trimmed = emailOrUser.trim().toLowerCase();
    const user = users.find(
      (u) => u.email.toLowerCase() === trimmed || u.username.toLowerCase() === trimmed
    );
    if (user && user.lockUntil && Date.now() < user.lockUntil) {
      setIsLocked(true);
      setLockSeconds(Math.ceil((user.lockUntil - Date.now()) / 1000));
    } else {
      setIsLocked(false);
      setLockSeconds(0);
    }
  }, [emailOrUser, users]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Submit Basic Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!emailOrUser.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    const res = login(emailOrUser, password);

    if (res.success) {
      if (res.requiresPasswordSetup && res.user) {
        setPendingUser({ id: res.user.id, name: res.user.displayName });
        setStep('first_time_setup');
        return;
      }
      return;
    }

    if (res.error === 'ACCOUNT_LOCKED') {
      setIsLocked(true);
      setLockSeconds(res.remainingSeconds || 300);
      setError('Account blocked for 5 minutes due to 3 incorrect password attempts.');
    } else if (res.error === 'INVALID_CREDENTIALS') {
      const remaining = res.attemptsRemaining ?? 0;
      setError(
        `Incorrect password. ${remaining} ${
          remaining === 1 ? 'attempt' : 'attempts'
        } remaining before a 5-minute lockout.`
      );
    } else {
      setError(res.error || 'Login failed.');
    }
  };

  // Request Password Reset
  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!resetEmail.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

    const res = requestPasswordReset(resetEmail);
    if (!res.success) {
      setError(res.error || 'Failed to send reset link.');
      return;
    }

    if (res.token) setResetToken(res.token);
    setStep('email_sent');
  };

  // Save New Password via Reset Token
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const res = resetPasswordWithToken(resetToken, newPassword);
    if (!res.success) {
      setError(res.error || 'Reset failed.');
      return;
    }

    setSuccess('Password successfully reset! Your account is unlocked. Please log in.');
    setPassword(newPassword);
    setNewPassword('');
    setConfirmPassword('');
    setIsLocked(false);
    setStep('login');
  };

  // First-Time User Password Setup
  const handleFirstTimeSetup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pendingUser) return;
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const res = setupFirstTimePassword(pendingUser.id, newPassword);
    if (!res.success) {
      setError(res.error || 'Failed to set password.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#070D18] flex items-center justify-center p-4 text-slate-100 font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* Enclave Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono tracking-wider text-white">
              SENTINEL PROTOCOL
            </h1>
            <p className="text-xs text-slate-400 font-mono">Web3 Security Enclave Login</p>
          </div>
        </div>

        {/* Basic Login Box */}
        <div className="bg-[#0B132B]/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
          {/* ================= STEP 1: BASIC LOGIN ================= */}
          {step === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h2 className="text-sm font-mono font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  Sign In to Enclave
                </h2>
              </div>

              {/* Success Notification */}
              {success && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {/* 5-Minute Lockout Alert */}
              {isLocked ? (
                <div className="p-4 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs space-y-2 font-mono">
                  <div className="flex items-center gap-2 font-bold text-red-400 text-sm">
                    <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                    ACCOUNT BLOCKED (5 MINUTES)
                  </div>
                  <p className="text-slate-300 text-[11px] font-sans">
                    3 incorrect password attempts detected. Account is locked for 5 minutes.
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-red-900/50">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-red-400" />
                      Time Remaining:
                    </span>
                    <span className="font-bold text-red-400 text-sm tracking-wider">
                      {formatTime(lockSeconds)}
                    </span>
                  </div>
                </div>
              ) : error ? (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-start gap-2 font-mono">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              ) : null}

              {/* Email / Username Field */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Email or Username</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={emailOrUser}
                    onChange={(e) => setEmailOrUser(e.target.value)}
                    disabled={isLocked}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-400 disabled:opacity-50 transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <label className="text-slate-400">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(emailOrUser.includes('@') ? emailOrUser : '');
                      setError(null);
                      setStep('forgot_password');
                    }}
                    className="text-cyan-400 hover:underline text-[11px]"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLocked}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-400 disabled:opacity-50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLocked}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLocked}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                {isLocked ? `Locked (${formatTime(lockSeconds)})` : 'Log In'}
              </button>

              {/* Quick Reset Option if Account is Locked */}
              {isLocked && (
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(emailOrUser.includes('@') ? emailOrUser : '');
                    setStep('forgot_password');
                  }}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-mono transition-colors text-center"
                >
                  Reset Password via Email to Unlock
                </button>
              )}
            </form>
          )}

          {/* ================= STEP 2: FORGOT PASSWORD ================= */}
          {step === 'forgot_password' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setStep('login');
                  }}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-sm font-mono font-bold text-white">Reset Password</h2>
              </div>

              <p className="text-xs text-slate-400 font-sans">
                Enter your registered email. A password reset verification link will be sent to your inbox.
              </p>

              {error && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-3.5 h-3.5" />
                Send Verification Link
              </button>
            </form>
          )}

          {/* ================= STEP 3: EMAIL SENT ================= */}
          {step === 'email_sent' && lastSimulatedEmail && (
            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => setStep('login')}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  Verification Email Sent
                </h2>
              </div>

              {/* Simulated Email Preview */}
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-3">
                <div className="text-[11px] text-slate-400 border-b border-slate-800 pb-1.5 flex justify-between">
                  <span>To: {lastSimulatedEmail.to}</span>
                  <span className="text-cyan-400">{lastSimulatedEmail.sentAt}</span>
                </div>
                <div className="font-bold text-white">{lastSimulatedEmail.subject}</div>
                <p className="text-slate-400 text-[11px] font-sans">
                  A verification link was dispatched to your email. Click the link below to reset your password and unlock your account.
                </p>
                <button
                  onClick={() => setStep('reset_password')}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Click Verification Link
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setStep('login')}
                  className="text-slate-400 hover:text-white text-xs underline"
                >
                  Return to Login
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: SET NEW PASSWORD ================= */}
          {step === 'reset_password' && (
            <form onSubmit={handleResetPassword} className="space-y-4 font-mono text-xs">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => setStep('login')}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-sm font-bold text-white">Set New Password</h2>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-slate-400">New Password (min 8 chars)</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Confirm Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase transition-all"
              >
                Save Password & Unlock Account
              </button>
            </form>
          )}

          {/* ================= STEP 5: FIRST-TIME USER SETUP ================= */}
          {step === 'first_time_setup' && pendingUser && (
            <form onSubmit={handleFirstTimeSetup} className="space-y-4 font-mono text-xs">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-cyan-400 font-bold text-[10px] uppercase">
                  First-Time User Setup
                </span>
                <h2 className="text-sm font-bold text-white mt-0.5">
                  Set Your Password
                </h2>
                <p className="text-xs text-slate-400 font-sans mt-1">
                  Welcome, <strong className="text-white">{pendingUser.name}</strong>. Please set your permanent password before entering the enclave.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-slate-400">New Password (min 8 chars)</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter permanent password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Confirm Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase transition-all"
              >
                Confirm Password & Enter Enclave
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] font-mono text-slate-600">
          Sentinel Protocol • Enclave Authentication
        </div>
      </div>
    </div>
  );
};
