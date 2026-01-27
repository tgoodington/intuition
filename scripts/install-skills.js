#!/usr/bin/env node

/**
 * Installation script for Intuition skills
 *
 * This script is run after `npm install -g intuition`
 * It copies the /plan and /execute skills to ~/.claude/skills/ for global access
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Utilities
function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    const stat = fs.statSync(srcFile);

    if (stat.isDirectory()) {
      copyDirRecursive(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

function log(msg) {
  console.log(`[intuition-install] ${msg}`);
}

function error(msg) {
  console.error(`[intuition-install] ERROR: ${msg}`);
}

// Main installation logic
try {
  const homeDir = os.homedir();
  const claudeSkillsDir = path.join(homeDir, '.claude', 'skills');

  // Get the location of the installed package (where this script is running from)
  // In npm global installation, this is typically in node_modules/intuition/
  const packageRoot = path.dirname(path.dirname(path.resolve(__filename)));

  log(`Installing Intuition skills...`);
  log(`Package root: ${packageRoot}`);
  log(`Target directory: ${claudeSkillsDir}`);

  // Create ~/.claude/skills if it doesn't exist
  if (!fs.existsSync(claudeSkillsDir)) {
    fs.mkdirSync(claudeSkillsDir, { recursive: true });
    log(`Created ${claudeSkillsDir}`);
  }

  // Copy /plan skill
  const planSrc = path.join(packageRoot, 'skills', 'plan');
  const planDest = path.join(claudeSkillsDir, 'plan');

  if (fs.existsSync(planSrc)) {
    copyDirRecursive(planSrc, planDest);
    log(`✓ Installed /plan skill to ${planDest}`);
  } else {
    error(`plan skill not found at ${planSrc}`);
    process.exit(1);
  }

  // Copy /execute skill
  const executeSrc = path.join(packageRoot, 'skills', 'execute');
  const executeDest = path.join(claudeSkillsDir, 'execute');

  if (fs.existsSync(executeSrc)) {
    copyDirRecursive(executeSrc, executeDest);
    log(`✓ Installed /execute skill to ${executeDest}`);
  } else {
    error(`execute skill not found at ${executeSrc}`);
    process.exit(1);
  }

  // Verify installation
  if (fs.existsSync(planDest) && fs.existsSync(executeDest)) {
    log(`✓ Installation complete!`);
    log(`Skills are now available globally:`);
    log(`  /plan   - Planning skill`);
    log(`  /execute - Execution skill`);
    log(`\nYou can now use these skills in any project with Claude Code.`);
  } else {
    error(`Verification failed - skills not properly installed`);
    process.exit(1);
  }

} catch (err) {
  error(`Installation failed: ${err.message}`);
  console.error(err);
  process.exit(1);
}
