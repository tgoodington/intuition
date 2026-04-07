#!/usr/bin/env node

/**
 * Installation script for Intuition skills, specialists, producers, and agents
 *
 * This script is run after `npm install -g @tgoodington/intuition`
 * It copies skills to ~/.claude/skills/, specialists to ~/.claude/specialists/,
 * producers to ~/.claude/producers/, and agents to ~/.claude/agents/ for global access.
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
  // Classic pipeline (v8-v10)
  'intuition-start',
  'intuition-prompt',
  'intuition-handoff',
  'intuition-outline',
  'intuition-meander',
  'intuition-think-tank',
  'intuition-build',
  'intuition-test',
  'intuition-debugger',
  'intuition-initialize',
  'intuition-agent-advisor',
  'intuition-skill-guide',
  'intuition-update',
  'intuition-assemble',
  'intuition-detail',
  'intuition-implement',
  // Enuncia pipeline (v11)
  'intuition-enuncia-start',
  'intuition-enuncia-discovery',
  'intuition-enuncia-compose',
  'intuition-enuncia-design',
  'intuition-enuncia-execute',
  'intuition-enuncia-verify',
  'intuition-enuncia-handoff'
];

// Domain specialist profiles to install (v9) — scanned dynamically
const specialistsDir = path.join(__dirname, '..', 'specialists');
const specialists = fs.existsSync(specialistsDir)
  ? fs.readdirSync(specialistsDir).filter(entry =>
      fs.statSync(path.join(specialistsDir, entry)).isDirectory()
    )
  : [];

// Format producer profiles to install (v9)
const producers = [
  'code-writer',
  'document-writer',
  'spreadsheet-builder',
  'presentation-creator',
  'form-filler',
  'data-file-writer'
];

// Reusable agent definitions (v9.4) — scanned dynamically
const agentsDir = path.join(__dirname, '..', 'agents');
const agents = fs.existsSync(agentsDir)
  ? fs.readdirSync(agentsDir).filter(entry =>
      entry.endsWith('.md')
    )
  : [];

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

  // Remove old execute skill if it exists (split into engineer + build in v8.0)
  const oldExecuteDest = path.join(claudeSkillsDir, 'intuition-execute');
  if (fs.existsSync(oldExecuteDest)) {
    fs.rmSync(oldExecuteDest, { recursive: true, force: true });
    log(`Removed old /intuition-execute skill (split into /intuition-engineer + /intuition-build in v8.0)`);
  }

  // Remove old design/engineer skills if they exist (removed in v10.0)
  const oldDesignDest = path.join(claudeSkillsDir, 'intuition-design');
  if (fs.existsSync(oldDesignDest)) {
    fs.rmSync(oldDesignDest, { recursive: true, force: true });
    log(`Removed old /intuition-design skill (removed in v10.0)`);
  }

  const oldEngineerDest = path.join(claudeSkillsDir, 'intuition-engineer');
  if (fs.existsSync(oldEngineerDest)) {
    fs.rmSync(oldEngineerDest, { recursive: true, force: true });
    log(`Removed old /intuition-engineer skill (removed in v10.0)`);
  }

  // Remove old plan skill if it exists (renamed to outline in v9.1)
  const oldPlanDest = path.join(claudeSkillsDir, 'intuition-plan');
  if (fs.existsSync(oldPlanDest)) {
    fs.rmSync(oldPlanDest, { recursive: true, force: true });
    log(`Removed old /intuition-plan skill (renamed to /intuition-outline in v9.1)`);
  }

  // --- Specialist and Producer directories (v9) ---
  const claudeSpecialistsDir = path.join(homeDir, '.claude', 'specialists');
  const claudeProducersDir = path.join(homeDir, '.claude', 'producers');

  if (!fs.existsSync(claudeSpecialistsDir)) {
    fs.mkdirSync(claudeSpecialistsDir, { recursive: true });
    log(`Created ${claudeSpecialistsDir}`);
  }

  if (!fs.existsSync(claudeProducersDir)) {
    fs.mkdirSync(claudeProducersDir, { recursive: true });
    log(`Created ${claudeProducersDir}`);
  }

  // --- Agents directory (v9.4) ---
  const claudeAgentsDir = path.join(homeDir, '.claude', 'agents');

  if (!fs.existsSync(claudeAgentsDir)) {
    fs.mkdirSync(claudeAgentsDir, { recursive: true });
    log(`Created ${claudeAgentsDir}`);
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

  // Install each specialist profile (dynamically scanned)
  if (specialists.length === 0) {
    log(`No specialist profiles found in ${specialistsDir} — skipping specialist install`);
  }
  specialists.forEach(specialistName => {
    const src = path.join(specialistsDir, specialistName);
    const dest = path.join(claudeSpecialistsDir, specialistName);

    if (fs.existsSync(src)) {
      copyDirRecursive(src, dest);
      log(`\u2713 Installed ${specialistName} specialist to ${dest}`);
    } else {
      error(`${specialistName} specialist not found at ${src}`);
      process.exit(1);
    }
  });

  // Install each producer profile
  producers.forEach(producerName => {
    const src = path.join(packageRoot, 'producers', producerName);
    const dest = path.join(claudeProducersDir, producerName);

    if (fs.existsSync(src)) {
      copyDirRecursive(src, dest);
      log(`\u2713 Installed ${producerName} producer to ${dest}`);
    } else {
      error(`${producerName} producer not found at ${src}`);
      process.exit(1);
    }
  });

  // Install each agent definition (flat .md files)
  if (agents.length === 0) {
    log(`No agent definitions found in ${agentsDir} — skipping agent install`);
  }
  agents.forEach(agentFile => {
    const src = path.join(agentsDir, agentFile);
    const dest = path.join(claudeAgentsDir, agentFile);

    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      log(`\u2713 Installed ${agentFile} agent to ${dest}`);
    } else {
      error(`${agentFile} agent not found at ${src}`);
      process.exit(1);
    }
  });

  // Verify installation
  const allSkillsInstalled = skills.every(skillName =>
    fs.existsSync(path.join(claudeSkillsDir, skillName))
  );
  const allSpecialistsInstalled = specialists.every(name =>
    fs.existsSync(path.join(claudeSpecialistsDir, name))
  );
  const allProducersInstalled = producers.every(name =>
    fs.existsSync(path.join(claudeProducersDir, name))
  );
  const allAgentsInstalled = agents.every(name =>
    fs.existsSync(path.join(claudeAgentsDir, name))
  );

  if (allSkillsInstalled && allSpecialistsInstalled && allProducersInstalled && allAgentsInstalled) {
    log(`\u2713 Installation complete!`);
    log(`Skills are now available globally:`);
    log(`  /intuition-start          - Load project context and detect workflow phase`);
    log(`  /intuition-prompt         - Focused discovery (prompt-engineering refinement)`);
    log(`  /intuition-handoff        - Handoff orchestrator (phase transitions + design loop)`);
    log(`  /intuition-outline        - Strategic outline (ARCH protocol + design flagging)`);
    log(`  /intuition-meander        - Thought partner (reasoning + exploration)`);
    log(`  /intuition-think-tank     - Rapid expert-panel analysis`);
    log(`  /intuition-assemble       - Team assembler (v9 specialist/producer matching)`);
    log(`  /intuition-detail         - Domain specialist orchestrator (v9 detail phase)`);
    log(`  /intuition-build          - Build manager (blueprint + producer delegation)`);
    log(`  /intuition-test           - Test orchestrator (post-build quality gate)`);
    log(`  /intuition-debugger       - Expert debugger (diagnostic specialist)`);
    log(`  /intuition-initialize     - Project initialization (set up project memory)`);
    log(`  /intuition-agent-advisor  - Expert advisor on building custom agents`);
    log(`  /intuition-skill-guide    - Expert advisor on building custom skills`);
    log(`  /intuition-implement      - Post-test project integration`);
    log(`  /intuition-update         - Check for and install package updates`);
    log(``);
    log(`Domain specialists (${specialists.length}):`);
    specialists.forEach(name => log(`  ${name}`));
    log(`Format producers (${producers.length}):`);
    producers.forEach(name => log(`  ${name}`));
    log(`Reusable agents (${agents.length}):`);
    agents.forEach(name => log(`  ${name.replace('.md', '')}`));
    log(`\nYou can now use these skills in any project with Claude Code.`);
  } else {
    error(`Verification failed - not all components properly installed`);
    process.exit(1);
  }

} catch (err) {
  error(`Installation failed: ${err.message}`);
  console.error(err);
  process.exit(1);
}
