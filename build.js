import fs from 'fs';
import { execSync } from 'child_process';

console.log('[Build] Starting NEWS 24*7 build process...');
console.log('[Build] Current working directory:', process.cwd());

if (fs.existsSync('frontend')) {
  console.log('[Build] Detected monorepo root. Building frontend...');
  execSync('npm --prefix frontend install && npm --prefix frontend run build', { stdio: 'inherit' });
  
  if (fs.existsSync('frontend/dist')) {
    console.log('[Build] Copying frontend/dist to root dist...');
    fs.cpSync('frontend/dist', 'dist', { recursive: true });
    console.log('[Build] Successfully prepared root dist directory.');
  }
} else {
  console.log('[Build] Building inside frontend directory...');
  execSync('npm install && npm run build', { stdio: 'inherit' });
}

console.log('[Build] Complete!');
