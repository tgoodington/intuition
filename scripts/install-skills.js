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

  // Copy /intuition-start skill
  const startSrc = path.join(packageRoot, 'skills', 'intuition-start');
  const startDest = path.join(claudeSkillsDir, 'intuition-start');

  if (fs.existsSync(startSrc)) {
    copyDirRecursive(startSrc, startDest);
    log(`✓ Installed /intuition-start skill to ${startDest}`);
  } else {
    error(`intuition-start skill not found at ${startSrc}`);
    process.exit(1);
  }

  // Copy /intuition-plan skill
  const planSrc = path.join(packageRoot, 'skills', 'intuition-plan');
  const planDest = path.join(claudeSkillsDir, 'intuition-plan');

  if (fs.existsSync(planSrc)) {
    copyDirRecursive(planSrc, planDest);
    log(`✓ Installed /intuition-plan skill to ${planDest}`);
  } else {
    error(`intuition-plan skill not found at ${planSrc}`);
    process.exit(1);
  }

  // Copy /intuition-execute skill
  const executeSrc = path.join(packageRoot, 'skills', 'intuition-execute');
  const executeDest = path.join(claudeSkillsDir, 'intuition-execute');

  if (fs.existsSync(executeSrc)) {
    copyDirRecursive(executeSrc, executeDest);
    log(`✓ Installed /intuition-execute skill to ${executeDest}`);
  } else {
    error(`intuition-execute skill not found at ${executeSrc}`);
    process.exit(1);
  }

  // Copy /intuition-initialize skill
  const initializeSrc = path.join(packageRoot, 'skills', 'intuition-initialize');
  const initializeDest = path.join(claudeSkillsDir, 'intuition-initialize');

  if (fs.existsSync(initializeSrc)) {
    copyDirRecursive(initializeSrc, initializeDest);
    log(`✓ Installed /intuition-initialize skill to ${initializeDest}`);
  } else {
    error(`intuition-initialize skill not found at ${initializeSrc}`);
    process.exit(1);
  }

  // Copy /intuition-discovery skill
  const discoverySrc = path.join(packageRoot, 'skills', 'intuition-discovery');
  const discoveryDest = path.join(claudeSkillsDir, 'intuition-discovery');

  if (fs.existsSync(discoverySrc)) {
    copyDirRecursive(discoverySrc, discoveryDest);
    log(`✓ Installed /intuition-discovery skill to ${discoveryDest}`);
  } else {
    error(`intuition-discovery skill not found at ${discoverySrc}`);
    process.exit(1);
  }

  // Verify installation
  if (fs.existsSync(startDest) && fs.existsSync(planDest) && fs.existsSync(executeDest) && fs.existsSync(initializeDest) && fs.existsSync(discoveryDest)) {
    log(`✓ Installation complete!`);
    log(`Skills are now available globally:`);
    log(`  /intuition-start       - Load project context and enforce compliance`);
    log(`  /intuition-discovery   - Discovery with Waldo (GAPP dialogue)`);
    log(`  /intuition-plan        - Planning with Magellan (strategic planning)`);
    log(`  /intuition-execute     - Execution with Faraday (methodical implementation)`);
    log(`  /intuition-initialize  - Project initialization (set up project memory)`);
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
