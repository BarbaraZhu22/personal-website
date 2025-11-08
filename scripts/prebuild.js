#!/usr/bin/env node

const { execSync } = require('child_process');

const exit = (message) => {
  if (message) {
    console.log(message);
  }
  process.exit(0);
};

const run = (command) => {
  execSync(command, { stdio: 'inherit' });
};

const isVercel = Boolean(process.env.VERCEL);
const vercelGitLfs = process.env.VERCEL_GIT_LFS === '1';
if (isVercel && !vercelGitLfs) {
  exit(
    '[prebuild] Detected Vercel environment without VERCEL_GIT_LFS=1 – skipping Git LFS commands.'
  );
}

try {
  execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
} catch {
  exit('[prebuild] Not inside a Git repository – skipping Git LFS commands.');
}

const hasOriginRemote = (() => {
  try {
    const remote = execSync('git remote get-url origin', {
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf8',
    }).trim();
    return Boolean(remote);
  } catch {
    return false;
  }
})();

if (!hasOriginRemote) {
  exit(
    '[prebuild] No git remote "origin" detected. Ensure VERCEL_GIT_LFS=1 is enabled so Vercel clones the repository using Git.'
  );
}

try {
  run('git lfs install');
  run('git lfs pull origin');
} catch (error) {
  console.error('[prebuild] Git LFS commands failed:', error.message);
  process.exit(1);
}
