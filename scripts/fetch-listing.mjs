#!/usr/bin/env node
/**
 * Downloads the *published* VPM listing into `public/` so the site has real
 * data during local development.
 *
 * `index.json` is generated in CI by `vrchat-community/package-list-action`
 * (see .github/workflows/build-listing.yml) and deployed to GitHub Pages, so
 * locally we simply reuse whatever is already published at `source.json`'s
 * `url` — the same URL users paste into VCC / ALCOM.
 *
 * Usage: node scripts/fetch-listing.mjs [source.json] [outFile] [--force] [--strict]
 *
 *   --force   download even when CI is detected
 *   --strict  exit non-zero if the download fails (default: warn and keep
 *             whatever is already in public/index.json)
 *
 * The URL can be overridden with the VPM_LISTING_URL environment variable.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const args = process.argv.slice(2);
const flags = new Set(args.filter((arg) => arg.startsWith('--')));
const positional = args.filter((arg) => !arg.startsWith('--'));

const [sourcePath = 'source.json', outFile = 'public/index.json'] = positional;

const force = flags.has('--force');
const strict = flags.has('--strict');
const hint = 'Run "npm run listing:fetch" once the listing has been published.';

/** Aborts the download without leaving a pending timer behind the process. */
class FetchFailure extends Error {}

function giveUp(message) {
	throw new FetchFailure(message);
}

async function fetchListing(url) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), 30_000);
	timer.unref();

	try {
		const response = await fetch(url, {
			headers: { accept: 'application/json' },
			signal: controller.signal,
		});

		if (!response.ok) {
			giveUp(`${url} — HTTP ${response.status}`);
		}

		return JSON.parse(await response.text());
	} finally {
		clearTimeout(timer);
	}
}

function reportFailure(message) {
	if (strict) {
		console.error(`${message}\n${hint}`);
		return 1;
	}

	const kept = existsSync(outFile) ? `keeping the existing ${outFile}` : `${outFile} was not written`;
	console.warn(`warning: ${message}\nwarning: ${kept}. ${hint}`);
	return 0;
}

async function main() {
	if (flags.has('--help') || flags.has('-h')) {
		console.log('usage: node scripts/fetch-listing.mjs [source.json] [outFile] [--force] [--strict]');
		return 0;
	}

	// In CI the listing is generated from scratch by the listing action, so a
	// stale download would only be overwritten a few steps later.
	if (process.env.CI && !force) {
		console.log('CI detected — skipping the published listing download (the workflow builds it).');
		return 0;
	}

	let source;
	try {
		source = JSON.parse(readFileSync(sourcePath, 'utf8'));
	} catch (error) {
		giveUp(`Could not read ${sourcePath}: ${error.message}`);
	}

	const url = process.env.VPM_LISTING_URL ?? source.url;
	if (!url) {
		giveUp(`No listing url found in ${sourcePath} (and VPM_LISTING_URL is unset).`);
	}

	console.log(`Fetching ${url}`);

	let listing;
	try {
		listing = await fetchListing(url);
	} catch (error) {
		if (error instanceof FetchFailure) throw error;
		giveUp(`Could not download ${url}: ${error.message ?? error}`);
	}

	if (listing === null || typeof listing !== 'object' || Array.isArray(listing)) {
		giveUp(`${url} did not return a listing object.`);
	}

	if (listing.id && source.id && listing.id !== source.id) {
		console.warn(`warning: ${url} advertises id "${listing.id}", expected "${source.id}".`);
	}

	mkdirSync(dirname(outFile), { recursive: true });
	writeFileSync(outFile, `${JSON.stringify(listing, null, 2)}\n`, 'utf8');

	const packages = Object.keys(listing.packages ?? {}).length;
	console.log(`Wrote ${outFile} — ${packages} package(s) from "${listing.name ?? 'unnamed listing'}".`);
	return 0;
}

try {
	process.exitCode = await main();
} catch (error) {
	if (!(error instanceof FetchFailure)) throw error;
	// Never fail the build over a download: the site renders an error card instead.
	process.exitCode = reportFailure(error.message);
}
