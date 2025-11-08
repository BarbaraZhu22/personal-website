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

try {
  run('git lfs install');

  let remote = '';
  try {
    remote = execSync('git remote get-url origin', {
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf8',
    }).trim();
  } catch {
    const repoUrl =
      process.env.VERCEL_GIT_REPOSITORY_URL || process.env.VERCEL_GIT_REPO_URL;
    if (repoUrl) {
      console.log(`[prebuild] Adding git remote "origin" from ${repoUrl}`);
      run(`git remote add origin ${repoUrl}`);
      remote = repoUrl;
    } else {
      console.log(
        '[prebuild] Git remote "origin" not found and VERCEL_GIT_REPOSITORY_URL is missing. Falling back to default git-lfs pull.'
      );
    }
  }

  if (remote) {
    run('git lfs pull origin');
  } else {
    run('git lfs pull');
  }
} catch (error) {
  console.error('[prebuild] Git LFS commands failed:', error.message);
  process.exit(1);
}
