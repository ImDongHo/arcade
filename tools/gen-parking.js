// 주차장 탈출 스테이지 생성기 (node tools/gen-parking.js)
// 1) 무작위로 차/트럭/벽을 배치하고
// 2) 그 배치에서 갈 수 있는 모든 상태를 탐색한 뒤
// 3) 탈출 상태에서 거꾸로 거리를 재서(역방향 BFS) 목표 최소 수에 맞는 시작 상태를 고른다.
// 결과는 parking-escape/levels.js 로 저장된다.
const fs = require('fs'), path = require('path');
const N = 6, EXIT = 4; // 빨간 차(길이 2)가 x=4 에 오면 탈출

// 챕터별 목표 최소 이동 수 (5번째는 쉬어가는 판, 10번째가 챕터 최고점)
const TARGETS = [
  [4, 5, 6, 7, 5, 8, 9, 10, 11, 13],
  [10, 11, 12, 14, 10, 15, 16, 17, 18, 20],
  [14, 16, 17, 19, 15, 20, 22, 23, 25, 28],
];
const CHAPTER_RULES = [
  { cars: [7, 10], truck: 0.2, walls: [0, 0] },
  { cars: [9, 12], truck: 0.35, walls: [0, 0] },
  { cars: [8, 12], truck: 0.3, walls: [1, 2] },
];

function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }

function occ(cars, walls, pos) {
  const g = new Int8Array(36).fill(-1);
  for (const w of walls) g[w] = 99;
  for (let i = 0; i < cars.length; i++) { const c = cars[i]; for (let k = 0; k < c.len; k++) { const x = c.h ? pos[i] + k : c.fixed, y = c.h ? c.fixed : pos[i] + k; g[y * 6 + x] = i } }
  return g;
}
function neighbors(cars, walls, s, out) {
  out.length = 0;
  const g = occ(cars, walls, s);
  for (let i = 0; i < cars.length; i++) {
    const c = cars[i];
    for (const d of [-1, 1]) {
      let p = s[i];
      for (;;) {
        p += d; const cell = d < 0 ? p : p + c.len - 1; if (cell < 0 || cell > 5) break;
        const x = c.h ? cell : c.fixed, y = c.h ? c.fixed : cell; if (g[y * 6 + x] !== -1) break;
        const ns = s.slice(); ns[i] = p; out.push(ns);
      }
    }
  }
  return out;
}

// 배치 하나의 연결된 상태 공간 전체를 탐색하고, 각 상태의 "탈출까지 최소 수"를 계산
function analyze(cars, walls, start, limit = 120000) {
  const idx = new Map(), states = [];
  const key = s => s.join(',');
  idx.set(key(start), 0); states.push(start);
  const buf = [];
  for (let q = 0; q < states.length; q++) {
    for (const ns of neighbors(cars, walls, states[q], buf)) { const k = key(ns); if (!idx.has(k)) { idx.set(k, states.length); states.push(ns); if (states.length > limit) return null } }
  }
  const dist = new Int16Array(states.length).fill(-1);
  let frontier = [];
  states.forEach((s, i) => { if (s[0] === EXIT) { dist[i] = 0; frontier.push(i) } });
  if (!frontier.length) return null;
  let d = 0;
  while (frontier.length) {
    d++; const nf = [];
    for (const i of frontier) for (const ns of neighbors(cars, walls, states[i], buf)) { const j = idx.get(key(ns)); if (dist[j] < 0) { dist[j] = d; nf.push(j) } }
    frontier = nf;
  }
  return { states, dist, max: d - 1 };
}

function randomBoard(R, rule) {
  const ri = n => Math.floor(R() * n), rr = ([a, b]) => a + ri(b - a + 1);
  const g = new Uint8Array(36), cars = [{ h: true, len: 2, fixed: 2 }], pos = [ri(3)];
  g[12 + pos[0]] = g[13 + pos[0]] = 1;
  const walls = [];
  const nW = rr(rule.walls);
  for (let t = 0; t < 40 && walls.length < nW; t++) { const c = ri(36); if (g[c] || Math.floor(c / 6) === 2) continue; g[c] = 1; walls.push(c) }
  const n = rr(rule.cars);
  for (let t = 0; t < 200 && cars.length < n + 1; t++) {
    const h = R() < .5, len = R() < rule.truck ? 3 : 2; let x, y;
    if (h) { y = ri(6); if (y === 2) continue; x = ri(7 - len) } else { x = ri(6); y = ri(7 - len) }
    let free = true; for (let k = 0; k < len; k++) if (g[(h ? y : y + k) * 6 + (h ? x + k : x)]) { free = false; break }
    if (!free) continue;
    for (let k = 0; k < len; k++) g[(h ? y : y + k) * 6 + (h ? x + k : x)] = 1;
    cars.push({ h, len, fixed: h ? y : x }); pos.push(h ? x : y);
  }
  return { cars, walls, pos };
}

// 레벨을 36글자 문자열로: o=빈칸, x=벽, A=빨간 차, B.. 다른 차
function encode(cars, walls, pos) {
  const b = Array(36).fill('o'); for (const w of walls) b[w] = 'x';
  cars.forEach((c, i) => { for (let k = 0; k < c.len; k++) { const x = c.h ? pos[i] + k : c.fixed, y = c.h ? c.fixed : pos[i] + k; b[y * 6 + x] = String.fromCharCode(65 + i) } });
  return b.join('');
}

const levels = [];
const t0 = Date.now();
for (let ch = 0; ch < 3; ch++) {
  for (let k = 0; k < 10; k++) {
    const stage = ch * 10 + k + 1, T = TARGETS[ch][k];
    let pick = null, tries = 0;
    for (let a = 0; a < 4000 && !pick; a++) {
      tries++;
      const R = mulberry(stage * 99991 + a * 7919 + 13);
      const { cars, walls, pos } = randomBoard(R, CHAPTER_RULES[ch]);
      const res = analyze(cars, walls, pos);
      if (!res || res.max < T) continue;
      // 목표 거리인 상태들 중 무작위 하나 (빨간 차가 출구 바로 앞이 아닌 것)
      const cands = [];
      res.dist.forEach((d, i) => { if (d === T && res.states[i][0] <= 2) cands.push(i) });
      if (!cands.length) continue;
      const s = res.states[cands[Math.floor(R() * cands.length)]];
      pick = { board: encode(cars, walls, s), min: T, cars: cars.length, walls: walls.length, space: res.states.length, tries };
    }
    if (!pick) throw new Error('stage ' + stage + ' failed');
    levels.push(pick);
    console.log(`stage ${String(stage).padStart(2)}  min ${String(pick.min).padStart(2)}  cars ${pick.cars}  walls ${pick.walls}  states ${pick.space}  tries ${pick.tries}`);
  }
}
console.log('total', Date.now() - t0, 'ms');
const out = '// 자동 생성 파일: node tools/gen-parking.js\n// board: 6x6 36글자 (o 빈칸, x 벽, A 빨간 차, B~ 다른 차), min: 검증된 최소 이동 수\nwindow.PARKING_LEVELS = ' +
  JSON.stringify(levels.map(l => ({ board: l.board, min: l.min })), null, 0).replace(/\},\{/g, '},\n  {').replace('[{', '[\n  {').replace('}]', '}\n]') + ';\n';
fs.writeFileSync(path.join(__dirname, '..', 'parking-escape', 'levels.js'), out);
