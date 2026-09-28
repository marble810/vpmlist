import { toast } from 'svelte-sonner';

/**
 * Copy helper with a toast. Uses the async clipboard API, and falls back to the
 * legacy textarea trick for non-secure contexts.
 */
export async function copyText(text: string, message = 'Copied to clipboard'): Promise<void> {
	try {
		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(text);
		} else {
			fallbackCopy(text);
		}
		toast.success(message);
	} catch (error) {
		toast.error('Could not copy', {
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
