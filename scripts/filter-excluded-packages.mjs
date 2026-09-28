#!/usr/bin/env node
/**
 * Removes package ids listed in `excludedPackages` (source.json) from a
 * generated VPM listing index.
 *
 * Usage: node scripts/filter-excluded-packages.mjs <source.json> <index.json>
 */
import { readFileSync, writeFileSync } from 'node:fs';

const [sourcePath, indexPath] = process.argv.slice(2);

if (!sourcePath || !indexPath) {
	console.error('usage: node scripts/filter-excluded-packages.mjs <source.json> <index.json>');
	process.exit(2);
}

const source = JSON.parse(readFileSync(sourcePath, 'utf8'));
const excluded = new Set(source.excludedPackages ?? []);

if (excluded.size === 0) {
	console.log('No excludedPackages configured.');
	process.exit(0);
}

const listing = JSON.parse(readFileSync(indexPath, 'utf8'));
const packages = listing.packages ?? {};

const removed = Object.keys(packages).filter((id) => excluded.has(id));
for (const id of removed) {
	delete packages[id];
}

if (removed.length === 0) {
	console.log('No excluded packages were present in the generated listing.');
	process.exit(0);
}

writeFileSync(indexPath, `${JSON.stringify(listing, null, 2)}\n`, 'utf8');
console.log(`Removed excluded packages: ${removed.join(', ')}`);
