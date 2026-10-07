<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { getLocale, localeNames, locales, setLocale, t, type Locale } from '$lib/i18n/index.js';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="icon-sm" aria-label={t('header.changeLanguage')}>
				<span class="text-[0.8rem] leading-none font-semibold tracking-tight">Aa</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="min-w-44">
		<DropdownMenu.Label>{t('language.label')}</DropdownMenu.Label>
		<DropdownMenu.RadioGroup
			value={getLocale()}
			onValueChange={(value) => setLocale(value as Locale)}
		>
			{#each locales as option (option)}
				<DropdownMenu.RadioItem value={option}>{localeNames[option]}</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
		<DropdownMenu.Separator />
		<p class="text-muted-foreground px-1.5 pt-0.5 pb-1 text-xs leading-snug">
			{t('language.translatedBy')}
		</p>
	</DropdownMenu.Content>
</DropdownMenu.Root>
