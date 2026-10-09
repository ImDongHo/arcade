// 한붓그리기 스테이지 생성기 (node tools/gen-one-stroke.js)
// 1) 격자 위에서 선이 겹치지 않게 무작위로 걸어간 길을 그림으로 삼는다 → 그 길 자체가 정답이라 언제나 한 번에 그릴 수 있다.
// 2) 한 점에서 갈라지는 선은 25도 이상 벌어지게 해서 그림이 헷갈리지 않게 한다.
// 3) 아무렇게나(앞을 내다보지 않고) 그리는 사람이 성공하는 비율로 난이도를 재고, 목표 구간에 맞는 그림을 고른다.
// 4) 마지막으로 모든 선을 한 번씩 지나는 길이 실제로 있는지 따로 검증한다.
// 결과는 one-stroke/levels.js 로 저장된다.
const fs = require('fs'), path = require('path');

function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }
const STEPS = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
const KNIGHT = [[2, 1], [1, 2], [-2, 1], [-1, 2], [2, -1], [1, -2], [-2, -1], [-1, -2]];
const same = (p, q) => p[0] === q[0] && p[1] === q[1];
const key = p => p[0] + ',' + p[1];

// segments ab and cd cross (sharing an endpoint is fine; overlapping on one line is not)
function cross(a, b, c, d) {
  const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
  const o1 = o(a, b, c), o2 = o(a, b, d), o3 = o(c, d, a), o4 = o(c, d, b);
  if (o1 === 0 && o2 === 0) {
    const on = (p, q, r) => Math.min(p[0], q[0]) <= r[0] && r[0] <= Math.max(p[0], q[0]) && Math.min(p[1], q[1]) <= r[1] && r[1] <= Math.max(p[1], q[1]);
    return [[c, a, b], [d, a, b], [a, c, d], [b, c, d]].some(([r, p, q]) => on(p, q, r) && !same(r, p) && !same(r, q));
  }
  if ([a, b].some(p => [c, d].some(q => same(p, q)))) return false;
  return o1 !== o2 && o3 !== o4;
}
const ang = (p, q) => Math.atan2(q[1] - p[1], q[0] - p[0]);
function tooClose(edges, p, q) {
  return edges.some(e => {
    const o = same(e[0], p) ? e[1] : same(e[1], p) ? e[0] : null; if (!o) return false;
    let d = Math.abs(ang(p, o) - ang(p, q)); if (d > Math.PI) d = 2 * Math.PI - d;
    return d < 25 * Math.PI / 180;
  });
}
function walk(R, len, knight, cols, rows) {
  let cur = [Math.floor(R() * cols), Math.floor(R() * rows)];
  const edges = [], used = new Set(), seen = new Set([key(cur)]);
  for (let step = 0; step < len; step++) {
    const cands = [];
    for (const [dx, dy] of knight ? STEPS.concat(KNIGHT) : STEPS) {
      const n = [cur[0] + dx, cur[1] + dy];
      if (n[0] < 0 || n[1] < 0 || n[0] >= cols || n[1] >= rows) continue;
      const k = [key(cur), key(n)].sort().join('|'); if (used.has(k)) continue;
      if (edges.some(e => cross(e[0], e[1], cur, n))) continue;
      if (tooClose(edges, cur, n) || tooClose(edges, n, cur)) continue;
      let w = seen.has(key(n)) ? 2.2 : 1; if (Math.abs(dx) + Math.abs(dy) === 3) w *= .5;
      cands.push({ n, k, w });
    }
    if (!cands.length) return null;
    let t = R() * cands.reduce((s, c) => s + c.w, 0), pick = cands[0];
    for (const c of cands) { t -= c.w; if (t <= 0) { pick = c; break } }
    edges.push([cur, pick.n]); used.add(pick.k); seen.add(key(pick.n)); cur = pick.n;
  }
  return edges;
}
function toLevel(edges) {
  const ks = [...new Set(edges.flat().map(key))];
  const nodes = ks.map(k => k.split(',').map(Number)).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  const ix = p => nodes.findIndex(q => same(p, q));
  return { nodes, edges: edges.map(([a, b]) => [ix(a), ix(b)]) };
}
function rate(L, R, tries = 500) {
  const deg = L.nodes.map(() => 0); L.edges.forEach(([a, b]) => { deg[a]++; deg[b]++ });
  const odd = deg.map((d, i) => d % 2 ? i : -1).filter(i => i >= 0), starts = odd.length ? odd : L.nodes.map((_, i) => i);
  let ok = 0;
  for (let t = 0; t < tries; t++) {
    let cur = starts[Math.floor(R() * starts.length)], n = 0; const used = new Array(L.edges.length).fill(false);
    for (;;) {
      const opts = []; L.edges.forEach((e, i) => { if (!used[i] && (e[0] === cur || e[1] === cur)) opts.push(i) }); if (!opts.length) break;
      const i = opts[Math.floor(R() * opts.length)]; used[i] = true; n++; cur = L.edges[i][0] === cur ? L.edges[i][1] : L.edges[i][0];
    }
    if (n === L.edges.length) ok++;
  }
  return { rate: ok / tries, branch: deg.filter(d => d >= 3).length };
}
// independent check: depth-first search for a path that uses every line once
function solvable(L) {
  const all = (1 << L.edges.length) - 1, memo = new Map();
  const go = (c, m) => { if (m === all) return true; const k = c + ':' + m; if (memo.has(k)) return memo.get(k); let ok = false;
    for (let i = 0; i < L.edges.length && !ok; i++) { if (m & (1 << i)) continue; const e = L.edges[i]; if (e[0] !== c && e[1] !== c) continue; ok = go(e[0] === c ? e[1] : e[0], m | (1 << i)) }
    memo.set(k, ok); return ok };
  return L.nodes.some((_, s) => go(s, 0));
}

