#!/usr/bin/env node

/**
 * Installation script for Intuition skills
 *
 * This script is run after `npm install -g @tgoodington/intuition`
 * It copies skills to ~/.claude/skills/ for global access
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

// All skills to install
const skills = [
  'intuition-start',
  'intuition-prompt',
  'intuition-handoff',
  'intuition-plan',
  'intuition-design',
  'intuition-execute',
  'intuition-debugger',
  'intuition-initialize',
  'intuition-agent-advisor',
  'intuition-skill-guide',
  'intuition-update'
];

// Main installation logic
try {
  const homeDir = os.homedir();
  const claudeSkillsDir = path.join(homeDir, '.claude', 'skills');

  // Get the location of the installed package
  const packageRoot = path.dirname(path.dirname(path.resolve(__filename)));

  log(`Installing Intuition skills...`);
  log(`Package root: ${packageRoot}`);
  log(`Target directory: ${claudeSkillsDir}`);

  // Create ~/.claude/skills if it doesn't exist
  if (!fs.existsSync(claudeSkillsDir)) {
    fs.mkdirSync(claudeSkillsDir, { recursive: true });
    log(`Created ${claudeSkillsDir}`);
  }

  // Remove old discovery skill if it exists (replaced by design in v6.0)
  const oldDiscoveryDest = path.join(claudeSkillsDir, 'intuition-discovery');
  if (fs.existsSync(oldDiscoveryDest)) {
    fs.rmSync(oldDiscoveryDest, { recursive: true, force: true });
    log(`Removed old /intuition-discovery skill (replaced by /intuition-design in v6.0)`);
  }

  // Install each skill
  skills.forEach(skillName => {
    const src = path.join(packageRoot, 'skills', skillName);
    const dest = path.join(claudeSkillsDir, skillName);

    if (fs.existsSync(src)) {
      copyDirRecursive(src, dest);
      log(`\u2713 Installed /${skillName} skill to ${dest}`);
    } else {
      error(`${skillName} skill not found at ${src}`);
      process.exit(1);
    }
  });

  // Verify installation
  const allInstalled = skills.every(skillName =>
    fs.existsSync(path.join(claudeSkillsDir, skillName))
  );

  if (allInstalled) {
    log(`\u2713 Installation complete!`);
    log(`Skills are now available globally:`);
    log(`  /intuition-start          - Load project context and detect workflow phase`);
    log(`  /intuition-prompt         - Focused discovery (prompt-engineering refinement)`);
    log(`  /intuition-handoff        - Handoff orchestrator (phase transitions + design loop)`);
    log(`  /intuition-plan           - Strategic planning (ARCH protocol + design flagging)`);
    log(`  /intuition-design         - Design exploration (ECD framework, domain-agnostic)`);
    log(`  /intuition-execute        - Execution orchestrator (subagent delegation)`);
    log(`  /intuition-debugger       - Expert debugger (diagnostic specialist)`);
    log(`  /intuition-initialize     - Project initialization (set up project memory)`);
    log(`  /intuition-agent-advisor  - Expert advisor on building custom agents`);
    log(`  /intuition-skill-guide    - Expert advisor on building custom skills`);
    log(`  /intuition-update         - Check for and install package updates`);
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
