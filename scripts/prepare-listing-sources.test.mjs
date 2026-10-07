import assert from 'node:assert/strict';
import test from 'node:test';
import { hasPackageRelease, prepareSources } from './prepare-listing-sources.mjs';

const complete = [{ draft: false, assets: [{ name: 'package.json' }, { name: 'package-1.0.0.zip' }] }];

test('无 Release 的新来源不能传给上游生成器，原列表身份不变', () => {
	const source = { id: 'com.marble810.vpmlist', url: 'https://marble810.github.io/vpmlist/index.json',
		githubRepos: ['marble810/MarbleAvatarToolbox', 'marble810/NeckMaskMaker'], packages: [] };
	const result = prepareSources(source, (repo) => repo.endsWith('NeckMaskMaker') ? [] : complete);
	assert.deepEqual(result.source.githubRepos, ['marble810/MarbleAvatarToolbox']);
	assert.deepEqual(result.skipped, ['marble810/NeckMaskMaker']);
	assert.equal(result.source.id, source.id);
	assert.equal(result.source.url, source.url);
	assert.equal(source.githubRepos.length, 2);
});

test('首版资源完整后自动纳入，不需要再次改来源配置', () => {
	const result = prepareSources({ githubRepos: ['marble810/NeckMaskMaker'] }, () => complete);
	assert.deepEqual(result.source.githubRepos, ['marble810/NeckMaskMaker']);
	assert.deepEqual(result.skipped, []);
});

test('草稿和资源未上传完的 Release 不纳入', () => {
	assert.equal(hasPackageRelease([{ ...complete[0], draft: true }]), false);
	assert.equal(hasPackageRelease([{ draft: false, assets: [{ name: 'package.json' }] }]), false);
	assert.equal(hasPackageRelease([{ draft: false, assets: [{ name: 'package.zip' }] }]), false);
});

test('API/授权错误必须抛出，不静默删除已发布来源', () => {
	assert.throws(() => prepareSources({ githubRepos: ['marble810/NeckMaskMaker'] }, () => {
		throw new Error('HTTP 403');
	}), /HTTP 403/);
	assert.throws(() => hasPackageRelease({ message: 'Not Found' }), /array/);
});
