import en, { type MessageKey } from './messages/en';
import ja from './messages/ja';
import ko from './messages/ko';
import zhHans from './messages/zh-Hans';
import zhHant from './messages/zh-Hant';

export const locales = ['en', 'zh-Hans', 'zh-Hant', 'ja', 'ko'] as const;

export type Locale = (typeof locales)[number];

/** Shown in the language menu, each written in its own language. */
export const localeNames: Record<Locale, string> = {
	en: 'English',
	'zh-Hans': '简体中文',
	'zh-Hant': '繁體中文',
	ja: '日本語',
	ko: '한국어'
};

const dictionaries: Record<Locale, Record<MessageKey, string>> = {
	en,
	'zh-Hans': zhHans,
	'zh-Hant': zhHant,
	ja,
	ko
};

const STORAGE_KEY = 'vpmlist.locale';

function isLocale(value: string | null | undefined): value is Locale {
	return !!value && (locales as readonly string[]).includes(value);
}

/** Best-effort match for a BCP-47 tag: `zh-TW` → `zh-Hant`, `ja-JP` → `ja`, … */
function matchLocale(tag: string): Locale | undefined {
	const normalized = tag.toLowerCase();
	if (normalized.startsWith('zh')) {
		return /(hant|tw|hk|mo)/.test(normalized) ? 'zh-Hant' : 'zh-Hans';
	}
	if (normalized.startsWith('ja')) return 'ja';
	if (normalized.startsWith('ko')) return 'ko';
	if (normalized.startsWith('en')) return 'en';
	return undefined;
}

function detectLocale(): Locale {
	if (typeof window === 'undefined') return 'en';

	try {
		const stored = window.localStorage.getItem(STORAGE_KEY);
		if (isLocale(stored)) return stored;
	} catch {
		// localStorage can be blocked (private mode) — fall back to the browser language.
	}

	for (const tag of navigator.languages ?? [navigator.language]) {
		const match = matchLocale(tag);
		if (match) return match;
	}

	return 'en';
}

let current = $state<Locale>(detectLocale());

/** The active locale. Read it in a component to re-render when it changes. */
export function getLocale(): Locale {
	return current;
}

export function setLocale(next: Locale): void {
	if (next === current) return;
	current = next;

	try {
		window.localStorage.setItem(STORAGE_KEY, next);
	} catch {
		// Persisting the choice is optional; switching still works for this session.
	}
}

/**
 * Translate a key, filling `{name}` placeholders from `params`. Placeholders
 * with no matching param (e.g. `{link}`) are left for `segments()`.
 */
export function t(key: MessageKey, params?: Record<string, string | number>): string {
	const template = dictionaries[current][key] ?? en[key] ?? key;
	if (!params) return template;

	return template.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
		name in params ? String(params[name]) : placeholder
	);
}

export type MessageSegment = { text: string; token?: never } | { token: string; text?: never };

/** Split a message on `{token}` placeholders so a component can weave markup in. */
export function segments(message: string): MessageSegment[] {
	const parts = message.split(/\{(\w+)\}/);
	const result: MessageSegment[] = [];

	parts.forEach((part, index) => {
		if (part === '') return;
		result.push(index % 2 === 1 ? { token: part } : { text: part });
	});

	return result;
}
