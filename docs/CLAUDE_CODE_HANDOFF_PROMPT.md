# Handoff prompt for a local Claude Code session

Two rounds below, newest first. **Round 2 is the current one to copy in now** — Round 1 (Postgres install) is done and kept only as history/context.

Copy everything below a "---" into a Claude Code session running on Vivek's PC (not Cowork — Cowork's sandbox can't reach this droplet's network, confirmed).

---

## ROUND 2 (5 Jul 2026) — narrow sudo, push data live, schedule backups

Read these first, they have full context on everything since Round 1:

- `docs/PHASE1_FINAL_BUILD_BRIEF.md` — current overall state and open items (§6).
- `docs/PHASE1_POSTGRES_SETUP_PLAN.md` §6 — the Postgres install log from Round 1.
- `docs/DATA_SYNC_ARCHITECTURE.md` — why data flows CSV → Postgres → static JSON export, and why neither Cowork nor the live site ever get direct database access.
- `scripts/README.md` — exact commands for the two scripts referenced below.

Same ground rules as Round 1: this droplet (`143.244.134.36`) also runs SecurifyHQ's live CRM (MariaDB, real customer data) plus Frigate/go2rtc/mosquitto/n8n. Don't restart any shared service or touch the firewall without checking with Vivek first. Use the `yatrabeyond_setup` key, not the CRM's root key.

Three tasks, in order:

### 1. Narrow `yatrabeyond_setup`'s sudo

It currently has `NOPASSWD:ALL` in `/etc/sudoers.d/yatrabeyond-setup`, set that way just to get Postgres installed in Round 1. Now that install is stable, narrow it to only what ongoing Postgres/YatraBeyond maintenance actually needs, roughly: `systemctl {start,stop,restart,status} postgresql` and `sudo -u postgres psql` / `sudo -u postgres pg_dump` (needed for task 3 below). Show the proposed sudoers rule before applying it. Update `docs/DROPLET_ACCESS.md` §2 and §5 with what changed.

### 2. Run the CSV → Postgres sync for real

`scripts/sync-csv-to-postgres.mjs` is written and already dry-run tested by Cowork against the current data: 54 deities, 147 works, 867 segments, zero parse errors, zero slug collisions. Before trusting that:

1. `cd scripts && npm install`
2. `npm run sync:dry-run` — confirm you get the same counts (54 / 147 / 867) against your own copy of `data/`. If the counts differ, stop and figure out why before going further, don't just proceed.
3. Open the tunnel and run it for real:
   ```
   ssh -L 5432:127.0.0.1:5432 yatrabeyond_setup@143.244.134.36 -N &
   DATABASE_URL=postgresql://yatrabeyond_app:<password-from-web/.env>@127.0.0.1:5432/yatrabeyond npm run sync
   ```
4. Verify: connect and confirm `SELECT count(*) FROM works`, `FROM deities`, `FROM segments` match the dry-run numbers, and spot check that `A037` and `C031` show `copyright_risk = 'Cleared-authorized'`.
5. Update `docs/PHASE1_POSTGRES_SETUP_PLAN.md` §6 log with the result.

### 3. Schedule daily backups

No backup exists yet for the `yatrabeyond` database. Set up a daily `pg_dump` (e.g. a cron job under a role that only has `sudo -u postgres pg_dump`, per the narrowed sudo in task 1), writing to a directory outside the web-accessible path, with a sensible retention (7–14 days is plenty for content that's also sitting in `data/*.csv` and in git eventually). Document the exact cron entry and retention policy in `docs/PHASE1_POSTGRES_SETUP_PLAN.md` §2.

Once all three are done, update `docs/PHASE1_FINAL_BUILD_BRIEF.md` §6, items 3, 4, and 5 can be marked done.

---

## ROUND 1 (5 Jul 2026) — Postgres install (done, kept for history)

---

I need you to finish setting up Postgres for the YatraBeyond project on an existing DigitalOcean droplet. Read these two files first, they have the full context:

- `docs/PHASE1_POSTGRES_SETUP_PLAN.md` — the actual schema, DDL, and required security posture.
- `docs/DROPLET_ACCESS.md` — how access is set up and what's unverified.

Key facts up front: the droplet (`143.244.134.36`) is a **live production server** running SecurifyHQ's CRM (real customer data, live Stripe keys). We deliberately created a separate, scoped `yatrabeyond_setup` user instead of reusing the CRM's root key, specifically so this work can't accidentally touch CRM data or config. Please keep that separation, don't use the CRM's root key for this, and don't run anything that requires restarting the Postgres service or touching the firewall without checking with me first, since that could affect the CRM if it shares the same instance.

The private key for `yatrabeyond_setup` is at `%USERPROFILE%\.ssh\yatrabeyond_setup_ed25519` on this machine.

Please do this in order:

1. **Verify access works.** `ssh -i %USERPROFILE%\.ssh\yatrabeyond_setup_ed25519 yatrabeyond_setup@143.244.134.36 whoami`. If it fails with a key/auth error (not a network error), check `cat /home/yatrabeyond_setup/.ssh/authorized_keys` via the DigitalOcean web console and fix it if the placeholder text never got replaced with the real public key.

2. **Check what's already there.** Is Postgres installed? What version? Does the CRM already have databases on the same instance (so we know we're adding alongside, not overwriting)? Report this before changing anything.

3. **Run the setup from `PHASE1_POSTGRES_SETUP_PLAN.md`**: create the `yatrabeyond_app` role with a freshly generated random password (`openssl rand -base64 32`, don't hardcode or reuse anything), create the `yatrabeyond` database, run the schema DDL, and the `publishable_works` view.

4. **Check the security posture items in section 2 of the plan** (listen_addresses, pg_hba.conf auth method, ufw/firewall on port 5432, SSL). Report findings. Only fix something there if it requires a restart or firewall change after checking with me, since that's shared infrastructure.

5. **Store the generated credentials only in `web/.env`** (already gitignored) — never in a docs file, never in a commit. Update `.env.example` with the variable names only, no real values.

6. **Update both docs' status logs** to reflect what actually got done, with today's date, once it's verified working (test an actual connection as `yatrabeyond_app` to the `yatrabeyond` database).

7. **CSV import (section 4 of the plan) can be a follow-up step** once the schema is confirmed working — it needs the six CSVs from `data/` copied to the droplet or accessed via a tunnel, your call on the cleanest way to do that.

8. Once everything's verified working, flag to me whether the `yatrabeyond_setup` sudo access (`NOPASSWD:ALL`) should be narrowed down or left as-is for future sessions — don't decide that unilaterally.

Go step by step, verify each one actually worked before moving to the next, and tell me clearly if anything looks off rather than pushing through.
