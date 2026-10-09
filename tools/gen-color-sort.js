// 색 정렬 튜브 스테이지 생성기 (node tools/gen-color-sort.js)
// 1) 색 구슬을 무작위로 섞어 튜브에 담고
// 2) 갈 수 있는 모든 상태를 넓이 우선 탐색(BFS)해서 깰 수 있는지, 최소 몇 번에 깨는지 구한 뒤
// 3) 목표 최소 이동 수와 정확히 맞는 판을 고른다.
// 결과는 color-sort/levels.js 로 저장된다. 같은 풀이 함수(SOLVER_SRC)를 게임 페이지의 힌트도 쓴다.
const fs = require('fs'), path = require('path');

const SOLVER_SRC = `
const CAP=4;
function canMove(t,i,j){
  if(i===j)return false;const a=t[i],b=t[j];
  if(!a.length||b.length>=CAP)return false;
  const c=a[a.length-1];if(b.length&&b[b.length-1]!==c)return false;
  if(!b.length&&[...a].every(x=>x===c))return false;   // a one-color tube into an empty tube changes nothing
  return true;
}
function doMove(t,i,j){const n=t.slice();let a=n[i],b=n[j];const c=a[a.length-1];while(a.length&&a[a.length-1]===c&&b.length<CAP){a=a.slice(0,-1);b+=c}n[i]=a;n[j]=b;return n}
const sortKey=t=>t.slice().sort().join('|');
const isSolved=t=>t.every(x=>!x.length||(x.length===CAP&&[...x].every(c=>c===x[0])));
// shortest list of [from,to] moves; null = cannot be solved, undefined = too big to search
function solve(start,limit=1500000){
  if(isSolved(start))return[];
  const seen=new Set([sortKey(start)]);let frontier=[{t:start,path:null}],count=0;
  while(frontier.length){
    const next=[];
    for(const node of frontier){const t=node.t;
      for(let i=0;i<t.length;i++)for(let j=0;j<t.length;j++){
        if(!canMove(t,i,j))continue;
        const n=doMove(t,i,j),k=sortKey(n);if(seen.has(k))continue;
        const p={m:[i,j],prev:node.path};
        if(isSolved(n)){const out=[];for(let q=p;q;q=q.prev)out.unshift(q.m);return out}
        seen.add(k);next.push({t:n,path:p});if(++count>limit)return undefined;
      }}
    frontier=next;
  }
  return null;
}`;
eval(SOLVER_SRC.replace(/^const |\nconst /g, '\nvar '));

// 챕터별 [색 수, 빈 튜브 수, 목표 최소 이동] (5번째는 쉬어가는 판, 10번째가 챕터 최고점)
const PLAN = [
  { name: '첫 정리', empty: 2, colors: [3, 3, 4, 4, 3, 4, 4, 5, 5, 5], min: [9, 10, 11, 12, 8, 13, 14, 15, 16, 17] },
  { name: '일곱 빛깔', empty: 2, colors: [5, 6, 6, 6, 5, 6, 7, 7, 7, 7], min: [16, 17, 18, 19, 15, 20, 21, 22, 23, 24] },
  { name: '빈 튜브 하나', empty: 1, colors: [3, 4, 4, 4, 3, 5, 5, 5, 6, 6], min: [8, 10, 11, 12, 7, 13, 14, 15, 17, 19] },
];
const LETTERS = 'ABCDEFG';

function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }

function deal(R, nc, ne) {
  const balls = [];
  for (let c = 0; c < nc; c++) for (let k = 0; k < CAP; k++) balls.push(LETTERS[c]);
  for (let i = balls.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [balls[i], balls[j]] = [balls[j], balls[i]] }
  const t = [];
  for (let c = 0; c < nc; c++) t.push(balls.slice(c * CAP, c * CAP + CAP).join(''));
  for (let e = 0; e < ne; e++) t.push('');
  return t;
}
// skip boards that start too easy: a finished tube, or three of a kind already on top
const tooEasy = t => t.some(x => x.length === CAP && (isSolved([x]) || (x[1] === x[2] && x[2] === x[3])));

const levels = [], used = new Set();
let seed = 1;
PLAN.forEach((ch, ci) => {
  ch.colors.forEach((nc, k) => {
    const want = ch.min[k];
    let best = null;
    for (let tries = 0; tries < 6000; tries++) {
      const t = deal(mulberry(seed++), nc, ch.empty);
      if (tooEasy(t) || used.has(sortKey(t))) continue;
      const sol = solve(t);
      if (!sol) continue;
      const d = Math.abs(sol.length - want);
      if (!best || d < best.d) best = { t, min: sol.length, d };
      if (d === 0) break;
    }
    if (!best) throw new Error(`stage ${ci * 10 + k + 1}: no solvable board`);
    used.add(sortKey(best.t));
    levels.push({ tubes: best.t, min: best.min });
    console.log(`${String(ci * 10 + k + 1).padStart(2)}  ${ch.name}  색 ${nc} 빈 ${ch.empty}  최소 ${best.min}${best.d ? ` (목표 ${want})` : ''}`);
  });
});

const out = `// 자동 생성 파일: node tools/gen-color-sort.js
// tubes: 튜브마다 아래→위 색 글자(A~G), 빈 문자열은 빈 튜브. min: 검증된 최소 이동 수
window.SORT_LEVELS = [
${levels.map(l => '  ' + JSON.stringify(l)).join(',\n')}
];
// 힌트용 풀이 함수 (생성기와 같은 코드)
${SOLVER_SRC.trim()}
`;
fs.writeFileSync(path.join(__dirname, '..', 'color-sort', 'levels.js'), out);
console.log('saved color-sort/levels.js');
