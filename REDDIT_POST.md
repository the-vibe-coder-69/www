# Reddit Post for r/webdev

**Title**: [Showcase] Stop documenting. Start showcasing. I built a "Magic Pill" skill for AI agents that turns messy repos into 100/100 health showcases in seconds.

**Body**:

Hey r/webdev,

We all know the "last mile" of a project is the worst. You’ve finished the code, but now you have to take high-res screenshots, record GIFs, write a professional README, add a LICENSE, and make sure you didn't accidentally leak your OpenAI key in a screenshot.

I got tired of doing this manually, so I built the **Project Showcase Skill** for AI Agents (Gemini CLI, Claude Code, etc.). 

I just ran it on one of my messy experiment repos and it went from "scattered files" to **"Showcase READY"** in mere seconds.

### 🎬 What it does:
1.  **Self-Healing UI Capture**: It starts your server, navigates to your routes using Playwright, detects 404s or blank screens, and waits for hydration before taking high-res shots.
2.  **Repo Health Audit (0-100 Score)**: It scans for missing LICENSE files, documentation gaps, and security leaks. It then presents a **"Healing Plan"** to fix them autonomously.
3.  **Security & Privacy Scan**: Automatically detects and warns about sensitive API keys or `.env` leaks *before* they end up in your showcase.
4.  **Surgical README Injection**: It doesn't overwrite your hard-earned docs. It surgically injects galleries, tech stacks, and live app badges around your existing notes.
5.  **Automated CLI Demos**: For the terminal nerds, it generates VHS tapes and high-fidelity GIFs of your CLI tools.

### 🚀 The "Vibe Coder" Case Study:
I ran a single command: `Audit this repository and make it showcase ready.`
- **Before**: 40/100 Score. Missing LICENSE, no setup script, manual screenshots only.
- **After (20 seconds later)**: 100/100 Score. MIT License added, `setup.sh` created, full visual gallery injected, and a 100% clean security scan.

### 🛠️ Tech Stack:
- **Automation**: Playwright (Web) & VHS (Terminal)
- **Agent Support**: Universal installer for Gemini CLI & Claude Code
- **License**: MIT

**Stop documenting. Start showcasing.**

Check it out here: [https://github.com/ayushxx7/project-showcase-skill](https://github.com/ayushxx7/project-showcase-skill)

I'd love to hear what you guys think or what "readiness" metrics I should add to the health score next!
