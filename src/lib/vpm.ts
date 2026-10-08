/**
 * Types and helpers for a VPM package listing (the `index.json` the VRChat
 * Creator Companion subscribes to). Kept dependency-free so it can be unit
 * tested and reused.
 *
 * See https://vcc.docs.vrchat.com/vpm/repos for the format.
 */

export type VpmAuthor = {
	name?: string;
	url?: string;
	email?: string;
};

/** A single package version, i.e. the contents of a `package.json` manifest. */
export type VpmManifest = {
	name: string;
	displayName?: string;
	version: string;
	unity?: string;
	description?: string;
	dependencies?: Record<string, string>;
	vpmDependencies?: Record<string, string>;
	author?: VpmAuthor;
	keywords?: string[];
	license?: string;
	licensesUrl?: string;
	url: string;
	zipSHA256?: string;
};

export type VpmListing = {
	name?: string;
	id?: string;
	url?: string;
	author?: string;
	packages?: Record<string, { versions?: Record<string, VpmManifest> }>;
};

/** Which VRChat SDK a package targets. */
export type PackageType = 'Avatar' | 'World' | 'Any';

export type PackageVersion = VpmManifest & { type: PackageType };

export type Package = {
	id: string;
	displayName: string;
	description?: string;
	author?: VpmAuthor;
	keywords: string[];
	latest: PackageVersion;
	/** Newest first. */
	versions: PackageVersion[];
};

const AVATAR_PACKAGE = 'com.vrchat.avatars';
const WORLD_PACKAGE = 'com.vrchat.worlds';

/**
 * A package can ask for the SDK through either dependency map — `dependencies`
 * (resolved by Unity) or `vpmDependencies` (resolved by VCC/ALCOM) — so both
 * count. The listing action only reads `dependencies`, which reports tools that
 * declare the SDK the VPM way as "Any"; we do not copy that blind spot.
 */
export function getPackageType(manifest: VpmManifest): PackageType {
	const dependencies = { ...manifest.dependencies, ...manifest.vpmDependencies };
	if (AVATAR_PACKAGE in dependencies) return 'Avatar';
	if (WORLD_PACKAGE in dependencies) return 'World';
	return 'Any';
}

type ParsedVersion = { core: number[]; pre: string };

function parseVersion(version: string): ParsedVersion {
	const withoutBuild = (version ?? '').split('+')[0] ?? '';
	const [core = '', ...rest] = withoutBuild.split('-');
	return {
		core: core.split('.').map((part) => Number.parseInt(part, 10) || 0),
		pre: rest.join('-'),
	};
}

/** Semver-ish comparison that never throws on odd versions. */
export function compareVersions(a: string, b: string): number {
	const left = parseVersion(a);
	const right = parseVersion(b);

	for (let i = 0; i < 3; i++) {
		const diff = (left.core[i] ?? 0) - (right.core[i] ?? 0);
		if (diff !== 0) return diff < 0 ? -1 : 1;
	}

	if (left.pre === right.pre) return 0;
	// A version without a pre-release suffix is newer (1.0.0 > 1.0.0-beta).
	if (!left.pre) return 1;
	if (!right.pre) return -1;
	return left.pre < right.pre ? -1 : 1;
}

function normalizeManifest(id: string, manifest: VpmManifest): VpmManifest {
	return {
		...manifest,
		name: manifest.name || id,
		version: manifest.version ?? '0.0.0',
		url: manifest.url ?? '',
	};
}

/** Turn a raw listing into the package list the UI renders (latest version + history). */
export function buildPackages(listing: VpmListing | undefined): Package[] {
	const entries = listing?.packages ?? {};
	const packages: Package[] = [];

	for (const [id, entry] of Object.entries(entries)) {
		const versions = Object.values(entry?.versions ?? {})
			.map((manifest) => normalizeManifest(id, manifest))
			.map((manifest) => ({ ...manifest, type: getPackageType(manifest) }))
			.sort((a, b) => compareVersions(b.version, a.version));

		if (versions.length === 0) continue;

		const latest = versions[0]!;
		packages.push({
			id,
			displayName: latest.displayName || latest.name || id,
			description: latest.description,
			author: latest.author,
			keywords: latest.keywords ?? [],
			latest,
			versions,
		});
	}

	return packages.sort((a, b) => a.displayName.localeCompare(b.displayName, undefined, { numeric: true }));
}

/** Narrow unknown JSON into a listing without trusting it blindly. */
export function parseListing(raw: unknown): VpmListing {
	if (!raw || typeof raw !== 'object') {
		throw new Error('Listing is not a JSON object');
	}

	const listing = raw as VpmListing;
	if (listing.packages && typeof listing.packages !== 'object') {
		return { ...listing, packages: {} };
	}

	return listing;
}
