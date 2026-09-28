import { buildPackages, parseListing, type Package, type VpmListing } from './vpm';
import { resolveListingDataUrl } from './site-config';

export type ListingState =
	| { status: 'loading' }
	| { status: 'ready'; listing: VpmListing; packages: Package[] }
	| { status: 'error'; message: string };

async function fetchListing(): Promise<VpmListing> {
	const url = resolveListingDataUrl();
	const response = await fetch(url, { headers: { accept: 'application/json' } });

	if (!response.ok) {
		throw new Error(`Could not load ${url} — HTTP ${response.status}`);
	}

	const text = await response.text();
	if (!text.trimStart().startsWith('{')) {
		// Static hosts answer unknown paths with index.html; that is not data.
		throw new Error(`${url} did not return JSON`);
	}

	return parseListing(JSON.parse(text));
}

/** Loads the generated `index.json` once and exposes it as reactive state. */
export function createListingQuery() {
	let state = $state<ListingState>({ status: 'loading' });

	async function load(): Promise<void> {
		state = { status: 'loading' };
		try {
			const listing = await fetchListing();
			state = { status: 'ready', listing, packages: buildPackages(listing) };
		} catch (error) {
			state = {
				status: 'error',
				message: error instanceof Error ? error.message : String(error),
			};
		}
	}

	void load();

	return {
		get state(): ListingState {
			return state;
		},
		reload: load,
	};
}
