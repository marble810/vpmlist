# AGENTS.md

本仓库 = VPM listing 源(`source.json`)+ 它的展示站点(Svelte 5 + Vite,`src/**`)。
站点只渲染数据,不生产数据。

## 硬约束

1. **不要修改 `source.json`。**
   它既是 CI 里 `package-list-action` 生成 `index.json` 的输入,也是 VCC / ALCOM 看到的 listing 身份信息(名字、id、作者、banner、仓库列表)。改它等于改 listing 本身。

2. **改 VPM listing 时,不要碰 `packages` 里的任何东西。**
   `index.json` 的 `packages`(以及每个 package 的 `displayName`、描述、版本、依赖、下载地址等字段)只由上游包仓库的 `package.json` + release 决定:

   - 不要在站点里覆盖、改写或"美化"包名与其他包字段(不引入显示名映射表之类的东西);
   - 不要新增 post-process 脚本或 workflow 步骤去 patch 生成出来的 `index.json`;
   - 要改包名 / 描述,去上游包仓库改,发新版本后 listing 自动跟上。

3. **站点侧只改渲染。**
   界面与文案在 `src/**`(组件、`src/lib/i18n/messages/`)。数据永远只读:`packages` 里有什么就显示什么。

## 站点标题

- 本站的名字(浏览器标签、页面 H1、页脚)= 品牌名 **Marble's VPM Listing**,唯一来源是 `src/lib/site-config.ts` 的 `siteTitle`;站点各处都读它,别写散字符串。
- **不做 i18n**:不要放进 `src/lib/i18n/messages/`,也不要按语言翻译。
- `index.html` 里的静态 `<title>` 保持同一字符串(无 JS 时的回退)。
- 它只是显示层,和数据无关:不要去改 `source.json` 的 `name`(那是 listing 自己的名字,见约束 1)。

## 判断名字从哪来

- 本站的名字(浏览器标签标题、页面 H1、页脚)→ `siteTitle`(品牌名,可改,但不进 i18n)。
  注意:它与 listing 自己的名字可能不同——站点只显示品牌,不去改数据。
- listing 名字(VCC / ALCOM 里订阅时看到的)→ `source.json` 的 `name`(受约束 1,不动)。
- 包列表里的名字 → 上游包的 `package.json`(受约束 2,不动)。
- 界面文案(按钮、"Published by"、提示语) → `src/lib/i18n/messages/`(可改)。

## 验证

- 小修改(文案、字符串、样式、常量)不用起浏览器测试:`npm run check` 过了就行,必要时 `npm run build` 确认能构建。
- 只在改动真的可能影响渲染 / 交互时(大重构、布局、数据加载逻辑)才 `vite preview` + 浏览器看一眼。
