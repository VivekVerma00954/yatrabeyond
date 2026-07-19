# Setup: personal profile and session model

Two ways to keep my personal context loaded without re-typing it. Right now we
are using the simple project-scoped option (A). Option B is here for later,
when I have more than one personal project.

------------------------------------------------------------------------
## Option A (current) — keep everything inside the project
- `CLAUDE.md` at the project root auto-loads at the start of every session in
  this folder. It already carries the never dos/don'ts, my response
  preferences, and a pointer to `PERSONAL_PROFILE.md`.
- `PERSONAL_PROFILE.md` (same folder) holds the fuller personal detail.
- Nothing to install, no account-preferences step needed. As long as I open a
  session on this folder, the context is there.
- Trade-off: when a second personal project starts, I copy the generic bits
  across, or switch to Option B.

## Option B (later) — a shared personal layer across many projects
- Move `PERSONAL_PROFILE.md` up to `...\Personal\_shared\PERSONAL_PROFILE.md`.
- Each project's CLAUDE.md points up to it, and I mount the `Personal` parent
  folder so both the shared file and the project are visible in one session.
- Optionally, put the short essentials in account preferences (Settings), which
  follow my login across devices even when no folder is mounted. Snippet:

  ---
  I run personal projects on this work seat, isolated from HeadQuarters (HQ)
  work. In personal sessions: no HQ connectors, skills, plugins, or HQ memory,
  and never write personal data into HQ systems. Be concise; no em dashes; no
  assumptions; no security vulnerabilities. Reuse my cached files over
  re-researching. If a personal profile file is present in the mounted folder,
  read it first.
  ---

------------------------------------------------------------------------
## Session model (applies to both options)
- Work as a folder-linked project and start fresh, focused Cowork sessions
  inside it. Do NOT keep one giant long-running session.
- Each new session auto-reads CLAUDE.md, so it starts with full standing
  context without me re-pasting anything and without dragging a huge history.
- Smaller, purposeful sessions cost less: every turn re-reads the running
  context, so a lean session plus a short CLAUDE.md beats a bloated one.

------------------------------------------------------------------------
## Devices
- Files live on OneDrive, so they sync to both my home and office PCs. Start a
  session only when OneDrive shows "Up to date".
- Account preferences (Option B) follow the login, so they are automatic on any
  device with no per-device setup.

------------------------------------------------------------------------
## What this does NOT do
- It does not hide anything from an HQ admin who deliberately looks. This is
  operational isolation, not privacy from the company. I have accepted that.
