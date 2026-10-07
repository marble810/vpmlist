<script lang="ts">
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import LanguageToggle from '$lib/components/language-toggle.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { t } from '$lib/i18n/index.js';
	import { resolveAssetUrl, siteConfig, siteTitle } from '$lib/site-config';

	const banner = resolveAssetUrl(siteConfig.bannerUrl);
</script>

<header class="flex flex-col gap-5">
	{#if banner}
		<img
			src={banner}
			alt=""
			class="aspect-5/1 w-full rounded-xl border object-cover"
			loading="eager"
		/>
	{/if}

	<div class="flex items-start justify-between gap-4">
		<div class="flex min-w-0 flex-col gap-2">
			<h1 class="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
				{siteTitle}
			</h1>

			<div class="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
				{#if siteConfig.author?.name}
					<span class="hidden sm:inline">{t('header.publishedBy')}</span>
					<Tooltip.Provider>
						<Tooltip.Root>
							<Tooltip.Trigger>
								{#snippet child({ props })}
									<a
										{...props}
										href={siteConfig.author.url}
										target="_blank"
										rel="noreferrer"
										class="text-foreground/80 underline decoration-dotted underline-offset-4 hover:text-foreground"
									>
										{siteConfig.author.name}
									</a>
								{/snippet}
							</Tooltip.Trigger>
							<Tooltip.Content>
								{siteConfig.author.email ?? siteConfig.author.name}
							</Tooltip.Content>
						</Tooltip.Root>
					</Tooltip.Provider>
				{/if}

				{#if siteConfig.infoLink?.url}
					<a
						href={siteConfig.infoLink.url}
						target="_blank"
						rel="noreferrer"
						class="hover:text-foreground inline-flex items-center gap-1 underline-offset-4 hover:underline"
					>
						{siteConfig.infoLink.text ?? t('header.learnMore')}
						<ExternalLinkIcon class="size-3.5" />
					</a>
				{/if}

				<span class="font-mono text-xs">{siteConfig.listingId}</span>
			</div>
		</div>

		<div class="flex shrink-0 items-center gap-2">
			<LanguageToggle />
		</div>
	</div>
</header>