// 챕터별 [선 수, 성공률 구간] (5번째는 쉬어가는 판, 10번째가 챕터 최고점)
const PLAN = [
  { name: '첫 선', knight: false, cols: 5, rows: 6, stages: [[6, .6, .9], [7, .5, .8], [8, .45, .7], [9, .38, .6], [7, .6, .9], [10, .3, .5], [11, .26, .45], [12, .22, .4], [13, .18, .34], [14, .14, .28]] },
  { name: '별자리', knight: true, cols: 5, rows: 6, stages: [[11, .3, .5], [12, .26, .45], [13, .22, .4], [14, .18, .34], [11, .35, .6], [15, .15, .3], [16, .12, .26], [17, .1, .22], [18, .08, .18], [19, .06, .15]] },
  { name: '큰 그림', knight: true, cols: 6, rows: 7, stages: [[16, .14, .3], [17, .12, .26], [18, .1, .22], [19, .08, .18], [15, .2, .4], [20, .06, .15], [21, .05, .13], [22, .04, .11], [23, .03, .09], [24, .02, .08]] },
];
if (require.main === module) {
  const levels = [], usedShapes = new Set(); let seed = 101;
  PLAN.forEach((ch, ci) => ch.stages.forEach(([len, lo, hi], k) => {
    let got = null;
    for (let t = 0; t < 60000 && !got; t++) {
      const e = walk(mulberry(seed++), len, ch.knight, ch.cols, ch.rows); if (!e) continue;
      const L = toLevel(e), sig = JSON.stringify(L); if (usedShapes.has(sig)) continue;
      const r = rate(L, mulberry(seed * 13));
      if (r.rate >= lo && r.rate <= hi && r.branch >= Math.min(5, 1 + Math.floor(len / 5)) && solvable(L)) { got = L; usedShapes.add(sig); console.log(`${String(ci * 10 + k + 1).padStart(2)}  ${ch.name}  선 ${len}  점 ${L.nodes.length}  아무렇게나 그려서 성공 ${(r.rate * 100).toFixed(0)}%`) }
    }
    if (!got) throw new Error(`stage ${ci * 10 + k + 1}: no drawing found`);
    levels.push(got);
  }));
  const out = `// 자동 생성 파일: node tools/gen-one-stroke.js
// nodes: 격자 좌표 [x,y], edges: 이을 선 [점 번호, 점 번호]. 모든 그림은 한 번에 그릴 수 있는지 검증했다.
window.STROKE_LEVELS = [
${levels.map(l => '  ' + JSON.stringify(l)).join(',\n')}
];
`;
  fs.writeFileSync(path.join(__dirname, '..', 'one-stroke', 'levels.js'), out);
  console.log('saved one-stroke/levels.js');
}
