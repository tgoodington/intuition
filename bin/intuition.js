#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

// Get command line arguments
const args = process.argv.slice(2);
const command = args[0];
const commandArg = args.slice(1).join(' ');

// Helper functions
function showHelp() {
  console.log(`
Intuition - Planning and Execution CLI

Usage:
  intuition <command> [options]

Commands:
  plan <description>    Start a planning session with Waldo
                        Example: intuition plan "Add user authentication"

  execute              Execute a plan with Architect
                       Reads existing plan from docs/project_notes/

  memory setup         Initialize project memory system
                       Sets up docs/project_notes/ directory structure

  help                 Show this help message

Examples:
  intuition plan "Implement real-time notifications"
  intuition execute
  intuition memory setup
  intuition help

For more information, visit: https://github.com/tgoodington/intuition
`);
}

function showVersion() {
  try {
    const packageJson = require(path.join(__dirname, '../package.json'));
    console.log(`Intuition v${packageJson.version}`);
  } catch (e) {
    console.log('Intuition version unknown');
  }
}

function invokeAgent(agentName, description = '') {
  const agentPath = path.join(__dirname, '../agents', `${agentName}.md`);

  if (!fs.existsSync(agentPath)) {
    console.error(`Error: Agent '${agentName}' not found at ${agentPath}`);
    process.exit(1);
  }

  console.log(`\nInvoking ${agentName === 'waldo' ? 'Waldo' : 'Architect'}...`);
  console.log('========================================\n');

  // In actual usage, this would be invoked through Claude Code or similar
  // For now, show what would happen
  if (agentName === 'waldo') {
    console.log(`Planning Task: ${description || 'General planning'}`);
    console.log(`Agent Path: ${agentPath}`);
    console.log('\nInvoking Waldo agent for planning...\n');
    console.log('(In actual usage, this invokes the Waldo planning agent)');
    console.log('(Check docs/project_notes/ after Waldo completes for the plan)\n');
  } else if (agentName === 'architect') {
    console.log('Execution Task: Read plan and execute');
    console.log(`Agent Path: ${agentPath}`);
    console.log('\nInvoking Architect agent for execution...\n');
    console.log('(In actual usage, this invokes the Architect execution agent)');
    console.log('(Architect reads the plan from docs/project_notes/)\n');
  }
}

function initializeMemory() {
  console.log('Initializing project memory system...\n');

  const memoryDir = path.join(process.cwd(), 'docs', 'project_notes');

  if (fs.existsSync(memoryDir)) {
    console.log('Project memory already initialized at:', memoryDir);
    console.log('Memory files:');
    const files = fs.readdirSync(memoryDir);
    files.forEach(file => {
      if (file.endsWith('.md')) {
        console.log(`  - ${file}`);
      }
    });
    return;
  }

  console.log('Setting up project memory structure...');
  console.log('(In actual usage, this invokes the project-memory skill)');
  console.log('(This creates: docs/project_notes/ with bugs.md, decisions.md, key_facts.md, issues.md)\n');
  console.log('Memory system ready! You can now use:');
  console.log('  intuition plan "your description"');
  console.log('  intuition execute\n');
}

// Route commands
switch (command) {
  case 'plan':
    if (!commandArg) {
      console.error('Error: plan command requires a description');
      console.error('Usage: intuition plan "description"');
      process.exit(1);
    }
    invokeAgent('waldo', commandArg);
    break;

  case 'execute':
    invokeAgent('architect');
    break;

  case 'memory':
    if (commandArg === 'setup') {
      initializeMemory();
    } else {
      console.error('Error: unknown memory subcommand');
      console.error('Usage: intuition memory setup');
      process.exit(1);
    }
    break;

  case 'help':
  case '-h':
  case '--help':
    showHelp();
    break;

  case 'version':
  case '-v':
  case '--version':
    showVersion();
    break;

  case '':
  case undefined:
    console.log('Intuition - Planning and Execution CLI\n');
    console.log('Run "intuition help" for usage information\n');
    break;

  default:
    console.error(`Error: unknown command '${command}'`);
    console.error('Run "intuition help" for usage information');
    process.exit(1);
}
