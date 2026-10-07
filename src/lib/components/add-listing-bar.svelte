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
	import { openInVcc, siteConfig } from '$lib/site-config';

	let { onhelp }: { onhelp: () => void } = $props();
</script>

<Card class="py-4">
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

			<div class="flex shrink-0 gap-2">
				<Button onclick={() => openInVcc()} class="grow sm:grow-0">
					<PlusIcon />
					{t('common.addToVcc')}
				</Button>
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
