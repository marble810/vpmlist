import { toast } from 'svelte-sonner';
import { t } from '$lib/i18n/index.js';

/**
 * Copy helper with a toast. Uses the async clipboard API, and falls back to the
 * legacy textarea trick for non-secure contexts.
 */
export async function copyText(text: string, message?: string): Promise<void> {
	try {
		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(text);
		} else {
			fallbackCopy(text);
		}
		toast.success(message ?? t('toast.copiedToClipboard'));
	} catch (error) {
		toast.error(t('toast.copyFailed'), {
			description: error instanceof Error ? error.message : String(error),
		});
	}
}

function fallbackCopy(text: string): void {
	const textarea = document.createElement('textarea');
	textarea.value = text;
	textarea.setAttribute('readonly', '');
	textarea.style.position = 'fixed';
	textarea.style.top = '-1000px';
	document.body.appendChild(textarea);
	textarea.select();
	document.execCommand('copy');
	textarea.remove();
}
