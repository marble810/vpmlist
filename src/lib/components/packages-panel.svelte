<script lang="ts">
	import DownloadIcon from '@lucide/svelte/icons/download';
	import InfoIcon from '@lucide/svelte/icons/info';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import SearchIcon from '@lucide/svelte/icons/search';
	import GithubIcon from './github-icon.svelte';
	import PackageDetailDialog from './package-detail-dialog.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Card } from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { segments, t, type MessageKey } from '$lib/i18n/index.js';
	import type { ListingFailure, ListingState } from '$lib/listing.svelte';
	import { openInVcc } from '$lib/site-config';
	import { getRepoUrl, type Package, type PackageType } from '$lib/vpm';

	let { listing, onretry }: { listing: ListingState; onretry: () => void } = $props();

	const typeFilters = ['All', 'Avatar', 'World', 'Any'] as const;
	type Filter = (typeof typeFilters)[number];

	const typeLabels: Record<Filter, MessageKey> = {
		All: 'panel.filterAll',
		Avatar: 'type.avatar',
		World: 'type.world',
		Any: 'type.any'
	};

	/** Code references woven into `panel.errorHint` through its `{token}`s. */
	const errorTokens: Record<string, string> = {
		indexJson: 'index.json',
		fetch: 'npm run listing:fetch',
		public: 'public/'
	};

	let search = $state('');
	let activeFilter = $state<Filter>('All');
	let detailOpen = $state(false);
	let selected = $state<Package | null>(null);

	const packages = $derived(listing.status === 'ready' ? listing.packages : []);
	const placeholderRows = Array.from({ length: 4 }, (_, index) => index);

	const filtered = $derived.by(() => {
		const query = search.trim().toLowerCase();
		return packages.filter((pkg) => {
			if (activeFilter !== 'All' && pkg.latest.type !== (activeFilter as PackageType)) return false;
			if (!query) return true;
			return [pkg.displayName, pkg.id, pkg.description ?? '', ...pkg.keywords]
				.join(' ')
				.toLowerCase()
				.includes(query);
		});
	});

	function showDetails(pkg: Package): void {
		selected = pkg;
		detailOpen = true;
	}

	function failureText(failure: ListingFailure): string {
		switch (failure.code) {
			case 'http':
				return t('panel.errorHttp', { url: failure.url, status: failure.status });
			case 'invalid':
				return t('panel.errorJson', { url: failure.url });
			default:
				return failure.message;
		}
	}

	function resetFilters(): void {
		search = '';
		activeFilter = 'All';
	}
</script>

