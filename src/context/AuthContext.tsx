import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, PasswordResetRequest, UserRole } from '../types';

export interface LoginResult {
  success: boolean;
  error?: string;
  attemptsRemaining?: number;
  remainingSeconds?: number;
  lockedUntil?: number | null;
  requiresPasswordSetup?: boolean;
  user?: AuthUser;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  users: AuthUser[];
  login: (identifier: string, password: string) => LoginResult;
  logout: () => void;
  requestPasswordReset: (email: string) => { success: boolean; error?: string; token?: string; resetLink?: string };
  verifyResetToken: (token: string) => { valid: boolean; email?: string; error?: string };
  resetPasswordWithToken: (token: string, newPassword: string) => { success: boolean; error?: string };
  setupFirstTimePassword: (userId: string, newPassword: string) => { success: boolean; error?: string };
  registerUser: (name: string, email: string, password: string) => { success: boolean; error?: string; user?: AuthUser };
  unlockUser: (userId: string) => void;
  resetUserPasswordByAdmin: (userId: string, newPassword: string) => void;
  lastSimulatedEmail: { to: string; subject: string; link: string; token: string; sentAt: string } | null;
  clearSimulatedEmail: () => void;
  getRemainingLockoutSeconds: (userOrEmail: string | AuthUser) => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_USERS: AuthUser[] = [
  {
    id: 'user-admin-01',
    email: 'admin@sentinel.sec',
    username: 'admin',
    displayName: 'Supreme Commander (Head Admin)',
    role: 'SUPER_ADMIN_HEAD',
    passwordHash: 'Admin@2026!',
    isFirstTimeUser: false,
    failedAttempts: 0,
    lockUntil: null,
    lastLogin: '2026-09-19T18:00:00.000Z',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-officer-02',
    email: 'newofficer@sentinel.sec',
    username: 'newofficer',
    displayName: 'Officer Alex Vance',
    role: 'SECURITY_ANALYST',
    passwordHash: 'Temp@12345',
    isFirstTimeUser: true, // Requires setting initial password on first login
    failedAttempts: 0,
    lockUntil: null,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-analyst-03',
    email: 'analyst@sentinel.sec',
    username: 'analyst',
    displayName: 'Sarah Connor (Senior Analyst)',
    role: 'SECURITY_ANALYST',
    passwordHash: 'Analyst@2026!',
    isFirstTimeUser: false,
    failedAttempts: 0,
    lockUntil: null,
    lastLogin: '2026-09-19T17:30:00.000Z',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  },
];

const USERS_STORAGE_KEY = 'sentinel_auth_users_v1';
const CURRENT_USER_STORAGE_KEY = 'sentinel_active_user_v1';
const RESET_REQUESTS_KEY = 'sentinel_reset_requests_v1';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize users from localStorage or default
  const [users, setUsers] = useState<AuthUser[]>(() => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return INITIAL_USERS;
  });

  // Initialize current user
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return INITIAL_USERS[0]; // Defaults to Head Admin
  });

  // Reset requests
  const [resetRequests, setResetRequests] = useState<PasswordResetRequest[]>(() => {
    try {
      const stored = localStorage.getItem(RESET_REQUESTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Simulated email dispatch record for demonstration
  const [lastSimulatedEmail, setLastSimulatedEmail] = useState<{
    to: string;
    subject: string;
    link: string;
    token: string;
    sentAt: string;
  } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch {
      // ignore
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(RESET_REQUESTS_KEY, JSON.stringify(resetRequests));
    } catch {
      // ignore
    }
  }, [resetRequests]);

  // Helper to calculate remaining lockout seconds
  const getRemainingLockoutSeconds = (userOrEmail: string | AuthUser): number => {
    const user =
      typeof userOrEmail === 'string'
        ? users.find(
            (u) =>
              u.email.toLowerCase() === userOrEmail.toLowerCase() ||
              u.username.toLowerCase() === userOrEmail.toLowerCase()
          )
        : userOrEmail;

    if (!user || !user.lockUntil) return 0;
    const remainingMs = user.lockUntil - Date.now();
    if (remainingMs <= 0) return 0;
    return Math.ceil(remainingMs / 1000);
  };

  // Login handler
  const login = (identifier: string, password: string): LoginResult => {
    const trimmedId = identifier.trim().toLowerCase();
    const userIndex = users.findIndex(
      (u) => u.email.toLowerCase() === trimmedId || u.username.toLowerCase() === trimmedId
    );

    if (userIndex === -1) {
      return {
        success: false,
        error: 'No Sentinel Enclave identity found with this email or username.',
      };
    }

    const user = users[userIndex];
    const now = Date.now();

    // Check if account is locked
    if (user.lockUntil) {
      if (now < user.lockUntil) {
        const remainingSeconds = Math.ceil((user.lockUntil - now) / 1000);
        return {
          success: false,
          error: 'ACCOUNT_LOCKED',
          remainingSeconds,
          lockedUntil: user.lockUntil,
        };
      } else {
        // Lockout expired, automatically reset lockout status
        user.lockUntil = null;
        user.failedAttempts = 0;
      }
    }

    // Verify password
    if (user.passwordHash !== password) {
      const newFailedAttempts = user.failedAttempts + 1;
      let newLockUntil: number | null = null;
      let error = 'INVALID_CREDENTIALS';

      if (newFailedAttempts >= 3) {
        // Lock for 5 minutes (300,000 ms)
        newLockUntil = now + 5 * 60 * 1000;
        error = 'ACCOUNT_LOCKED';
      }

      const updatedUsers = [...users];
      updatedUsers[userIndex] = {
        ...user,
        failedAttempts: newFailedAttempts,
        lockUntil: newLockUntil,
      };
      setUsers(updatedUsers);

      if (newLockUntil) {
        return {
          success: false,
          error: 'ACCOUNT_LOCKED',
          remainingSeconds: 300,
          lockedUntil: newLockUntil,
        };
      }

      return {
        success: false,
        error: 'INVALID_CREDENTIALS',
        attemptsRemaining: 3 - newFailedAttempts,
      };
    }

    // Password correct: reset failed attempts and lockout
    const updatedUser: AuthUser = {
      ...user,
      failedAttempts: 0,
      lockUntil: null,
      lastLogin: new Date().toISOString(),
    };

    const updatedUsers = [...users];
    updatedUsers[userIndex] = updatedUser;
    setUsers(updatedUsers);

    // Check if first-time user
    if (updatedUser.isFirstTimeUser) {
      return {
        success: true,
        requiresPasswordSetup: true,
        user: updatedUser,
      };
    }

    setCurrentUser(updatedUser);
    return {
      success: true,
      user: updatedUser,
    };
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
  };

  // Request password reset (generates email verification link)
  const requestPasswordReset = (email: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!user) {
      return {
        success: false,
        error: 'No enclave account associated with this email address.',
      };
    }

    // Generate verification token
    const token = 'tok_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins expiry
    const newRequest: PasswordResetRequest = {
      id: 'req_' + Date.now(),
      email: user.email,
      token,
      expiresAt,
      used: false,
      createdAt: new Date().toISOString(),
    };

    setResetRequests((prev) => [newRequest, ...prev]);

    const resetLink = `https://sentinel.cyberwarrior.io/reset-password?token=${token}`;

    // Simulate sending email
    setLastSimulatedEmail({
      to: user.email,
      subject: '[Sentinel Enclave] Secure Password Reset Verification Link',
      link: resetLink,
      token,
      sentAt: new Date().toLocaleTimeString(),
    });

    return {
      success: true,
      token,
      resetLink,
    };
  };

  // Verify reset token
  const verifyResetToken = (token: string) => {
    const req = resetRequests.find((r) => r.token === token);
    if (!req) {
      return { valid: false, error: 'Invalid or unrecognized verification token.' };
    }
    if (req.used) {
      return { valid: false, error: 'This verification link has already been used.' };
    }
    if (Date.now() > req.expiresAt) {
      return { valid: false, error: 'Verification link has expired (15 min envelope exceeded).' };
    }
    return { valid: true, email: req.email };
  };

  // Reset password using token
  const resetPasswordWithToken = (token: string, newPassword: string) => {
    const verification = verifyResetToken(token);
    if (!verification.valid || !verification.email) {
      return { success: false, error: verification.error || 'Verification failed.' };
    }

    const userIndex = users.findIndex((u) => u.email.toLowerCase() === verification.email!.toLowerCase());
    if (userIndex === -1) {
      return { success: false, error: 'User associated with token no longer exists.' };
    }

    // Mark token as used
    setResetRequests((prev) =>
      prev.map((r) => (r.token === token ? { ...r, used: true } : r))
    );

    // Update user password and clear lockout / failed attempts
    const updatedUsers = [...users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      passwordHash: newPassword,
      failedAttempts: 0,
      lockUntil: null,
      isFirstTimeUser: false,
    };
    setUsers(updatedUsers);

    return { success: true };
  };

  // First-time user password setup
  const setupFirstTimePassword = (userId: string, newPassword: string) => {
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return { success: false, error: 'User not found.' };
    }

    const updatedUser: AuthUser = {
      ...users[userIndex],
      passwordHash: newPassword,
      isFirstTimeUser: false,
      failedAttempts: 0,
      lockUntil: null,
      lastLogin: new Date().toISOString(),
    };

    const updatedUsers = [...users];
    updatedUsers[userIndex] = updatedUser;
    setUsers(updatedUsers);
    setCurrentUser(updatedUser);

    return { success: true };
  };

  // Register new user with own email and password
  const registerUser = (name: string, email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, error: 'An account with this email already exists in the enclave.' };
    }

    const newUser: AuthUser = {
      id: 'user_' + Date.now(),
      email: trimmedEmail,
      username: trimmedEmail.split('@')[0],
      displayName: name.trim() || trimmedEmail.split('@')[0],
      role: 'SECURITY_ANALYST',
      passwordHash: password,
      isFirstTimeUser: false,
      failedAttempts: 0,
      lockUntil: null,
      lastLogin: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    return { success: true, user: newUser };
  };

  // Head Admin action: unlock any user immediately
  const unlockUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, failedAttempts: 0, lockUntil: null } : u
      )
    );
  };

  // Head Admin action: reset user's password directly
  const resetUserPasswordByAdmin = (userId: string, newPassword: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, passwordHash: newPassword, failedAttempts: 0, lockUntil: null }
          : u
      )
    );
  };

  const clearSimulatedEmail = () => {
    setLastSimulatedEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        users,
        login,
        logout,
        requestPasswordReset,
        verifyResetToken,
        resetPasswordWithToken,
        setupFirstTimePassword,
        registerUser,
        unlockUser,
        resetUserPasswordByAdmin,
        lastSimulatedEmail,
        clearSimulatedEmail,
        getRemainingLockoutSeconds,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
