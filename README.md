# Marble810的VCC List
- 如题

## 本地开发

站点读取的 `index.json` 由 CI 里的 `vrchat-community/package-list-action` 生成并发布到 GitHub Pages，
所以本地不会自己去生成它，而是直接拉取已发布的那一份：

```bash
npm install
npm run dev     # 启动前自动执行 listing:fetch，把已发布的 index.json 下载到 public/
```

- `npm run listing:fetch` — 单独下载/刷新 `public/index.json`（已被 `.gitignore` 忽略）。
  下载失败只会告警并保留原文件，不影响启动；加 `--strict` 可让失败返回非零退出码。
- `npm run build` 本地构建时也会先执行一次（CI 里会自动跳过，由 workflow 生成最新数据）。

## 多语言（i18n）

界面文案都在 `src/lib/i18n/messages/` 下，一种语言一个文件：

- `en.ts` 是唯一的事实来源，`MessageKey` 由它推导，其他语言少写/多写 key 都会被 `npm run check` 报错；
- 文案里的 `{name}` 用 `t(key, { name })` 填充；`{token}` 留给 `segments()` 拆开，
  让组件在句子中间插入链接或 `<code>`；
- 想加语言：写一个新的 message 文件，再到 `src/lib/i18n/locale.svelte.ts` 的
  `locales` / `localeNames` 里登记，右上角的 Aa 菜单会自动出现。

首次访问按浏览器语言（`zh-TW`→繁體中文、`zh-CN`→简体中文），之后的选择存在 localStorage。
