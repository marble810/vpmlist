<script lang="ts">
	import CopyIcon from '@lucide/svelte/icons/copy';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { copyText } from '$lib/clipboard';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { t, type MessageKey } from '$lib/i18n/index.js';
	import { openInVcc, siteConfig } from '$lib/site-config';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	const steps: MessageKey[] = [
		'help.step1',
		'help.step2',
		'help.step3',
		'help.step4',
		'help.step5'
	];

	/** `[before, after]` around the `{link}` token in `help.footer`. */
	const footerParts = $derived(t('help.footer').split('{link}'));
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-lg">
		<Dialog.Header>
			<Dialog.Title>{t('help.title')}</Dialog.Title>
			<Dialog.Description>{t('help.description')}</Dialog.Description>
		</Dialog.Header>

		<ol class="text-muted-foreground flex flex-col gap-2 text-sm">
			{#each steps as stepKey, index (stepKey)}
				<li class="flex gap-2">
					<span
						class="bg-muted text-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-medium"
					>
						{index + 1}
					</span>
					<span>{t(stepKey)}</span>
				</li>
			{/each}
		</ol>

		<Separator />

		<div class="flex flex-col gap-2">
			<span class="text-sm font-medium">{t('common.listingUrl')}</span>
			<div class="flex flex-col gap-2 sm:flex-row">
				<Input
					id="help-listing-url"
					readonly
					value={siteConfig.listingUrl}
					class="font-mono text-xs"
					onfocus={(event) => event.currentTarget.select()}
				/>
				<div class="flex shrink-0 gap-2">
					<Button
						variant="outline"
						onclick={() => copyText(siteConfig.listingUrl, t('toast.listingUrlCopied'))}
					>
						<CopyIcon />
						{t('common.copy')}
					</Button>
					<Button onclick={() => openInVcc()}>
						<PlusIcon />
						{t('common.addToVcc')}
					</Button>
				</div>
			</div>
		</div>

		<Dialog.Footer class="text-muted-foreground text-xs">
			{footerParts[0]}<a
				href="https://vcc.docs.vrchat.com/vpm/repos"
				target="_blank"
				rel="noreferrer"
				class="underline underline-offset-4"
			>{t('help.footerLink')}</a>{footerParts[1]}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
