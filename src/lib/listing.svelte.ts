import { buildPackages, parseListing, type Package, type VpmListing } from './vpm';
import { resolveListingDataUrl } from './site-config';

/**
 * Why loading `index.json` failed. Kept as data (not a message) so the UI can
 * render it in the active locale instead of a hard-coded English string.
 */
export type ListingFailure =
	| { code: 'http'; url: string; status: number }
	| { code: 'invalid'; url: string }
	| { code: 'unknown'; message: string };

export type ListingState =
	| { status: 'loading' }
	| { status: 'ready'; listing: VpmListing; packages: Package[] }
	| { status: 'error'; failure: ListingFailure };

class ListingFetchError extends Error {
	readonly failure: ListingFailure;

	constructor(failure: ListingFailure) {
		super(failure.code === 'unknown' ? failure.message : failure.code);
		this.failure = failure;
	}
}

async function fetchListing(): Promise<VpmListing> {
	const url = resolveListingDataUrl();
	const response = await fetch(url, { headers: { accept: 'application/json' } });

	if (!response.ok) {
		throw new ListingFetchError({ code: 'http', url, status: response.status });
	}

	const text = await response.text();
	if (!text.trimStart().startsWith('{')) {
		// Static hosts answer unknown paths with index.html; that is not data.
		throw new ListingFetchError({ code: 'invalid', url });
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
				failure:
					error instanceof ListingFetchError
						? error.failure
						: {
								code: 'unknown',
								message: error instanceof Error ? error.message : String(error)
							}
			};
		}
	}

	void load();

	return {
		get state(): ListingState {
			return state;
		},
		reload: load
	};
}
