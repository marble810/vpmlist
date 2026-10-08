import type { MessageKey } from './en';

/** 简体中文 */
const zhHans: Record<MessageKey, string> = {
	'meta.description': 'VRChat Creator Companion 包列表',

	'header.publishedBy': '发布者',
	'header.learnMore': '了解更多',
	'header.changeLanguage': '切换语言',

	'language.label': '语言',
	'language.translatedBy': '由Deepseek V4.1 Flash翻译',

	'common.listingUrl': '列表地址',
	'common.addToVcc': '添加到 VCC',
	'common.copy': '复制',
	'common.close': '关闭',
	'common.downloadZip': '下载 .ZIP',
	'common.viewOnGithub': '在 GitHub 上查看',

	'bar.howToAdd': '怎么把它添加到 VCC？',

	'help.title': '把这个列表添加到 VCC',
	'help.description': '只需要做一次。',
	'help.step1': '打开 VRChat Creator Companion（或 ALCOM），进入 Settings → Packages。',
	'help.step2': '点击 “Add Repository”。',
	'help.step3': '把下面的列表地址粘贴到输入框中。',
	'help.step4': '点击 “Add”，然后在仓库信息上确认 “I Understand”。',
	'help.step5': '打开任意项目，该列表中的包就会出现在 Manage Packages 里。',
	'help.footer': '关于包列表的更多说明见 {link}。',
	'help.footerLink': 'VCC 文档',

	'panel.title': '包',
	'panel.searchPlaceholder': '搜索名称、ID、关键词…',
	'panel.searchLabel': '搜索包',
	'panel.filterAll': '全部',
	'panel.errorTitle': '无法加载包列表',
	'panel.errorHttp': '无法加载 {url} — HTTP {status}',
	'panel.errorJson': '{url} 未返回 JSON',
	'panel.errorHint': '{indexJson} 由列表构建生成，本地可运行 {fetch}，把已发布的文件下载到 {public}。',
	'panel.retry': '重试',
	'panel.emptyTitle': '这个列表还没有包',
	'panel.emptyHint': '关联仓库发布的版本会自动出现在这里。',
	'panel.noMatchTitle': '没有符合筛选条件的包',
	'panel.clearFilters': '清除筛选',
	'panel.tablePackage': '包',
	'panel.tableType': '类型',
	'panel.tableLatest': '最新',
	'panel.tableActions': '操作',
	'panel.versionCountOne': '{count} 个版本',
	'panel.versionCountOther': '{count} 个版本',
	'panel.details': '包详情',

	'type.avatar': 'Avatar',
	'type.world': 'World',
	'type.any': '通用',

	'detail.packageFallback': '包',
	'detail.versions': '版本',
	'detail.author': '作者',
	'detail.dependencies': '依赖',
	'detail.none': '无',
	'detail.unity': 'Unity 版本',
	'detail.license': '许可证',
	'detail.seeLicense': '查看许可证',
	'detail.sha256': 'SHA-256',
	'detail.copySha': '复制 SHA-256',

	'toast.copiedToClipboard': '已复制到剪贴板',
	'toast.listingUrlCopied': '已复制列表地址',
	'toast.shaCopied': '已复制 SHA-256',
	'toast.copyFailed': '复制失败'
};

export default zhHans;
