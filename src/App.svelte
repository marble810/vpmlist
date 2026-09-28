<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import AddListingBar from '$lib/components/add-listing-bar.svelte';
	import AddListingHelpDialog from '$lib/components/add-listing-help-dialog.svelte';
	import ListingHeader from '$lib/components/listing-header.svelte';
	import PackagesPanel from '$lib/components/packages-panel.svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { createListingQuery } from '$lib/listing.svelte';
	import { repositoryUrl, siteConfig } from '$lib/site-config';

	const listing = createListingQuery();
	let helpOpen = $state(false);
</script>

<ModeWatcher defaultMode="system" />

<div class="min-h-svh">
	<div class="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
		<ListingHeader />

		<AddListingBar onhelp={() => (helpOpen = true)} />

		<PackagesPanel listing={listing.state} onretry={listing.reload} />

		<footer
			class="text-muted-foreground border-border mt-2 flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-xs"
		>
			<span>{siteConfig.name} · a VPM package listing</span>
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