<section class="flex flex-col gap-3">
	<div class="flex flex-wrap items-center gap-3">
		<!-- Only search sits above the decorative listing hint; the rest stays behind it. -->
		<div class="bg-background relative z-20 w-full rounded-md sm:w-72">
			<SearchIcon
				class="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
			/>
			<Input
				id="package-search"
				name="search"
				bind:value={search}
				class="pl-8"
				placeholder={t('panel.searchPlaceholder')}
				disabled={listing.status !== 'ready'}
				aria-label={t('panel.searchLabel')}
			/>
		</div>

		<div class="-order-1 flex items-center gap-2">
			<h2 class="text-lg font-semibold tracking-tight">{t('panel.title')}</h2>
			{#if listing.status === 'ready'}
				<Badge variant="secondary">{packages.length}</Badge>
			{/if}
		</div>
	</div>

	{#if listing.status === 'ready' && listing.packages.length > 1}
		<div class="flex flex-wrap items-center gap-1.5">
			{#each typeFilters as filter (filter)}
				<Button
					size="xs"
					variant={activeFilter === filter ? 'secondary' : 'ghost'}
					onclick={() => (activeFilter = filter)}
				>
					{t(typeLabels[filter])}
				</Button>
			{/each}
		</div>
	{/if}

	<Card class="overflow-hidden py-0">
		{#if listing.status === 'loading'}
			<div class="divide-border divide-y">
				{#each placeholderRows as row (row)}
					<div class="flex items-center gap-4 p-4">
						<div class="flex flex-1 flex-col gap-2">
							<Skeleton class="h-4 w-40" />
							<Skeleton class="h-3 w-64 max-w-full" />
						</div>
						<Skeleton class="h-5 w-14 shrink-0 rounded-full" />
						<Skeleton class="h-8 w-28 shrink-0 rounded-lg" />
					</div>
				{/each}
			</div>
		{:else if listing.status === 'error'}
			<div class="flex flex-col items-start gap-3 p-6">
				<div>
					<p class="text-sm font-medium">{t('panel.errorTitle')}</p>
					<p class="text-muted-foreground mt-1 text-sm">{failureText(listing.failure)}</p>
					<p class="text-muted-foreground mt-2 text-xs">
						{#each segments(t('panel.errorHint')) as segment, index (index)}
							{#if segment.token}<code class="font-mono">{errorTokens[segment.token]}</code>{:else}{segment.text}{/if}
						{/each}
					</p>
				</div>
				<Button variant="outline" size="sm" onclick={onretry}>
					<RefreshCwIcon />
					{t('panel.retry')}
				</Button>
			</div>
		{:else if packages.length === 0}
			<div class="text-muted-foreground flex flex-col items-center gap-2 px-6 py-12 text-center">
				<p class="text-foreground text-sm font-medium">{t('panel.emptyTitle')}</p>
				<p class="text-xs">
					{t('panel.emptyHint')}
				</p>
			</div>
		{:else if filtered.length === 0}
			<div class="flex flex-col items-center gap-3 px-6 py-12 text-center">
				<p class="text-sm font-medium">{t('panel.noMatchTitle')}</p>
				<Button variant="outline" size="sm" onclick={resetFilters}>{t('panel.clearFilters')}</Button>
			</div>
		{:else}
			<Table.Root>
				<Table.Header>
					<Table.Row class="hover:bg-transparent">
						<Table.Head>{t('panel.tablePackage')}</Table.Head>
						<Table.Head class="w-20">{t('panel.tableType')}</Table.Head>
						<Table.Head class="w-24">{t('panel.tableLatest')}</Table.Head>
						<Table.Head class="w-32 text-right">
							<span class="sr-only">{t('panel.tableActions')}</span>
						</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each filtered as pkg (pkg.id)}
						{@const repoUrl = getRepoUrl(pkg.latest)}
						<Table.Row>
							<Table.Cell class="max-w-0 whitespace-normal">
								<button
									type="button"
									class="group/link text-left"
									onclick={() => showDetails(pkg)}
								>
									<span
										class="decoration-muted-foreground/60 font-medium decoration-dotted group-hover/link:underline group-hover/link:underline-offset-4"
									>
										{pkg.displayName}
									</span>
									{#if pkg.description}
										<span class="text-muted-foreground mt-0.5 line-clamp-2 block text-xs text-pretty">
											{pkg.description}
										</span>
									{/if}
									<span class="text-muted-foreground/80 mt-1 block truncate font-mono text-xs">
										{pkg.id}
									</span>
								</button>
							</Table.Cell>
							<Table.Cell>
								<Badge variant="secondary">{t(typeLabels[pkg.latest.type])}</Badge>
							</Table.Cell>
							<Table.Cell class="font-mono text-xs">
								v{pkg.latest.version}
								<span class="text-muted-foreground block text-xs">
									{t(
										pkg.versions.length === 1
											? 'panel.versionCountOne'
											: 'panel.versionCountOther',
										{ count: pkg.versions.length }
									)}
								</span>
							</Table.Cell>
							<Table.Cell>
								<div class="flex items-center justify-end gap-1">
									<Button
										size="icon-sm"
										variant="ghost"
										href={pkg.latest.url || undefined}
										target="_blank"
										rel="noreferrer"
										disabled={!pkg.latest.url}
										aria-label={t('common.downloadZip')}
									>
										<DownloadIcon />
									</Button>
									<Button
										size="icon-sm"
										variant="ghost"
										aria-label={t('panel.details')}
										onclick={() => showDetails(pkg)}
									>
										<InfoIcon />
									</Button>
									{#if repoUrl}
										<Button
											size="icon-sm"
											variant="ghost"
											href={repoUrl}
											target="_blank"
											rel="noreferrer"
											aria-label={t('common.viewOnGithub')}
										>
											<GithubIcon />
										</Button>
									{/if}
									<!-- Keep the install action apart from the icon group beside it. -->
									<Button size="sm" class="ml-2" onclick={() => openInVcc()}>
										<PlusIcon />
										{t('common.addToVcc')}
									</Button>
								</div>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		{/if}
	</Card>

	<PackageDetailDialog bind:open={detailOpen} pkg={selected} />
</section>
