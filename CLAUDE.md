# arcade — 작업 안내

직접 만들고 노는 브라우저 게임 모음. GitHub Pages로 공개: https://imdongho.github.io/arcade/
사용자는 주로 아이폰 14 Pro(393×852) 홈 화면 앱으로 플레이한다. 소통은 한국어, 쉬운 말로.

## 구조
- index.html: 메인 화면. games.js의 목록을 읽어 카드로 보여준다.
- games.js: 게임 목록. 새 게임은 객체 하나 추가
  (id, category: puzzle|arcade|relax, title, desc, url, thumb, color, status: play|proto|soon, meta, tags).
  메인 화면 위쪽 분류 버튼(전체/퍼즐/아케이드/편하게 놀기)이 category로 나눈다. 게임이 더 많아지면 분류를 더 나눈다
  (새 분류는 index.html의 CATS에 한 줄 추가).
  status: soon(준비 중)은 썸네일만 먼저 걸어 두는 카드로, 눌러도 이동하지 않는다. 게임을 만들면 play로 바꾼다.
- 게임마다 폴더 하나: index.html(게임 전체가 한 파일) + thumb.svg(320×200 네온 썸네일).
- shared/zoom-reset.js: 확대 상태에서 "원래 크기로" 버튼. 모든 페이지에 포함.
- icons/: 홈 화면 아이콘. tools/: 레벨 생성기(node).

## 게임 규칙
- 마음 편하게 하는 게임이 가장 중요하다. 제한 시간, 게임 중 흘러가는 타이머처럼
  쫓기는 요소는 넣기 전에 먼저 사용자에게 묻는다. 기록(버틴 시간 등)은 끝난 뒤 결과 화면에서만 보여준다.
- 탭/드래그로만 하는 게임. 키보드가 필요한 게임은 만들지 않는다.
- 파일 하나로 PC와 폰을 모두 지원한다 (모바일 버전 파일을 따로 만들지 않음).
- 폰 레이아웃(@media max-width:600px): 게임판이 맨 위, 상태는 한 줄 4칸,
  버튼은 화면 아래 고정 바(safe-area 여백 포함), 설명은 <details data-auto>로 접기.
  laser-mirror/index.html이 기준 구현.
- 스테이지형 퍼즐: 30스테이지/3챕터, 5번째는 쉬어가는 판, 10번째가 챕터 최고점.
  레벨은 생성기+검증기로 만들고 풀 수 있는지, 최소 수를 반드시 검증한다.
  별점: 최소로 깨면 3개, 힌트 쓰면 1개. 진행은 localStorage(게임별 접두어, try/catch).
  기록·진행·이어하기를 저장하는 새 키를 만들면 index.html의 RECORD_KEYS에도 꼭 추가한다
  (메인 화면 "게임 기록 전체 초기화"가 이 목록의 키만 지운다. 같은 주소의 다른 데이터는 건드리지 않게
  localStorage.clear()나 접두어 지우기는 쓰지 않는다. 소리·진동 설정 키는 지우지 않는다).
  - 예외: 색 정렬 튜브는 별 대신 기록과 체크만 보여준다.
    편하게 정리하는 맛으로 하는 게임이라, 별이 있으면 "최소로 못 깼다"는 부담이 생기고
    힌트도 마음 편히 못 쓴다. 그래서 내 기록(가장 적은 이동 수)과 최소 이동 수만 보여주고,
    깬 스테이지는 ✓, 최소 이동으로 깬 스테이지는 은은하게 빛나게 한다. 힌트는 불이익 없음.
    비슷하게 부담 없이 즐기는 퍼즐을 새로 만들 때도 별을 넣을지 먼저 사용자에게 물어본다.
  - 한붓그리기도 별 없이 깬 판에 ✓만 (최소 수 개념이 없고, 사용자가 체크만 고름).

## 아이폰 처리 (빠뜨리면 실제로 문제가 났던 것들)
- html에 touch-action:manipulation (더블탭 확대 방지).
- 게임판 canvas: 탭 게임은 touch-action:pinch-zoom,
  빠른 연타 게임은 none + 두 번째 touchend preventDefault.
- 마우스 hover 효과는 pointerType==='mouse'일 때만.
- head에 apple-mobile-web-app 메타와 apple-touch-icon. manifest는 넣지 않는다
  (PC 크롬에 설치 버튼이 떠서 사용자가 빼달라고 함).
- 파일을 직접 열 때도 동작하도록 meta charset과 [hidden]{display:none!important}를 꼭 넣는다.
- 전역 변수 이름으로 top, name, status 같은 window 속성명을 쓰지 않는다.
- 외부 라이브러리는 CDN에서 받지 않고 shared/에 넣어 쓴다 (예: shared/matter-0.19.0.min.js, npm 공식 패키지 그대로).
- 움직이는 canvas 게임은 게임 오버 뒤 연출이 끝나면 다시 그리지 않는다(배터리 절약).
  계속 늘어나는 목록(지나간 행성, 아래 블록)은 화면 근처만 돌거나 지운다.

## 디자인
- 어두운 네온 단일 테마. 폰트: Black Han Sans(제목), IBM Plex Sans KR(본문), JetBrains Mono(숫자).
- 색: 배경 #0a0c13, 패널 #10141e, 선 #20283a, 시안 #43f0ff, 핑크 #ff4fd2, 앰버 #ffc44d, 레드 #ff4b5e.

## 확인과 업로드
- 레벨/로직은 node로 검증하고, 393×852 화면에서 보이는지 확인한다.
- 커밋 메시지는 한국어. 작성자는 ImDongHo <ImDongHo@users.noreply.github.com> (실제 이메일 노출 금지).
- main에 push하면 1~2분 뒤 Pages에 반영된다.
