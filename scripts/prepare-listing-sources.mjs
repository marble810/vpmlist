#!/usr/bin/env node
/**
 * 为生成器准备来源：无完整包 Release 的仓库暂时跳过，防止上游 AddRange(null)。
 * 只修改 CI 工作区副本；仓库 source.json 永久保留配置，发布后自动纳入。
 * GitHub/API 错误必须中止，不能假装来源没有版本。
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function hasPackageRelease(releases) {
	if (!Array.isArray(releases)) throw new TypeError('GitHub releases must be an array');
	return releases.some((release) => !release.draft
		&& release.assets?.some((asset) => asset.name === 'package.json')
		&& release.assets?.some((asset) => asset.name.endsWith('.zip')));
}

export function prepareSources(source, fetchReleases) {
	const included = [];
	const skipped = [];
	for (const repository of source.githubRepos ?? []) {
		if (!/^[\w.-]+\/[\w.-]+$/.test(repository)) throw new Error(`Invalid repository: ${repository}`);
		if (hasPackageRelease(fetchReleases(repository))) included.push(repository);
		else skipped.push(repository);
	}
	return { source: { ...source, githubRepos: included }, skipped };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const path = process.argv[2] ?? 'source.json';
	const source = JSON.parse(readFileSync(path, 'utf8'));
	const result = prepareSources(source, (repository) => {
		// 分页结果在 Node 合并；不输出 Token 或全部 Release 响应。
		const pages = JSON.parse(execFileSync('gh', [
			'api', `repos/${repository}/releases?per_page=100`, '--paginate', '--slurp',
		], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }));
		return pages.flat();
	});
	writeFileSync(path, `${JSON.stringify(result.source, null, 2)}\n`, 'utf8');
	console.log(`Active repositories: ${result.source.githubRepos.join(', ') || '(none)'}`);
	for (const repository of result.skipped) {
		console.log(`Skipped unpublished package source: ${repository}`);
	}
}
