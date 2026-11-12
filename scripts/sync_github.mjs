#!/usr/bin/env node
/**
 * sync_github.mjs — Sync public GitHub repos into the CV/portfolio data source.
 *
 * What it does:
 *   1. Lists your public, non-fork, non-archived repos from the GitHub API.
 *   2. Normalises them into the portfolio project shape.
 *   3. Merges them into data/cv.json, preserving hand-curated entries.
 *   4. Optionally pushes the result back into the portfolio's project list.
 *
 * Curated projects (those with `"source": "manual"` or a `curated: true` flag)
 * are never overwritten — GitHub only owns the repos it created.
 *
 * Usage:
 *   node scripts/sync_github.mjs                 # preview
 *   node scripts/sync_github.mjs --write         # update data/cv.json
 *   node scripts/sync_github.mjs --write --limit 6
 *
 * Auth: set GITHUB_TOKEN to avoid the 60 req/hour anonymous limit.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CV_JSON = path.join(ROOT, 'data', 'cv.json');
const SYNC_CONFIG = path.join(ROOT, 'data', 'sync.config.json');

const config = JSON.parse(await fs.readFile(SYNC_CONFIG, 'utf8').catch(() => '{}'));

const USER = process.env.GITHUB_USER || config.user || 'OdigieDavidIdemudia';

// Repos we never want to advertise on the CV or portfolio.
const EXCLUDE = new Set([
  'Portfolio',        // the portfolio itself
  'masterPortfolio',  // a template, not your work
  '.github',
  ...(config.exclude || []),
]);

const INCLUDE_UNLISTED = config.includeUnlisted === true;
const OVERRIDES = config.overrides || {};

/** Case-insensitive override lookup, so `pacman` and `PACMAN` both match. */
function findOverride(repoName) {
  if (OVERRIDES[repoName]) return OVERRIDES[repoName];
  const key = Object.keys(OVERRIDES).find(
    (k) => k.toLowerCase() === String(repoName).toLowerCase(),
  );
  return key ? OVERRIDES[key] : {};
}

/** GitHub Pages URL for a repo, or null if Pages is not enabled. */
function pagesUrl(repo) {
  if (!repo || !repo.has_pages) return null;
  return `https://${String(USER).toLowerCase()}.github.io/${repo.name}/`;
}

function splitTopics(repo) {
  const topics = Array.isArray(repo.topics) ? repo.topics : [];
  const ignore = new Set(['portfolio', 'resume', 'cv']);
  return topics.filter((t) => !ignore.has(t.toLowerCase()));
}

function normalise(repo, publication) {
  const ov = findOverride(repo.name || publication?.name);
  const topics = splitTopics(repo);
  const tech = ov.techStack || [repo.language, ...topics].filter(Boolean);
  const seen = new Set();
  const techStack = tech.filter((t) => {
    const k = String(t).toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  const year = repo.created_at ? new Date(repo.created_at).getFullYear() : null;
  const fallbackDescription = repo.description && repo.description.trim()
    ? repo.description.trim()
    : `Public project: ${repo.name}.`;

  // Live-link precedence:
  //   1. an explicit override (including `null` to suppress it)
  //   2. the repo's own homepage
  //   3. a companion `<name>-publication` repo's page
  //   4. this repo's own GitHub Pages site
  let live;
  if (ov.live !== undefined) {
    live = ov.live;
  } else {
    live = (repo.homepage && repo.homepage.trim()) || null;
    if (!live && publication) {
      live = (publication.homepage && publication.homepage.trim()) || pagesUrl(publication);
    }
    if (!live) live = pagesUrl(repo);
  }

  return {
    id: String(repo.name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: ov.name || repo.name,
    period: ov.period || (year ? `${year} - Present` : 'Present'),
    description: ov.cvDescription || fallbackDescription,
    // Portfolio-facing fields
    repo: repo.name,
    full_name: repo.full_name,
    url: repo.html_url,
    homepage: live,
    // The publication is surfaced separately so the UI can offer "Read the
    // publication" alongside the repo, rather than only one link.
    publication: publication
      ? {
          repo: publication.name,
          full_name: publication.full_name,
          url: publication.html_url,
          page: (publication.homepage && publication.homepage.trim()) || pagesUrl(publication),
        }
      : null,
    language: repo.language || null,
    topics,
    techStack,
    stars: repo.stargazers_count ?? 0,
    pushed_at: repo.pushed_at,
    updated_at: repo.updated_at,
    hidden: ov.hidden === true || (!(repo.name in OVERRIDES) && !findOverride(repo.name).cvDescription && !INCLUDE_UNLISTED),
    source: 'github',
  };
}

async function fetchJson(url, headers, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { headers });
      if (res.status === 403 && res.headers.get('x-ratelimit-remaining') === '0') {
        throw new Error(
          'GitHub rate limit exhausted. Set GITHUB_TOKEN for 5000 req/hour.',
        );
      }
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`GitHub API ${res.status}: ${body.slice(0, 200)}`);
      }
      return await res.json();
    } catch (err) {
      lastErr = err;
      // Do not retry a definitive API error, only transport-level failures.
      if (/GitHub API 4\d\d/.test(err.message) || /rate limit/i.test(err.message)) throw err;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
      }
    }
  }
  throw lastErr;
}

async function fetchRepos() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'cv-sync',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const out = [];
  let page = 1;
  for (;;) {
    const url = `https://api.github.com/users/${USER}/repos?per_page=100&page=${page}&sort=updated&type=owner`;
    const batch = await fetchJson(url, headers);
    if (!Array.isArray(batch) || batch.length === 0) break;
    out.push(...batch);
    if (batch.length < 100) break;
    page += 1;
    if (page > 10) break;
  }
  return out;
}

