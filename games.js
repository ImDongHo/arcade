// 게임 목록 — 새 게임을 만들면 여기에 한 줄(객체 하나)만 추가하면 메인 화면에 카드가 생겨요.
// status: "play"(플레이 가능) | "proto"(프로토타입) | "soon"(준비 중)
// category: "puzzle"(퍼즐) | "arcade"(아케이드) | "relax"(편하게 놀기) — 메인 화면 분류 버튼에 쓰여요. 새 분류는 index.html의 CATS에 한 줄 추가.
window.GAMES = [
  {
    id: "laser-mirror",
    category: "puzzle",
    title: "레이저 거울 반사",
    desc: "거울을 돌려 빛으로 모든 타깃을 밝히는 퍼즐",
    url: "laser-mirror/index.html",
    thumb: "laser-mirror/thumb.svg",
    color: "#43f0ff",
    status: "play",
    meta: "30스테이지 · 3챕터",
    tags: ["퍼즐", "자동 생성"]
  },
  {
    id: "parking-escape",
    category: "puzzle",
    title: "주차장 탈출",
    desc: "꽉 막힌 차들을 밀어서 빨간 차를 빼내는 퍼즐",
    url: "parking-escape/index.html",
    thumb: "parking-escape/thumb.svg",
    color: "#ff4b5e",
    status: "play",
    meta: "30스테이지 · 3챕터",
    tags: ["퍼즐", "최소 수 계산"]
  },
  {
    id: "neon-merge",
    category: "arcade",
    title: "네온 머지",
    desc: "같은 숫자를 합쳐서 2048까지 키우는 물리 게임",
    url: "neon-merge/index.html",
    thumb: "neon-merge/thumb.svg",
    color: "#ff4fd2",
    status: "play",
    meta: "점수 경쟁 · 콤보",
    tags: ["아케이드", "물리", "효과음"]
  },
  {
    id: "neon-bubble",
    category: "arcade",
    title: "네온 버블",
    desc: "조준해서 쏘고 같은 색 3개를 붙여 터뜨리는 버블 슈터",
    url: "neon-bubble/index.html",
    thumb: "neon-bubble/thumb.svg",
    color: "#43f0ff",
    status: "play",
    meta: "무한 모드 · 콤보",
    tags: ["아케이드", "버블 슈터"]
  },
  {
    id: "neon-stack",
    category: "arcade",
    title: "네온 스택",
    desc: "위에서 떨어지는 블록을 타이밍 맞춰 높이 쌓는 게임",
    url: "neon-stack/index.html",
    thumb: "neon-stack/thumb.svg",
    color: "#ff4fd2",
    status: "play",
    meta: "무한 모드 · 퍼펙트",
    tags: ["아케이드", "타이밍"]
  },
  {
    id: "color-sort",
    category: "puzzle",
    title: "색 정렬 튜브",
    desc: "튜브를 탭해서 색 구슬을 옮겨 한 가지 색씩 맞추는 퍼즐",
    url: "color-sort/index.html",
    thumb: "color-sort/thumb.svg",
    color: "#43f0ff",
    status: "play",
    meta: "30스테이지 · 3챕터",
    tags: ["퍼즐", "최소 수 검증"]
  },
  {
    id: "orbit-jump",
    category: "arcade",
    title: "궤도 점프",
    desc: "행성을 도는 공을 탭 한 번으로 날려 다음 궤도에 올라타는 게임",
    url: "orbit-jump/index.html",
    thumb: "orbit-jump/thumb.svg",
    color: "#43f0ff",
    status: "play",
    meta: "무한 모드 · 정확 콤보",
    tags: ["아케이드", "우주"]
  },
  {
    id: "one-stroke",
    category: "puzzle",
    title: "한붓그리기",
    desc: "모든 선을 한 번씩만 지나가게 손가락으로 그리는 퍼즐",
    url: "one-stroke/index.html",
    thumb: "one-stroke/thumb.svg",
    color: "#ff4fd2",
    status: "play",
    meta: "30스테이지 · 3챕터",
    tags: ["퍼즐", "드래그"]
  },
  {
    id: "neon-2048",
    category: "puzzle",
    title: "네온 2048",
    desc: "밀어서 같은 숫자를 합치는 2048, 별 타일과 끝없는 목표",
    url: "neon-2048/index.html",
    thumb: "neon-2048/thumb.svg",
    color: "#ffc44d",
    status: "play",
    meta: "무한 모드 · 되돌리기",
    tags: ["퍼즐", "스와이프"]
  },
  {
    id: "neon-blocks",
    category: "puzzle",
    title: "네온 블록 채우기",
    desc: "조각을 판에 끌어다 놓고 한 줄을 채우면 사라지는 블록 퍼즐",
    url: "neon-blocks/index.html",
    thumb: "neon-blocks/thumb.svg",
    color: "#43f0ff",
    status: "soon",
    meta: "끝없는 점수 도전",
    tags: ["퍼즐", "드래그"]
  },
  {
    id: "box-push",
    category: "puzzle",
    title: "상자 밀기",
    desc: "상자를 밀어 표시된 자리에 넣는 퍼즐",
    url: "box-push/index.html",
    thumb: "box-push/thumb.svg",
    color: "#ffc44d",
    status: "soon",
    meta: "30스테이지 · 3챕터",
    tags: ["퍼즐", "스와이프"]
  },
  {
    id: "neon-golf",
    category: "arcade",
    title: "네온 미니골프",
    desc: "공을 당겼다 놓아 벽에 튕기며 홀에 넣는 미니골프",
    url: "neon-golf/index.html",
    thumb: "neon-golf/thumb.svg",
    color: "#5dffa0",
    status: "soon",
    meta: "30홀",
    tags: ["아케이드", "드래그"]
  },
  {
    id: "neon-mandala",
    category: "relax",
    title: "네온 만다라",
    desc: "한 번 그으면 6방향으로 대칭 그림이 그려지는 그림판",
    url: "neon-mandala/index.html",
    thumb: "neon-mandala/thumb.svg",
    color: "#ff4fd2",
    status: "play",
    meta: "점수 없이 그리기",
    tags: ["편하게 놀기", "드래그"]
  }
];
