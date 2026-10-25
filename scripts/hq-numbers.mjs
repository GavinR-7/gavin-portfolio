#!/usr/bin/env node
/**
 * Every number on the HQ case study comes from this script. Run it, read the
 * JSON, copy the figures into content/projects/hq.mdx with the date.
 *
 * It needs the HQ checkout (private) and an authenticated `gh`:
 *   node scripts/hq-numbers.mjs            # HQ_DIR defaults to ~/gavin-data
 *
 * Sources and definitions:
 *   tasks    `hq.mjs task list --all --json`, grouped by state. The list returns
 *            the work orders still in the store, so `listed` is the denominator.
 *   ledger   lines in hq/LEDGER.md that start with a date.
 *   days     calendar days from 2026-10-12 (first ledger line) to today, inclusive.
 *   prs      pull requests in the repos below whose branch starts with an agent
 *            id (builder/, career/, forge/ ...). Claude.ai sessions use claude/
 *            and are not counted. `merged` is a non-null mergedAt.
 *   ci       the "tests/pass/fail" lines of the newest completed run of the
 *            Tests workflow in the HQ repo that printed them.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const HQ_DIR = process.env.HQ_DIR ?? join(homedir(), "gavin-data");
const OWNER = "GavinR-7";
const HQ_REPO = "gavin-data";
const REPOS = [
  "gavin-data",
  "embedded-intent",
  "gavin-portfolio",
  "lead-finder",
  "canvas-archiver",
  "site-kit",
  "in-the-mood-dj",
  "john-savoretti-realty",
  "gckuts-site",
  "above-all-tents-v2",
];
const AGENT_PREFIX =
  /^(builder|career|forge|anvil|research|agency|products|codex|boss|secretary|advisor)\//;
const START = "2026-10-12";

const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, ...opts });

// tasks
const tasks = JSON.parse(
  run("node", [join(HQ_DIR, "hq/hq.mjs"), "task", "list", "--all", "--json"]),
);
const byState = {};
for (const t of tasks) byState[t.state] = (byState[t.state] ?? 0) + 1;

// ledger
const ledger = readFileSync(join(HQ_DIR, "hq/LEDGER.md"), "utf8")
  .split("\n")
  .filter((l) => /^- \d{4}-\d{2}-\d{2}\b/.test(l)).length;

// days running
const days = Math.floor((Date.now() - Date.parse(`${START}T00:00:00Z`)) / 86_400_000) + 1;

// agent pull requests
const prs = { opened: 0, merged: 0, byRepo: {}, skipped: [] };
for (const repo of REPOS) {
  try {
    const list = JSON.parse(
      run("gh", [
        "pr", "list", "-R", `${OWNER}/${repo}`, "--state", "all", "--limit", "1000",
        "--json", "headRefName,mergedAt",
      ]),
    ).filter((p) => AGENT_PREFIX.test(p.headRefName));
    const merged = list.filter((p) => p.mergedAt).length;
    prs.opened += list.length;
    prs.merged += merged;
    prs.byRepo[repo] = { opened: list.length, merged };
  } catch {
    prs.skipped.push(repo);
  }
}

// CI test count
let ci = null;
const runs = JSON.parse(
  run("gh", [
    "run", "list", "-R", `${OWNER}/${HQ_REPO}`, "--workflow", "tests.yml", "--limit", "10",
    "--json", "databaseId,headBranch,createdAt,status",
  ]),
).filter((r) => r.status === "completed");
for (const r of runs) {
  const log = run("gh", ["run", "view", String(r.databaseId), "-R", `${OWNER}/${HQ_REPO}`, "--log"]);
  const pick = (k) => log.match(new RegExp(`ℹ ${k} (\\d+)`))?.[1];
  if (pick("tests")) {
    ci = {
      run: r.databaseId,
      branch: r.headBranch,
      at: r.createdAt,
      tests: +pick("tests"),
      pass: +pick("pass"),
      fail: +pick("fail"),
    };
    break;
  }
}

console.log(
  JSON.stringify(
    {
      measuredAt: new Date().toISOString(),
      tasks: { listed: tasks.length, byState },
      ledgerEntries: ledger,
      daysRunning: days,
      since: START,
      agentPullRequests: prs,
      ci,
    },
    null,
    2,
  ),
);