function isEligible(repo) {
  if (repo.fork) return false;
  if (repo.archived) return false;
  if (repo.private) return false;
  if (EXCLUDE.has(repo.name)) return false;
  // `<name>-publication` repos are the public write-up for another project, not
  // projects in their own right. They are attached to the source repo instead.
  if (/-publication$/i.test(repo.name)) return false;
  // A repo with no description and no language is usually scratch work.
  if (!repo.description && !repo.language) return false;
  return true;
}

async function main() {
  const argv = process.argv.slice(2);
  const write = argv.includes('--write');
  const limitArg = argv.indexOf('--limit');
  const limit = limitArg !== -1 ? Number(argv[limitArg + 1]) : Infinity;

  const cv = JSON.parse(await fs.readFile(CV_JSON, 'utf8'));
  const existing = Array.isArray(cv.projects) ? cv.projects : [];

  // Manual entries that explicitly claim a repo stay authoritative, so a
  // hand-written description is never replaced by auto-generated text.
  const claimedRepos = new Set(
    existing.filter((p) => (p.source || 'manual') !== 'github').map((p) => p.repo).filter(Boolean),
  );

  const repos = await fetchRepos();
  const byName = new Map(repos.map((r) => [r.name.toLowerCase(), r]));

  // Index every `<name>-publication` repo by the project it documents.
  const publicationByBase = new Map();
  for (const r of repos) {
    const m = r.name.match(/^(.*)-publication$/i);
    if (m) publicationByBase.set(m[1].toLowerCase(), r);
  }

  const eligible = repos.filter(isEligible);

  const generated = [];
  const usedPublications = new Set();

  for (const repo of eligible) {
    if (claimedRepos.has(repo.name)) continue;
    if (generated.length >= limit) break;
    const pub = publicationByBase.get(repo.name.toLowerCase());
    if (pub) usedPublications.add(pub.name.toLowerCase());
    const p = normalise(repo, pub);
    if (p.hidden) continue;
    generated.push(p);
  }

  // A publication with no public source repo (e.g. PACMAN, or where the source
  // repo is private) stands in for the project on its own — otherwise the only
  // public artefact would be invisible.
  for (const [base, pub] of publicationByBase) {
    if (usedPublications.has(pub.name.toLowerCase())) continue;
    if (byName.has(base)) continue;           // owned by the source repo above
    if (claimedRepos.has(pub.name)) continue; // owned by a manual entry
    if (generated.length >= limit) break;

    // Prefer the override for the project name (e.g. "LinkPass") and fall back
    // to the override for the publication repo itself (e.g. "PACMAN").
    const ovBase = findOverride(base);
    const ovPub = findOverride(pub.name);
    const ov = Object.keys(ovBase).length ? ovBase : ovPub;

    const p = normalise(pub, null);
    p.id = base.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    p.name = ov.name || base.charAt(0).toUpperCase() + base.slice(1);
    p.description = ov.cvDescription || p.description;
    p.publication = {
      repo: pub.name,
      full_name: pub.full_name,
      url: pub.html_url,
      page: (pub.homepage && pub.homepage.trim()) || pagesUrl(pub),
    };
    p.hidden = ov.hidden === true;
    if (p.hidden) continue;
    generated.push(p);
  }

  console.log(`Fetched ${repos.length} repos, ${eligible.length} eligible.`);
  console.log(`Claimed by manual entries: ${claimedRepos.size}`);
  console.log(`Publications matched: ${usedPublications.size}`);
  console.log(`Included after hidden/exclude filters: ${generated.length}\n`);

  for (const p of generated) {
    console.log(`  + ${p.name}`);
    console.log(`      ${p.description.slice(0, 90)}`);
    console.log(`      repo: ${p.url}`);
    if (p.publication) console.log(`      publication: ${p.publication.page}`);
    else if (p.homepage) console.log(`      live: ${p.homepage}`);
  }

  if (!write) {
    console.log('\nPreview only. Re-run with --write to update data/cv.json.');
    return;
  }

  // Only rewrite when the project list actually changed. Without this every run
  // bumps the timestamp and produces an empty commit in CI.
  const stable = (arr) =>
    JSON.stringify(
      (arr || []).map((p) => ({ ...p, hidden: undefined, stars: undefined, pushed_at: undefined, updated_at: undefined })),
    );

  const manual = existing.filter((p) => (p.source || 'manual') !== 'github');
  const nextProjects = [...manual, ...generated];
  const changed = stable(nextProjects) !== stable(existing);

  if (!changed) {
    console.log('\nNo project changes — data/cv.json left untouched.');
    return;
  }

  cv.projects = nextProjects;
  cv.meta = cv.meta || {};
  cv.meta.github_synced_at = new Date().toISOString();

  await fs.writeFile(CV_JSON, JSON.stringify(cv, null, 2) + '\n', 'utf8');
  console.log(`\nWrote ${cv.projects.length} projects to data/cv.json`);

  // Portfolio-facing artefact: only GitHub-backed projects, already filtered.
  const generatedPath = path.join(ROOT, 'src', 'data', 'generated-projects.json');
  await fs.writeFile(
    generatedPath,
    JSON.stringify(
      { synced_at: cv.meta.github_synced_at, projects: generated },
      null,
      2,
    ) + '\n',
    'utf8',
  );
  console.log(`Wrote ${generated.length} synced projects to src/data/generated-projects.json`);
  console.log('Next: npm run cv:build');
}

main().catch((err) => {
  console.error('sync failed:', err.message);
  if (err.cause) console.error('  cause:', err.cause.message || err.cause, err.cause.code || '');
  process.exit(1);
});
