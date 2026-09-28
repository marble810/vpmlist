<script lang="ts">
	import CopyIcon from '@lucide/svelte/icons/copy';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { copyText } from '$lib/clipboard';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { openInVcc, siteConfig } from '$lib/site-config';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	const steps = [
		'Open VRChat Creator Companion (or ALCOM) and go to Settings → Packages.',
		'Click “Add Repository”.',
		'Paste the listing URL below into the field.',
		'Click “Add”, then confirm the repository info with “I Understand”.',
		'Open any project — packages from this listing now show up in Manage Packages.'
	];
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-lg">
		<Dialog.Header>
			<Dialog.Title>Adding this listing to VCC</Dialog.Title>
			<Dialog.Description>
				Package listings are how VPM packages reach your projects. You only need to do this once.
			</Dialog.Description>
		</Dialog.Header>

		<ol class="text-muted-foreground flex flex-col gap-2 text-sm">
			{#each steps as step, index (step)}
				<li class="flex gap-2">
					<span
						class="bg-muted text-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-medium"
					>
						{index + 1}
					</span>
					<span>{step}</span>
				</li>
			{/each}
		</ol>

		<Separator />

		<div class="flex flex-col gap-2">
			<span class="text-sm font-medium">Listing URL</span>
			<div class="flex flex-col gap-2 sm:flex-row">
				<Input
					id="help-listing-url"
					readonly
					value={siteConfig.listingUrl}
					class="font-mono text-xs"
					onfocus={(event) => event.currentTarget.select()}
				/>
				<div class="flex shrink-0 gap-2">
					<Button variant="outline" onclick={() => copyText(siteConfig.listingUrl, 'Listing URL copied')}>
						<CopyIcon />
						Copy
					</Button>
					<Button onclick={() => openInVcc()}>
						<PlusIcon />
						Add to VCC
					</Button>
				</div>
			</div>
		</div>

		<Dialog.Footer class="text-muted-foreground text-xs">
			Read more about package listings in the
			<a href="https://vcc.docs.vrchat.com/vpm/repos" target="_blank" rel="noreferrer" class="underline underline-offset-4">
				VCC documentation
			</a>.
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
