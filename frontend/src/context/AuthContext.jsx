import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

// Built-in demo accounts for instant 1-click testing
export const DEMO_ACCOUNTS = [
  { role: 'Super Admin', email: 'admin@news247.global', name: 'Vikramaditya Roy', tier: 'Gold', desc: 'Full CMS, system settings, approve/reject' },
  { role: 'Chief Editor', email: 'chief.editor@news247.global', name: 'Sarah Hastings', tier: 'Gold', desc: 'Editorial review, publish, manage articles' },
  { role: 'Section Editor', email: 'section.editor@news247.global', name: 'Rajesh Nambiar', tier: 'Silver', desc: 'Review & approve articles by authors' },
  { role: 'Author/Journalist', email: 'author@news247.global', name: 'Priya Sen Sharma', tier: 'Bronze', desc: 'Draft articles, submit for editorial review' },
  { role: 'Subscriber', email: 'subscriber@news247.global', name: 'Devendra Singhania', tier: 'Gold', desc: 'VIP Gold reader with all paywall passes' },
  { role: 'Free Reader', email: 'reader@news247.global', name: 'Ananya Verma', tier: 'Free', desc: 'Standard reader with free articles only' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('news247_token') || null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  // Fetch current user details
  const fetchCurrentUser = async () => {
    if (!localStorage.getItem('news247_token')) {
      setUser(null);
      setSubscription(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
      setSubscription(res.data.subscription);
    } catch (err) {
      console.error('Failed to authenticate session:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  // Login
  const login = async (email, password = 'password123') => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('news247_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  // Register
  const register = async (name, email, password, role = 'Free Reader') => {
    const res = await api.post('/auth/register', { name, email, password, role });
    localStorage.setItem('news247_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  // Switch demo account instantly
  const switchDemoAccount = async (email) => {
    return login(email, 'password123');
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('news247_token');
    setToken(null);
    setUser(null);
    setSubscription(null);
  };

  // Toggle bookmark
  const toggleBookmark = async (articleId) => {
    if (!user) return false;
    try {
      const res = await api.post(`/auth/bookmarks/${articleId}`);
      setUser((prev) => ({
        ...prev,
        bookmarks: res.data.bookmarks
      }));
      return res.data.isBookmarked;
    } catch (err) {
      console.error('Bookmark toggle error:', err);
      return false;
    }
  };

  const isBookmarked = (articleId) => {
    return user?.bookmarks?.includes(articleId) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        subscription,
        login,
        register,
        logout,
        switchDemoAccount,
        toggleBookmark,
        isBookmarked,
        refreshUser: fetchCurrentUser,
        isAuthenticated: !!user,
        isEditorialStaff: ['Super Admin', 'Chief Editor', 'Section Editor', 'Author/Journalist'].includes(user?.role),
        isAdmin: ['Super Admin', 'Chief Editor'].includes(user?.role),
        isSuperAdmin: user?.role === 'Super Admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
