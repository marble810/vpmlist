import source from '../../source.json';

/**
 * Site metadata, read from `source.json` — the same file the CI listing
 * action (`vrchat-community/package-list-action`) uses to build `index.json`.
 * It is bundled at build time, so the listing URL and banner never disagree
 * with what VCC sees.
 */
export const siteConfig = {
	name: source.name,
	listingId: source.id,
	/** The URL users paste into VCC / ALCOM — points at the generated index.json. */
	listingUrl: source.url,
	description: source.description,
	author: source.author,
	infoLink: source.infoLink,
	bannerUrl: source.bannerUrl,
};

export const repositoryUrl = (() => {
	const infoLink = siteConfig.infoLink?.url;
	if (!infoLink) return undefined;
	return infoLink.replace(/\/blob\/.*$/, '');
})();

/** Resolve a listing-relative asset (e.g. `banner.png`) against the current page. */
export function resolveAssetUrl(url: string | undefined): string | undefined {
	if (!url) return undefined;
	try {
		return new URL(url, document.baseURI).toString();
	} catch {
		return undefined;
	}
}

/** Location of the generated listing JSON, served next to index.html. */
export function resolveListingDataUrl(): string {
	return new URL('index.json', document.baseURI).toString();
}

/** `vcc://` deep link understood by both VCC and ALCOM. */
export function addRepoDeepLink(url: string = siteConfig.listingUrl): string {
	return `vcc://vpm/addRepo?url=${encodeURIComponent(url)}`;
}

export function openInVcc(url?: string): void {
	window.location.assign(addRepoDeepLink(url));
}
