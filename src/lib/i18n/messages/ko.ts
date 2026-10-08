import type { MessageKey } from './en';

/** 한국어 */
const ko: Record<MessageKey, string> = {
	'meta.description': 'VRChat Creator Companion 패키지 목록',

	'header.publishedBy': '게시자',
	'header.learnMore': '자세히 보기',
	'header.changeLanguage': '언어 변경',

	'language.label': '언어',
	'language.translatedBy': 'Deepseek V4.1 Flash 번역',

	'common.listingUrl': '목록 URL',
	'common.addToVcc': 'VCC에 추가',
	'common.copy': '복사',
	'common.close': '닫기',
	'common.downloadZip': '.ZIP 다운로드',
	'common.viewOnGithub': 'GitHub에서 보기',

	'bar.howToAdd': 'VCC에 추가하는 방법',

	'help.title': '이 목록을 VCC에 추가하기',
	'help.description': '한 번만 하면 됩니다.',
	'help.step1': 'VRChat Creator Companion(또는 ALCOM)을 열고 Settings → Packages로 이동합니다.',
	'help.step2': '“Add Repository”를 클릭합니다.',
	'help.step3': '아래 목록 URL을 입력란에 붙여 넣습니다.',
	'help.step4': '“Add”를 클릭한 뒤 “I Understand”로 리포지토리 정보를 확인합니다.',
	'help.step5': '아무 프로젝트나 열면 이 목록의 패키지가 Manage Packages에 표시됩니다.',
	'help.footer': '패키지 목록에 대한 자세한 내용은 {link}에서 확인하세요.',
	'help.footerLink': 'VCC 문서',

	'panel.title': '패키지',
	'panel.searchPlaceholder': '이름, ID, 키워드 검색…',
	'panel.searchLabel': '패키지 검색',
	'panel.filterAll': '전체',
	'panel.errorTitle': '패키지 목록을 불러오지 못했습니다',
	'panel.errorHttp': '{url}을(를) 불러오지 못했습니다 — HTTP {status}',
	'panel.errorJson': '{url}이(가) JSON을 반환하지 않았습니다',
	'panel.errorHint':
		'{indexJson}은 목록 빌드에서 생성됩니다. 로컬에서는 {fetch}를 실행해 게시된 파일을 {public}에 내려받으세요.',
	'panel.retry': '다시 시도',
	'panel.emptyTitle': '이 목록에는 아직 패키지가 없습니다',
	'panel.emptyHint': '연결된 리포지토리에서 게시한 릴리스가 여기에 자동으로 표시됩니다.',
	'panel.noMatchTitle': '필터와 일치하는 패키지가 없습니다',
	'panel.clearFilters': '필터 초기화',
	'panel.tablePackage': '패키지',
	'panel.tableType': '유형',
	'panel.tableLatest': '최신',
	'panel.tableActions': '작업',
	'panel.versionCountOne': '{count}개 버전',
	'panel.versionCountOther': '{count}개 버전',
	'panel.details': '패키지 정보',

	'type.avatar': '아바타',
	'type.world': '월드',
	'type.any': '공용',

	'detail.packageFallback': '패키지',
	'detail.versions': '버전',
	'detail.author': '제작자',
	'detail.dependencies': '종속성',
	'detail.none': '없음',
	'detail.unity': 'Unity',
	'detail.license': '라이선스',
	'detail.seeLicense': '라이선스 보기',
	'detail.sha256': 'SHA-256',
	'detail.copySha': 'SHA-256 복사',

	'toast.copiedToClipboard': '클립보드에 복사했습니다',
	'toast.listingUrlCopied': '목록 URL을 복사했습니다',
	'toast.shaCopied': 'SHA-256을 복사했습니다',
	'toast.copyFailed': '복사할 수 없습니다'
};

export default ko;
