import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'news247_super_secure_jwt_secret_token_key_2026',
  jwtExpiresIn: '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  dataDir: path.resolve(__dirname, '../../data'),
  uploadsDir: path.resolve(__dirname, '../../uploads'),
  cronSchedule: process.env.REFRESH_NEWS_CRON || '*/15 * * * *'
};
