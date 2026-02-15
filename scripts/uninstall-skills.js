#!/usr/bin/env node

/**
 * Uninstallation script for Intuition skills
 *
 * This script is run before `npm uninstall -g @tgoodington/intuition`
 * It removes all Intuition skills from ~/.claude/skills/
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

  // Remove all Intuition skills (current + legacy)
  const skillsToRemove = [
    'intuition-start',
    'intuition-prompt',
    'intuition-handoff',
    'intuition-plan',
    'intuition-design',
    'intuition-execute',
    'intuition-debugger',
    // Legacy skills (removed in v7.1)
    'intuition-engineer',
    'intuition-initialize',
    'intuition-agent-advisor',
    'intuition-skill-guide',
    'intuition-update',
    // Legacy skills (removed in v6.0)
    'intuition-discovery'
  ];

  skillsToRemove.forEach(skillName => {
    const skillDest = path.join(claudeSkillsDir, skillName);
    if (removeDir(skillDest)) {
      log(`\u2713 Removed /${skillName} skill from ${skillDest}`);
    }
  });

  // Clean up empty .claude/skills directory if it's empty
  if (fs.existsSync(claudeSkillsDir)) {
    const remaining = fs.readdirSync(claudeSkillsDir);
    if (remaining.length === 0) {
      fs.rmSync(claudeSkillsDir, { force: true });
      log(`\u2713 Removed empty skills directory`);

      // Also clean up .claude if it's empty
      const claudeDir = path.join(homeDir, '.claude');
      if (fs.existsSync(claudeDir)) {
        const claudeRemaining = fs.readdirSync(claudeDir);
        if (claudeRemaining.length === 0) {
          fs.rmSync(claudeDir, { force: true });
          log(`\u2713 Removed empty .claude directory`);
        }
      }
    }
  }

  log(`\u2713 Uninstallation complete!`);

} catch (err) {
  error(`Uninstallation failed: ${err.message}`);
  console.error(err);
  process.exit(1);
}
