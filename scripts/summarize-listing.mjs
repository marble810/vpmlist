#!/usr/bin/env node
/**
 * Prints a Markdown summary of a generated VPM listing index.
 * Written to stdout so the workflow can append it to $GITHUB_STEP_SUMMARY.
 *
 * Usage: node scripts/summarize-listing.mjs <index.json>
 */
import { readFileSync } from 'node:fs';

const [indexPath] = process.argv.slice(2);

if (!indexPath) {
	console.error('usage: node scripts/summarize-listing.mjs <index.json>');
	process.exit(2);
}

const listing = JSON.parse(readFileSync(indexPath, 'utf8'));
const packages = Object.entries(listing.packages ?? {});

console.log(`## ${listing.name ?? 'Listing'}`);
console.log('');
console.log(`Listing id: \`${listing.id ?? '?'}\``);
console.log('');

if (packages.length === 0) {
	console.log('_No packages in this listing yet._');
	process.exit(0);
}

console.log('| Package | Latest | Versions |');
console.log('| --- | --- | --- |');

for (const [id, entry] of packages) {
	const versions = Object.keys(entry?.versions ?? {}).sort(compareVersions);
	const latest = versions.at(-1) ?? '—';
	console.log(`| \`${id}\` | \`${latest}\` | ${versions.length} |`);
}

/** Minimal semver comparison, good enough for sorting listing versions. */
function compareVersions(a, b) {
	const parse = (value) => {
		const [core, ...rest] = String(value).split('+')[0].split('-');
		return { core: core.split('.').map((part) => Number.parseInt(part, 10) || 0), pre: rest.join('-') };
	};

	const left = parse(a);
	const right = parse(b);

	for (let i = 0; i < 3; i++) {
		const diff = (left.core[i] ?? 0) - (right.core[i] ?? 0);
		if (diff !== 0) return diff;
	}

	if (left.pre === right.pre) return 0;
	if (!left.pre) return 1;
	if (!right.pre) return -1;
	return left.pre < right.pre ? -1 : 1;
}
