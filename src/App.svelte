<script lang="ts">
	import AddListingBar from '$lib/components/add-listing-bar.svelte';
	import AddListingHelpDialog from '$lib/components/add-listing-help-dialog.svelte';
	import ListingHeader from '$lib/components/listing-header.svelte';
	import PackagesPanel from '$lib/components/packages-panel.svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { getLocale, t } from '$lib/i18n/index.js';
	import { createListingQuery } from '$lib/listing.svelte';
	import { repositoryUrl, siteTitle } from '$lib/site-config';

	const listing = createListingQuery();
	let helpOpen = $state(false);

	// The title is the site's own name, not copy — set it once, never translated.
	document.title = siteTitle;

	// Keep the rest of the document chrome in sync with the selected locale.
	$effect(() => {
		document.documentElement.lang = getLocale();
		document
			.querySelector('meta[name="description"]')
			?.setAttribute('content', t('meta.description'));
	});
</script>

<div class="min-h-svh overflow-x-clip">
	<div class="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
		<ListingHeader />

		<AddListingBar onhelp={() => (helpOpen = true)} />

		<PackagesPanel listing={listing.state} onretry={listing.reload} />

		<footer
			class="text-muted-foreground border-border mt-2 flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-xs"
		>
			<span>{siteTitle}</span>
			{#if repositoryUrl}
				<a
					href={repositoryUrl}
					target="_blank"
					rel="noreferrer"
					class="hover:text-foreground underline-offset-4 hover:underline"
				>
					{repositoryUrl.replace(/^https?:\/\//, '')}
				</a>
			{/if}
		</footer>
	</div>
</div>

<AddListingHelpDialog bind:open={helpOpen} />
<Toaster position="bottom-right" />
