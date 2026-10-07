import type { MessageKey } from './en';

/** 日本語 */
const ja: Record<MessageKey, string> = {
	'meta.description': 'VRChat Creator Companion のパッケージリスト',

	'header.publishedBy': '公開者',
	'header.learnMore': '詳細を見る',
	'header.changeLanguage': '言語を切り替え',

	'language.label': '言語',
	'language.translatedBy': 'Deepseek V4.1 Flash による翻訳',

	'common.listingUrl': 'リスト URL',
	'common.addToVcc': 'VCC に追加',
	'common.copy': 'コピー',
	'common.close': '閉じる',
	'common.downloadZip': '.ZIP をダウンロード',

	'bar.howToAdd': 'VCC に追加する方法',

	'help.title': 'このリストを VCC に追加する',
	'help.description': 'この操作は一度だけ必要です。',
	'help.step1': 'VRChat Creator Companion（または ALCOM）を開き、Settings → Packages に移動します。',
	'help.step2': '「Add Repository」をクリックします。',
	'help.step3': '下記のリスト URL を入力欄に貼り付けます。',
	'help.step4': '「Add」をクリックし、「I Understand」でリポジトリ情報を確認します。',
	'help.step5': '任意のプロジェクトを開くと、このリストのパッケージが Manage Packages に表示されます。',
	'help.footer': 'パッケージリストの詳細は{link}をご覧ください。',
	'help.footerLink': 'VCC ドキュメント',

	'panel.title': 'パッケージ',
	'panel.searchPlaceholder': '名前・ID・キーワードで検索…',
	'panel.searchLabel': 'パッケージを検索',
	'panel.filterAll': 'すべて',
	'panel.errorTitle': 'パッケージリストを読み込めませんでした',
	'panel.errorHttp': '{url} を読み込めませんでした — HTTP {status}',
	'panel.errorJson': '{url} が JSON を返しませんでした',
	'panel.errorHint':
		'{indexJson} はリストのビルドで生成されます。ローカルでは {fetch} を実行し、公開済みのファイルを {public} にダウンロードしてください。',
	'panel.retry': '再試行',
	'panel.emptyTitle': 'このリストにはまだパッケージがありません',
	'panel.emptyHint': 'リンクされたリポジトリで公開されたリリースが自動的にここに表示されます。',
	'panel.noMatchTitle': '条件に一致するパッケージがありません',
	'panel.clearFilters': 'フィルターを解除',
	'panel.tablePackage': 'パッケージ',
	'panel.tableType': '種類',
	'panel.tableLatest': '最新',
	'panel.tableActions': '操作',
	'panel.versionCountOne': '{count} バージョン',
	'panel.versionCountOther': '{count} バージョン',
	'panel.details': 'パッケージの詳細',

	'type.avatar': 'アバター',
	'type.world': 'ワールド',
	'type.any': '汎用',

	'detail.packageFallback': 'パッケージ',
	'detail.versions': 'バージョン',
	'detail.author': '作者',
	'detail.dependencies': '依存関係',
	'detail.none': 'なし',
	'detail.unity': 'Unity',
	'detail.license': 'ライセンス',
	'detail.seeLicense': 'ライセンスを見る',
	'detail.sha256': 'SHA-256',
	'detail.copySha': 'SHA-256 をコピー',

	'toast.copiedToClipboard': 'クリップボードにコピーしました',
	'toast.listingUrlCopied': 'リスト URL をコピーしました',
	'toast.shaCopied': 'SHA-256 をコピーしました',
	'toast.copyFailed': 'コピーできませんでした'
};

export default ja;
