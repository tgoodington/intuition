#!/usr/bin/env node

/**
 * Uninstallation script for Intuition skills
 *
 * This script is run before `npm uninstall -g intuition`
 * It removes the /plan and /execute skills from ~/.claude/skills/
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    return true;
  }
  return false;
}

function log(msg) {
  console.log(`[intuition-uninstall] ${msg}`);
}

function error(msg) {
  console.error(`[intuition-uninstall] ERROR: ${msg}`);
}

// Main uninstallation logic
try {
  const homeDir = os.homedir();
  const claudeSkillsDir = path.join(homeDir, '.claude', 'skills');

  log(`Uninstalling Intuition skills...`);
  log(`Target directory: ${claudeSkillsDir}`);

  if (!fs.existsSync(claudeSkillsDir)) {
    log(`Skills directory not found - nothing to clean up`);
    process.exit(0);
  }

  // Remove /plan skill
  const planDest = path.join(claudeSkillsDir, 'plan');
  if (removeDir(planDest)) {
    log(`✓ Removed /plan skill from ${planDest}`);
  }

  // Remove /execute skill
  const executeDest = path.join(claudeSkillsDir, 'execute');
  if (removeDir(executeDest)) {
    log(`✓ Removed /execute skill from ${executeDest}`);
  }

  // Clean up empty .claude/skills directory if it's empty
  if (fs.existsSync(claudeSkillsDir)) {
    const remaining = fs.readdirSync(claudeSkillsDir);
    if (remaining.length === 0) {
      fs.rmSync(claudeSkillsDir, { force: true });
      log(`✓ Removed empty skills directory`);

      // Also clean up .claude if it's empty
      const claudeDir = path.join(homeDir, '.claude');
      const claudeRemaining = fs.readdirSync(claudeDir);
      if (claudeRemaining.length === 0) {
        fs.rmSync(claudeDir, { force: true });
        log(`✓ Removed empty .claude directory`);
      }
    }
  }

  log(`✓ Uninstallation complete!`);

} catch (err) {
  error(`Uninstallation failed: ${err.message}`);
  console.error(err);
  process.exit(1);
}
