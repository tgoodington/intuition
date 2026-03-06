# Intuition Installation Guide

Complete guide to installing Intuition skills (`/plan` and `/execute`) on your system.

## Prerequisites

- **Node.js 14.0.0 or higher** - [Download Node.js](https://nodejs.org/)
- **Claude Code** - The Claude Code CLI tool
- **npm** - Usually included with Node.js

### Check Prerequisites

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Claude Code installation
claude --version
```

All should return version numbers.

## Installation Methods

### Method 1: Global npm Installation (Recommended)

The easiest way to install Intuition globally on your system.

#### Installation

```bash
npm install -g intuition
```

This will:
1. Download the latest Intuition package from npm
2. Install it globally to your system
3. Automatically run a postinstall script that copies skills to `~/.claude/skills/`
4. Make `/plan` and `/execute` available in Claude Code

#### Verification

```bash
# Check that skills were installed
ls ~/.claude/skills/plan
ls ~/.claude/skills/execute

# In Claude Code, open any project and type:
/plan "test"
# Waldo should respond
```

#### Uninstallation

```bash
npm uninstall -g intuition
```

This will automatically remove the skills from `~/.claude/skills/`.

### Method 2: Claude Code Plugin Marketplace

Install via Claude Code's plugin marketplace for a fully integrated experience.

#### Installation

```bash
# In Claude Code, add the marketplace
/plugin marketplace add tgoodington/intuition

# List available plugins
/plugin list

# Install the Intuition plugin
/plugin install intuition-skills@intuition
```

#### Verification

```bash
# Verify plugin is installed
/plugin list

# In any project, verify skills are available
/plan "test"
```

#### Uninstallation

```bash
/plugin uninstall intuition-skills@intuition
```

### Method 3: Install from Source

Install directly from the GitHub repository for development or latest unreleased features.

#### Prerequisites

- Git

#### Installation

```bash
# Clone the repository
git clone https://github.com/tgoodington/intuition.git
cd intuition

# Install globally from source
npm install -g .
```

#### Verification

```bash
# Check installation
npm list -g intuition

# Verify skills in Claude Code
/plan "test"
```

#### Updating

```bash
# Inside the intuition repository
git pull origin master
npm install -g .
```

#### Uninstallation

```bash
npm uninstall -g intuition
```

### Method 4: Local/Project Installation

For development or testing without global installation.

#### Installation

```bash
# Clone and install locally
git clone https://github.com/tgoodington/intuition.git
cd intuition
npm install
```

#### Usage

```bash
# Run the CLI locally
node bin/intuition.js help

# Note: Skills won't be available as `/plan` and `/execute` in Claude Code
# This is for local development only
```

## Skills Directory Structure

After installation, skills are located in your home directory:

```
~/.claude/skills/
├── plan/
│   ├── SKILL.md                 # Plan skill definition
│   └── references/              # Reference materials
└── execute/
    ├── SKILL.md                 # Execute skill definition
    └── references/              # Reference materials
```

On different operating systems:

- **macOS/Linux:** `~/.claude/skills/`
- **Windows:** `C:\Users\YourUsername\.claude\skills\`

## Troubleshooting

### Skills Not Available After Installation

**Symptom:** Typing `/plan` in Claude Code shows "Unknown command"

**Solutions:**

1. **Restart Claude Code** - Skills may not load until the tool is restarted after installation
   ```bash
   # Close all Claude Code windows and reopen
   ```

2. **Verify installation directory exists**
   ```bash
   # Check if skills are installed
   ls ~/.claude/skills/plan
   ls ~/.claude/skills/execute

   # On Windows:
   dir %USERPROFILE%\.claude\skills\plan
   dir %USERPROFILE%\.claude\skills\execute
   ```

3. **Check npm installation was successful**
   ```bash
   npm list -g intuition
   ```

4. **Try manual installation** - If automated installation failed:
   ```bash
   # See "Manual Installation" section below
   ```

### Permission Denied Errors

**Symptom:** `EACCES: permission denied` or `Error: EPERM` during installation

**Solutions:**

1. **Use sudo (Linux/macOS)**
   ```bash
   sudo npm install -g intuition
   ```

2. **Fix npm permissions** (recommended, avoids sudo)
   ```bash
   # Create a directory for global npm modules
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   export PATH=~/.npm-global/bin:$PATH

   # Add to ~/.bashrc, ~/.zshrc, or equivalent
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   ```

3. **On Windows** - Run Command Prompt or PowerShell as Administrator

### Installation Script Failed

**Symptom:** `postinstall` or `preuninstall` script error

**Solutions:**

1. **Manual Installation**

   ```bash
   # Find where intuition was installed
   npm list -g intuition

   # Navigate to the installation directory
   cd /path/to/intuition

   # Run installation script manually
   node scripts/install-skills.js
   ```

2. **Check Node.js version**
   ```bash
   node --version
   # Should be 14.0.0 or higher
   ```

3. **Clear npm cache**
   ```bash
   npm cache clean --force
   npm install -g intuition
   ```

### Uninstallation Left Behind Directories

**Symptom:** `~/.claude/skills/` still exists after `npm uninstall -g intuition`

**Solutions:**

1. **Manual cleanup**
   ```bash
   # macOS/Linux
   rm -rf ~/.claude/skills

   # Windows (PowerShell)
   Remove-Item -Path "$env:USERPROFILE\.claude\skills" -Recurse -Force
   ```

2. **Verify cleanup**
   ```bash
   ls ~/.claude/skills
   # Should show "No such file or directory"
   ```

### Skills Directory Permissions

**Symptom:** Claude Code can't find or load skills after installation

**Solutions:**

1. **Check directory permissions**
   ```bash
   # macOS/Linux - should be readable
   ls -la ~/.claude/skills/plan
   ls -la ~/.claude/skills/execute
   ```

2. **Fix permissions if needed**
   ```bash
   # macOS/Linux
   chmod -R 755 ~/.claude/skills
   ```

3. **Verify SKILL.md files exist**
   ```bash
   cat ~/.claude/skills/plan/SKILL.md
   cat ~/.claude/skills/execute/SKILL.md
   ```

## Manual Installation

If automated installation fails, you can manually copy skills:

1. **Download/get the Intuition repository**

2. **Find your Claude skills directory**
   ```bash
   # Create if it doesn't exist
   mkdir -p ~/.claude/skills
   ```

3. **Copy skills**
   ```bash
   # macOS/Linux
   cp -r /path/to/intuition/skills/plan ~/.claude/skills/
   cp -r /path/to/intuition/skills/execute ~/.claude/skills/

   # Windows (PowerShell)
   Copy-Item -Path "C:\path\to\intuition\skills\plan" -Destination "$env:USERPROFILE\.claude\skills\plan" -Recurse
   Copy-Item -Path "C:\path\to\intuition\skills\execute" -Destination "$env:USERPROFILE\.claude\skills\execute" -Recurse
   ```

4. **Restart Claude Code**

5. **Verify**
   ```
   /plan "test"
   ```

## Upgrading Intuition

### From npm Global Installation

```bash
npm install -g intuition@latest
```

### From Source Installation

```bash
cd /path/to/intuition
git pull origin master
npm install -g .
```

### From Plugin Marketplace

```bash
/plugin update intuition-skills@intuition
```

## Getting Help

If you encounter issues not covered here:

1. **Check GitHub Issues:** https://github.com/tgoodington/intuition/issues
2. **Review Claude Code Docs:** https://code.claude.com/docs
3. **Check skill documentation:** `~/.claude/skills/plan/SKILL.md`

## What Gets Installed

### npm Installation Includes

- **CLI wrapper:** `bin/intuition.js` (node global bin, dev-only)
- **Five skills:** `skills/intuition-*/` → copied to `~/.claude/skills/`
  - intuition-start (session primer)
  - intuition-discovery (Waldo)
  - intuition-handoff (orchestrator)
  - intuition-plan (Magellan)
  - intuition-execute (Faraday)

### Plugin Marketplace Installation Includes

- All five Intuition skills
- All referenced skills and supporting files
- Full skill definitions with SKILL.md

## System Requirements by Operating System

### macOS

- macOS 10.15 or later
- Node.js 14.0.0+
- Disk space: ~50 MB

### Linux

- Ubuntu 18.04+ (or equivalent)
- Node.js 14.0.0+
- Disk space: ~50 MB

### Windows

- Windows 10 or later
- Node.js 14.0.0+
- Disk space: ~50 MB

## Next Steps

After successful installation:

1. **Start a planning session:**
   ```
   /plan "Describe what you want to build"
   ```

2. **Review the generated plan** in `docs/project_notes/project_plan.md`

3. **Execute the plan:**
   ```
   /execute
   ```

See the main [README.md](./README.md) for usage examples and workflow documentation.
