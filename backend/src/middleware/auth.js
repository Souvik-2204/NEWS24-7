import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { readJson } from '../utils/storage.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);
    const users = await readJson('users.json', []);
    const user = users.find((u) => u.id === decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found or token invalid.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
};

/**
 * Optional authentication middleware for guest readers who might have a token
 */
export const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwtSecret);
      const users = await readJson('users.json', []);
      const user = users.find((u) => u.id === decoded.id);
      if (user) req.user = user;
    }
  } catch (err) {
    // Ignore invalid tokens for optional auth
  }
  next();
};

/**
 * Role-based authorization guard
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: role '${req.user.role}' lacks permission for this action.`
      });
    }
    next();
  };
};

/**
 * Tier-based paywall checker
 */
export const checkContentAccess = (userTier = 'free', requiredTier = 'free') => {
  const tierRanking = {
    free: 0,
    bronze: 1,
    silver: 2,
    gold: 3
  };

  const userRank = tierRanking[(userTier || 'free').toLowerCase()] ?? 0;
  const requiredRank = tierRanking[(requiredTier || 'free').toLowerCase()] ?? 0;

  return userRank >= requiredRank;
};
