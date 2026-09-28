<script lang="ts">
	import CopyIcon from '@lucide/svelte/icons/copy';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { copyText } from '$lib/clipboard';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { openInVcc, siteConfig } from '$lib/site-config';
	import type { Package, PackageVersion } from '$lib/vpm';

	let { open = $bindable(false), pkg = null }: { open?: boolean; pkg?: Package | null } = $props();

	let versionId = $state<string | null>(null);
	let trackedPackageId = $state<string | null>(null);

	// Reset the selected version whenever a different package opens the dialog.
	$effect(() => {
		if (pkg && pkg.id !== trackedPackageId) {
			trackedPackageId = pkg.id;
			versionId = pkg.latest.version;
		}
	});

	const version = $derived<PackageVersion | null>(
		pkg ? (pkg.versions.find((candidate) => candidate.version === versionId) ?? pkg.latest) : null
	);

	const dependencies = $derived(Object.entries(version?.dependencies ?? {}));
	const keywords = $derived(version?.keywords ?? []);
	const sha = $derived(version?.zipSHA256);
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-xl">
		<Dialog.Header>
			<Dialog.Title class="pr-8">{pkg?.displayName ?? 'Package'}</Dialog.Title>
			<Dialog.Description class="flex flex-wrap items-center gap-2">
				<span class="font-mono text-xs">{pkg?.id}</span>
				{#if version}
					<Badge variant="outline" class="font-mono">v{version.version}</Badge>
					<Badge variant="secondary">{version.type}</Badge>
				{/if}
			</Dialog.Description>
		</Dialog.Header>

		{#if pkg && version}
			{#if pkg.versions.length > 1}
				<div class="flex flex-col gap-2">
					<span class="text-muted-foreground text-xs font-medium tracking-wide uppercase">
						Versions
					</span>
					<div class="flex flex-wrap gap-1.5">
						{#each pkg.versions as candidate (candidate.version)}
							<Button
								size="xs"
								variant={candidate.version === version.version ? 'default' : 'outline'}
								class="font-mono"
								onclick={() => (versionId = candidate.version)}
							>
								{candidate.version}
							</Button>
						{/each}
					</div>
					<Separator />
				</div>
			{/if}

			{#if version.description}
				<p class="text-muted-foreground text-sm text-pretty">{version.description}</p>
			{/if}

			<dl class="grid gap-2 text-sm sm:grid-cols-[7rem_1fr]">
				{#if version.author?.name}
					<dt class="text-muted-foreground">Author</dt>
					<dd>
						{#if version.author.url}
							<a
								href={version.author.url}
								target="_blank"
								rel="noreferrer"
								class="underline-offset-4 hover:underline"
							>
								{version.author.name}
							</a>
						{:else}
							{version.author.name}
						{/if}
					</dd>
				{/if}

				<dt class="text-muted-foreground">Dependencies</dt>
				<dd class="flex flex-col gap-1">
					{#if dependencies.length === 0}
						<span class="text-muted-foreground">None</span>
					{:else}
						{#each dependencies as [name, range] (name)}
							<span class="flex flex-wrap items-baseline gap-x-2">
								<span class="font-mono text-xs">{name}</span>
								<span class="text-muted-foreground font-mono text-xs">{range}</span>
							</span>
						{/each}
					{/if}
				</dd>

				{#if version.unity}
					<dt class="text-muted-foreground">Unity</dt>
					<dd class="font-mono text-xs">{version.unity}</dd>
				{/if}

				{#if version.license || version.licensesUrl}
					<dt class="text-muted-foreground">License</dt>
					<dd>
						{#if version.licensesUrl}
							<a
								href={version.licensesUrl}
								target="_blank"
								rel="noreferrer"
								class="underline-offset-4 hover:underline"
							>
								{version.license ?? 'See license'}
							</a>
						{:else}
							{version.license}
						{/if}
					</dd>
				{/if}

				{#if sha}
					<dt class="text-muted-foreground">SHA-256</dt>
					<dd class="flex items-center gap-1">
						<code class="text-muted-foreground truncate font-mono text-xs">{sha.slice(0, 16)}…</code>
						<Button
							size="icon-xs"
							variant="ghost"
							aria-label="Copy SHA-256"
							onclick={() => copyText(sha, 'SHA-256 copied')}
						>
							<CopyIcon />
						</Button>
					</dd>
				{/if}
			</dl>

			{#if keywords.length > 0}
				<div class="flex flex-wrap gap-1.5">
					{#each keywords as keyword (keyword)}
						<Badge variant="secondary">{keyword}</Badge>
					{/each}
				</div>
			{/if}

			<Dialog.Footer class="flex-col gap-2 sm:flex-row sm:justify-between">
				<Button
					variant="outline"
					class="w-full sm:w-auto"
					href={version.url || undefined}
					target="_blank"
					rel="noreferrer"
					disabled={!version.url}
				>
					<DownloadIcon />
					Download .ZIP
				</Button>
				<div class="flex w-full gap-2 sm:w-auto">
					<Button
						variant="outline"
						class="flex-1 sm:flex-none"
						onclick={() => copyText(siteConfig.listingUrl, 'Listing URL copied')}
					>
						<CopyIcon />
						Listing URL
					</Button>
					<Button class="flex-1 sm:flex-none" onclick={() => openInVcc()}>
						<PlusIcon />
						Add to VCC
					</Button>
				</div>
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>
