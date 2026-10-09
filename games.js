// 게임 목록 — 새 게임을 만들면 여기에 한 줄(객체 하나)만 추가하면 메인 화면에 카드가 생겨요.
// status: "play"(플레이 가능) | "proto"(프로토타입) | "soon"(준비 중)
window.GAMES = [
  {
    id: "laser-mirror",
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
    title: "네온 버블",
    desc: "조준해서 쏘고 같은 색 3개를 붙여 터뜨리는 버블 슈터",
    url: "neon-bubble/index.html",
    thumb: "neon-bubble/thumb.svg",
    color: "#43f0ff",
    status: "play",
    meta: "무한 모드 · 콤보",
    tags: ["아케이드", "버블 슈터"]
  }
];
