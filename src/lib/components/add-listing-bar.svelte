<script lang="ts">
	import CircleHelpIcon from '@lucide/svelte/icons/circle-help';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { copyText } from '$lib/clipboard';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Card, CardContent } from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { t } from '$lib/i18n/index.js';
	import { openInVcc, resolveAssetUrl, siteConfig } from '$lib/site-config';

	let { onhelp }: { onhelp: () => void } = $props();
</script>

<Card class="overflow-visible py-4">
	<CardContent class="flex flex-col gap-3">
		<div class="flex flex-wrap items-center justify-between gap-2">
			<Label for="listing-url" class="text-sm">
				{t('common.listingUrl')}
			</Label>
			<button
				type="button"
				onclick={onhelp}
				class="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs underline-offset-4 hover:underline"
			>
				<CircleHelpIcon class="size-3.5" />
				{t('bar.howToAdd')}
			</button>
		</div>

		<div class="flex flex-col gap-2 sm:flex-row">
			<Input
				id="listing-url"
				readonly
				value={siteConfig.listingUrl}
				class="font-mono text-xs sm:text-xs"
				onfocus={(event) => event.currentTarget.select()}
			/>

			<div class="listing-actions flex shrink-0 gap-2">
				<div class="add-listing-target relative grow sm:grow-0">
					<Button onclick={() => openInVcc()} class="w-full">
						<PlusIcon />
						{t('common.addToVcc')}
					</Button>
					<div class="listing-hint" aria-hidden="true">
						<img class="press-here" src={resolveAssetUrl('press_here.png')} alt="" />
						<img class="hint-arrow" src={resolveAssetUrl('arrow.png')} alt="" />
					</div>
				</div>
				<Button
					variant="outline"
					onclick={() => copyText(siteConfig.listingUrl, t('toast.listingUrlCopied'))}
				>
					<CopyIcon />
					{t('common.copy')}
				</Button>
			</div>
		</div>
	</CardContent>
</Card>

<style>
	.listing-hint {
		--arrow-width: 360px;
		position: absolute;
		inset: 0;
		z-index: 10;
		pointer-events: none;
		user-select: none;
	}

	.press-here {
		position: absolute;
		width: 180px;
		max-width: none;
		left: 50%;
		top: -54px;
		transform: translateX(-50%);
	}

	.hint-arrow {
		position: absolute;
		width: var(--arrow-width);
		max-width: none;
		left: 65%;
		/* The tip is 0.875 image-widths below its top edge. */
		top: calc(100% + 8px - var(--arrow-width) * 0.875);
	}

	/* The supplied artwork is white; keep it visible on the light theme too. */
	:global(html:not(.dark)) .listing-hint {
		filter: invert(1);
	}

	@media (max-width: 639px) {
		.listing-hint {
			display: none;
		}
	}
</style>
