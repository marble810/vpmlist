#!/usr/bin/env node
/**
 * Guards the Avatar/World/Any mapping the site renders.
 *
 * The listing format has no `type` field, so `getPackageType` (src/lib/vpm.ts)
 * is the only thing that decides what the Type column shows — this test is what
 * keeps it from silently regressing.
 *
 * Both dependency maps count: VRChat's own docs declare the SDK through
 * `vpmDependencies` (Modular Avatar does the same), while other packages put it
 * in Unity's `dependencies`. Avatar wins over World, matching the policy the
 * listing action uses for its own template pages.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getPackageType } from '../src/lib/vpm.ts';

const AVATARS = 'com.vrchat.avatars';
const WORLDS = 'com.vrchat.worlds';

function manifest({ dependencies = {}, vpmDependencies = {} } = {}) {
	return { name: 'com.example.package', version: '1.0.0', url: '', dependencies, vpmDependencies };
}

test('the SDK in vpmDependencies makes a package Avatar', () => {
	assert.equal(getPackageType(manifest({ vpmDependencies: { [AVATARS]: '>=3.10.2' } })), 'Avatar');
});

test('the SDK in Unity dependencies makes a package Avatar', () => {
	assert.equal(getPackageType(manifest({ dependencies: { [AVATARS]: '3.10.2' } })), 'Avatar');
});

test('the Worlds SDK makes a package World from either map', () => {
	assert.equal(getPackageType(manifest({ vpmDependencies: { [WORLDS]: '>=3.10.2' } })), 'World');
	assert.equal(getPackageType(manifest({ dependencies: { [WORLDS]: '3.10.2' } })), 'World');
});

test('Avatar wins when both SDKs are required', () => {
	assert.equal(
		getPackageType(manifest({ dependencies: { [WORLDS]: '3.10.2' }, vpmDependencies: { [AVATARS]: '>=3.10.2' } })),
		'Avatar'
	);
});

test('a missing or SDK-free manifest is Any', () => {
	assert.equal(getPackageType(manifest()), 'Any');
	assert.equal(getPackageType(manifest({ vpmDependencies: { 'nadena.dev.ndmf': '>=1.11.0' } })), 'Any');
});

test('the two published packages are Avatar', () => {
	// marble810/MarbleAvatarToolbox and marble810/NeckMaskMaker, as released.
	assert.equal(
		getPackageType(manifest({ vpmDependencies: { [AVATARS]: '>=3.10.2', 'nadena.dev.ndmf': '>=1.11.0' } })),
		'Avatar'
	);
	assert.equal(getPackageType(manifest({ vpmDependencies: { [AVATARS]: '>=3.10.2' } })), 'Avatar');
});
