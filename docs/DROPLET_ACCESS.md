# YatraBeyond — Droplet Access Notes

**No secrets live in this file. Ever.** No private keys, no passwords, no root credentials. If a future session is tempted to paste one in here to "save it for later," don't, put it in `web/.env` (gitignored) instead, or nowhere at all. This file only records *how* access is structured, not the credentials themselves.

---

## 1. Target server

- Droplet IP: `143.244.134.36`
- This is the **same DigitalOcean droplet that hosts the live SecurifyHQ CRM** (`crm.securifyhq.com`, production, real customer data, live Stripe keys). It is not a dedicated/spare box.
- **Correction (5 Jul 2026):** the earlier assumption that the CRM shares a Postgres instance was wrong. The CRM (`crm.securifyhq.com`) runs on **MariaDB** (`securify_crm` on `127.0.0.1:3306`). There was **no Postgres on the droplet at all** until this session installed it fresh. The box also runs a Frigate NVR, go2rtc, mosquitto (MQTT), and an n8n container — treat it as busy, live infrastructure regardless.
- The `yatrabeyond` database now sits on its **own, newly-installed Postgres 16 instance** (port 5432, localhost-bound), isolated from the CRM by engine *and* by role/database. Because Postgres and MariaDB are separate services on separate ports, a Postgres restart does **not** affect the CRM.
- **Treat every action on this box as touching shared, live infrastructure.** A firewall change, or restarting a *shared* service (nginx, MariaDB), could affect the CRM/cameras — don't do those without explicit sign-off from Vivek first.

## 2. Access model (deliberately not the CRM's root key)

A dedicated, scoped Linux user was created instead of reusing the CRM's root SSH key, to keep this project's blast radius separate from production CRM access:

- Username: `yatrabeyond_setup`
- Auth: SSH key only (ed25519), no password login
- Sudo: **narrowed 5 Jul 2026 (Round 2)** from the original `NOPASSWD:ALL`. `/etc/sudoers.d/yatrabeyond-setup` now grants only: `(root) NOPASSWD:` the `systemctl {start,stop,restart,reload,status,is-active,is-enabled} postgresql` verbs (pinned to `postgresql`, so no other service can be controlled), and `(postgres) NOPASSWD: ALL` (act as the `postgres` user). The `(postgres) ALL` form is deliberate: `sudo -u postgres psql` already grants full Postgres-superuser plus a shell as `postgres` via `\!`, so enumerating individual binaries would add no real security while forcing a sudoers edit for every new Postgres tool. Verified after applying: `sudo -u postgres psql`/`pg_dump` and `systemctl status postgresql` succeed; `sudo cat /etc/shadow`, `systemctl restart nginx`, and `systemctl restart mariadb` are all correctly **denied** — this account can no longer touch the CRM's MariaDB or any other service. A backup of the old rule is at `/tmp/yb-sudoers.bak` on the droplet (transient).
- The matching private key was generated locally (not on the droplet) and lives on Vivek's PC at `%USERPROFILE%\.ssh\yatrabeyond_setup_ed25519` (Windows path). The `.pub` file was appended to `/home/yatrabeyond_setup/.ssh/authorized_keys` on the droplet via the DigitalOcean web console (root, browser-based, no key needed for that step).

## 3. Status — what's confirmed vs. not

- ✅ `yatrabeyond_setup` user created on the droplet (via DO web console, as root).
- ✅ `/etc/sudoers.d/yatrabeyond-setup` created granting that user passwordless sudo.
- ✅ **Verified 5 Jul 2026**: the real key is in place — `ssh yatrabeyond_setup@143.244.134.36 whoami` succeeds, and `authorized_keys` contains the real `ssh-ed25519 … yatrabeyond-postgres-setup` line (no placeholder). `NOPASSWD` sudo works.
- ✅ **Done 5 Jul 2026**: Postgres 16.14 installed and the DB/role/schema/view from `PHASE1_POSTGRES_SETUP_PLAN.md` created and verified (see that file's §6 log). Credentials are in `web/.env` only.
- ✅ **Checked 5 Jul 2026**: `root`'s `authorized_keys` contains **no** `temp-root-access` key — the transient root key was apparently never added (or already removed). Nothing to clean up there. (FYI: root has three keys — `ed25519-key-20260201` and two `claude-code-securify`; the two identical `claude-code-securify` entries may be worth de-duping, but that's SecurifyHQ's call, not YatraBeyond's.)

## 4. What a Claude Code session (running locally, with real SSH access) should do next

See `docs/PHASE1_POSTGRES_SETUP_PLAN.md` for the actual schema/DDL and security posture requirements, and the handoff prompt in this same `docs/` folder for the full task brief.

## 5. Log

- 5 Jul 2026: Access model set up (scoped user + sudo) via Cowork session + DO web console, in collaboration with Vivek. DB/schema not yet created. Handing off to a local Claude Code session for actual execution since Cowork cannot reach the droplet's network.
- 5 Jul 2026 (local Claude Code session): Verified SSH access. Inspected the box: no Postgres present; CRM is on MariaDB; box also runs Frigate NVR + go2rtc + mosquitto + n8n. Confirmed with Vivek that a fresh Postgres install is isolated from all of that, then installed Postgres 16.14 and completed the Phase 1 DB setup (role/db/schema/view), verified working. Credentials written to `web/.env` (gitignored); var names added to `web/.env.example`. **Open item flagged to Vivek:** whether to narrow `yatrabeyond_setup`'s `NOPASSWD:ALL` sudo now that install is done — not changed unilaterally.
- 5 Jul 2026 (Round 2, local Claude Code session): **Narrowed the sudo** (see §2) after showing Vivek the proposed rule; validated with `visudo -cf` before install, then confirmed allowed vs denied commands behave correctly. Also ran the CSV→Postgres sync and set up daily `pg_dump` backups (see `PHASE1_POSTGRES_SETUP_PLAN.md` §2 and §6).
