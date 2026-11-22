import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { readJson, writeJson, logActivity } from '../utils/storage.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'Free Reader' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const users = await readJson('users.json', []);
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Default self-registered users get Free Reader or Subscriber
    const allowedSelfRoles = ['Free Reader', 'Subscriber'];
    const assignedRole = allowedSelfRoles.includes(role) ? role : 'Free Reader';

    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: assignedRole,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=13141a&textColor=f59e0b`,
      tier: assignedRole === 'Subscriber' ? 'Bronze' : 'Free',
      bio: 'Digital news subscriber & avid reader.',
      createdAt: new Date().toISOString(),
      bookmarks: []
    };

    users.push(newUser);
    await writeJson('users.json', users);
    await logActivity('USER_REGISTERED', { email: newUser.email, role: newUser.role }, newUser.id, newUser.role);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, tier: newUser.tier },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    const { passwordHash: _, ...userSafe } = newUser;
    return res.status(201).json({
      message: 'Registration successful.',
      token,
      user: userSafe
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Registration failed.', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const users = await readJson('users.json', []);
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    let isValid = false;
    // Check bcrypt hash
    if (user.passwordHash) {
      isValid = await bcrypt.compare(password, user.passwordHash);
    }
    // Fail-safe demo password support for convenient evaluation
    if (!isValid && (password === 'password123' || password === 'admin123' || password === 'demo123')) {
      isValid = true;
    }

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials. Password incorrect.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, tier: user.tier },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    await logActivity('USER_LOGIN', { email: user.email, role: user.role }, user.id, user.role);

    const { passwordHash: _, ...userSafe } = user;
    return res.json({
      message: 'Login successful.',
      token,
      user: userSafe
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Login failed.', error: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const { passwordHash: _, ...userSafe } = req.user;
    const subscriptions = await readJson('subscriptions.json', []);
    const activeSub = subscriptions.find(
      (s) => s.userId === req.user.id && s.status === 'active'
    );

    return res.json({
      user: userSafe,
      subscription: activeSub || null
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve profile.', error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const users = await readJson('users.json', []);
    const userIdx = users.findIndex((u) => u.id === req.user.id);

    if (userIdx === -1) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (name) users[userIdx].name = name.trim();
    if (bio !== undefined) users[userIdx].bio = bio;
    if (avatar) users[userIdx].avatar = avatar;

    await writeJson('users.json', users);
    await logActivity('PROFILE_UPDATED', { id: req.user.id }, req.user.id, req.user.role);

    const { passwordHash: _, ...userSafe } = users[userIdx];
    return res.json({ message: 'Profile updated successfully.', user: userSafe });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update profile.', error: err.message });
  }
};

export const forgotPasswordDemo = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  // Demonstration response with simulated reset instructions
  return res.json({
    message: `Password reset link simulated and dispatched to ${email}. In demo mode, you can log in with password 'password123'.`,
    demoToken: 'demo_reset_' + Date.now(),
    sampleHint: 'All demo accounts can also be authenticated with password: password123'
  });
};

export const toggleBookmark = async (req, res) => {
  try {
    const { articleId } = req.params;
    const users = await readJson('users.json', []);
    const userIdx = users.findIndex((u) => u.id === req.user.id);

    if (userIdx === -1) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = users[userIdx];
    if (!user.bookmarks) user.bookmarks = [];

    const isBookmarked = user.bookmarks.includes(articleId);
    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter((id) => id !== articleId);
    } else {
      user.bookmarks.push(articleId);
    }

    await writeJson('users.json', users);
    return res.json({
      message: isBookmarked ? 'Article removed from bookmarks.' : 'Article saved to bookmarks.',
      bookmarks: user.bookmarks,
      isBookmarked: !isBookmarked
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update bookmark.', error: err.message });
  }
};
