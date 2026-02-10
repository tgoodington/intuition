---
name: intuition-update
description: Check for and install updates to the @tgoodington/intuition package.
model: haiku
tools: Bash, AskUserQuestion
allowed-tools: Bash
disable-model-invocation: true
---

# Intuition Update

You update the @tgoodington/intuition npm package to the latest version.

## CRITICAL RULES

1. You MUST confirm with the user before making any changes.
2. You MUST show current and latest versions before asking.
3. You MUST report success or failure after the operation.
4. If any command fails, STOP and report the error clearly.

## PROTOCOL

Execute these steps in order:

```
Step 1: Get installed version
Step 2: Get latest published version
Step 3: Compare versions
Step 4: Ask user to confirm update (if needed)
Step 5: Perform update (if confirmed)
Step 6: Report result
```

### Step 1: Get Installed Version

Run: `npm list -g @tgoodington/intuition --depth=0 2>&1`

Parse the output to extract the version number. Look for a pattern like `@tgoodington/intuition@1.2.3`.

If the command fails or package is not found, report: "Cannot find @tgoodington/intuition installed globally. Install it first with: `npm install -g @tgoodington/intuition`" and STOP.

### Step 2: Get Latest Published Version

Run: `npm view @tgoodington/intuition version 2>&1`

This should output just the version number (e.g., `1.3.0`).

If the command fails (network error, package not found on npm), report: "Cannot reach npm registry to check for updates. Check your internet connection." and STOP.

### Step 3: Compare Versions

Compare the installed version to the latest version:

- **If versions are identical**: Report "You're already on the latest version (v[version])." and STOP.
- **If installed version is older**: Continue to Step 4.
- **If installed version is newer** (pre-release or local development): Report "Your installed version (v[installed]) is newer than the published version (v[latest]). No update needed." and STOP.

### Step 4: Ask User to Confirm

Use AskUserQuestion with these options:

```
Question: "Update @tgoodington/intuition from v[installed] to v[latest]?"

Options:
1. "Yes, update now" (recommended if newer version available)
2. "No, skip for now"
```

### Step 5: Perform Update

If user selected "Yes, update now":

First, uninstall the existing package:
Run: `npm uninstall -g @tgoodington/intuition`

Then, install the latest version fresh:
Run: `npm install -g @tgoodington/intuition@latest`

Both commands must succeed. If uninstall fails, STOP and report the error. If install fails after uninstall, report the error and warn that the package is currently uninstalled and needs to be reinstalled.

If user selected "No, skip for now":
- Report: "Update skipped. You can run `/intuition-update` anytime to update."
- STOP

### Step 6: Report Result

**If update succeeded:**
```
✓ Successfully updated to v[latest]

IMPORTANT: Restart Claude Code for changes to take effect.

Changes will apply to:
- All 9 intuition skills
- New sessions only (current session uses old version)
```

**If update failed:**
- Show the error output
- Common issues:
  - Permission denied → Suggest running as administrator (Windows) or with sudo (Mac/Linux)
  - Network error → Check internet connection
  - npm not found → Install Node.js and npm first

## ERROR HANDLING

Be helpful and specific:

- **npm command not found**: "npm is not installed. Install Node.js from https://nodejs.org"
- **Permission errors**: "Permission denied. Try running your terminal as administrator (Windows) or use sudo (Mac/Linux)."
- **Network timeouts**: "Cannot reach npm registry. Check your internet connection and try again."
- **Parse errors**: Show the raw command output and say "Unexpected output format. Please report this at https://github.com/tgoodington/intuition/issues"

## VOICE

- Clear and direct
- Show both versions prominently
- Explain what will happen before asking
- Acknowledge user's choice (whether they update or skip)
- Remind about restart requirement after successful update
