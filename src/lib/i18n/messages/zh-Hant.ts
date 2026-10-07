import type { MessageKey } from './en';

/** 繁體中文 */
const zhHant: Record<MessageKey, string> = {
	'meta.description': 'VRChat Creator Companion 套件清單',

	'header.publishedBy': '發布者',
	'header.learnMore': '瞭解更多',
	'header.changeLanguage': '切換語言',

	'language.label': '語言',
	'language.translatedBy': '由Deepseek V4.1 Flash翻譯',

	'common.listingUrl': '清單網址',
	'common.addToVcc': '加入 VCC',
	'common.copy': '複製',
	'common.close': '關閉',
	'common.downloadZip': '下載 .ZIP',

	'bar.howToAdd': '如何將它加入 VCC？',

	'help.title': '將此清單加入 VCC',
	'help.description': '只需要做一次。',
	'help.step1': '開啟 VRChat Creator Companion（或 ALCOM），前往 Settings → Packages。',
	'help.step2': '點擊「Add Repository」。',
	'help.step3': '將下方的清單網址貼到欄位中。',
	'help.step4': '點擊「Add」，再以「I Understand」確認儲存庫資訊。',
	'help.step5': '開啟任一專案，此清單的套件就會出現在 Manage Packages 中。',
	'help.footer': '關於套件清單的更多說明請見 {link}。',
	'help.footerLink': 'VCC 文件',

	'panel.title': '套件',
	'panel.searchPlaceholder': '搜尋名稱、ID、關鍵字…',
	'panel.searchLabel': '搜尋套件',
	'panel.filterAll': '全部',
	'panel.errorTitle': '無法載入套件清單',
	'panel.errorHttp': '無法載入 {url} — HTTP {status}',
	'panel.errorJson': '{url} 未回傳 JSON',
	'panel.errorHint': '{indexJson} 由清單建置產生，在本機可執行 {fetch}，將已發布的檔案下載到 {public}。',
	'panel.retry': '重試',
	'panel.emptyTitle': '此清單尚無套件',
	'panel.emptyHint': '連結的儲存庫發布的版本會自動顯示在這裡。',
	'panel.noMatchTitle': '沒有符合篩選條件的套件',
	'panel.clearFilters': '清除篩選',
	'panel.tablePackage': '套件',
	'panel.tableType': '類型',
	'panel.tableLatest': '最新',
	'panel.tableActions': '操作',
	'panel.versionCountOne': '{count} 個版本',
	'panel.versionCountOther': '{count} 個版本',
	'panel.details': '套件詳情',

	'type.avatar': 'Avatar',
	'type.world': 'World',
	'type.any': '通用',

	'detail.packageFallback': '套件',
	'detail.versions': '版本',
	'detail.author': '作者',
	'detail.dependencies': '相依性',
	'detail.none': '無',
	'detail.unity': 'Unity 版本',
	'detail.license': '授權條款',
	'detail.seeLicense': '查看授權條款',
	'detail.sha256': 'SHA-256',
	'detail.copySha': '複製 SHA-256',

	'toast.copiedToClipboard': '已複製到剪貼簿',
	'toast.listingUrlCopied': '已複製清單網址',
	'toast.shaCopied': '已複製 SHA-256',
	'toast.copyFailed': '複製失敗'
};

export default zhHant;
