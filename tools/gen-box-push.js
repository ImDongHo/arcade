// 상자 밀기 스테이지 생성기 (node tools/gen-box-push.js)
// 1) 작은 방을 만들고 상자를 목표 자리에 놓은 뒤
// 2) 거꾸로 플레이(상자를 끌어당기며 돌아다니기)해서 섞는다 → 그래서 모든 판은 반드시 깰 수 있다.
// 3) 처음 상태에서 넓이 우선 탐색(BFS)으로 최소 이동 수를 정확히 구하고, 목표 구간에 맞는 판을 고른다.
// 결과는 box-push/levels.js 로 저장된다. 힌트도 같은 풀이 함수를 쓴다.
const fs=require('fs'),path=require('path');
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const D=[[0,-1],[1,0],[0,1],[-1,0]];

function room(R,w,h,wallP){
  for(let tries=0;tries<200;tries++){
    const g=[];for(let y=0;y<h;y++){const row=[];for(let x=0;x<w;x++)row.push(x===0||y===0||x===w-1||y===h-1||R()<wallP?1:0);g.push(row)}
    // floor must be one connected piece and big enough
    const fl=[];for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(!g[y][x])fl.push([x,y]);
    if(fl.length<8)continue;
    const seen=new Set([fl[0].join()]),q=[fl[0]];
    for(let i=0;i<q.length;i++)for(const[dx,dy]of D){const n=[q[i][0]+dx,q[i][1]+dy];if(!g[n[1]][n[0]]&&!seen.has(n.join())){seen.add(n.join());q.push(n)}}
    if(seen.size!==fl.length)continue;
    return{g,fl};
  }
  return null;
}
const key=(p,boxes)=>p+'|'+[...boxes].sort((a,b)=>a-b).join(',');
function solve(L,limit=400000){
  const{w,g,goals}=L,goalSet=new Set(goals);
  const wall=i=>g[i]===1;
  // a box pushed into a corner that is not a goal can never move again
  const dead=new Set();for(let i=0;i<g.length;i++){if(wall(i)||goalSet.has(i))continue;const u=wall(i-w),d=wall(i+w),l=wall(i-1),r=wall(i+1);if((u||d)&&(l||r))dead.add(i)}
  const start={p:L.player,b:L.boxes.slice()};
  const done=b=>b.every(x=>goalSet.has(x));
  if(done(start.b))return{moves:0,path:''};
  const seen=new Set([key(start.p,start.b)]);let front=[{p:start.p,b:start.b,path:''}],count=0;
  const off=[-w,1,w,-1],ch='URDL';
  while(front.length){
    const next=[];
    for(const s of front){
      for(let k=0;k<4;k++){
        const n=s.p+off[k];if(wall(n))continue;
        let b=s.b;const bi=b.indexOf(n);let pushed=false;
        if(bi>=0){const nn=n+off[k];if(wall(nn)||b.includes(nn)||dead.has(nn))continue;b=b.slice();b[bi]=nn;pushed=true}
        const kk=key(n,b);if(seen.has(kk))continue;seen.add(kk);
        const path=s.path+(pushed?ch[k]:ch[k].toLowerCase());
        if(pushed&&done(b))return{moves:path.length,pushes:[...path].filter(c=>c>='A'&&c<='Z').length,path};
        next.push({p:n,b,path});if(++count>limit)return undefined;
      }
    }
    front=next;
  }
  return null;
}
function make(R,{w,h,boxes,wallP,steps}){
  const r=room(R,w,h,wallP);if(!r)return null;
  const g=r.g.flat(),idx=([x,y])=>y*w+x;
  const fl=r.fl.map(idx).filter(i=>{const free=[1,w,-1,-w].filter(o=>!g[i+o]).length;return free>=2});
  if(fl.length<boxes+2)return null;
  const pick=()=>fl[Math.floor(R()*fl.length)];
  const goals=[];while(goals.length<boxes){const c=pick();if(!goals.includes(c))goals.push(c)}
  let b=goals.slice(),p;do p=pick();while(b.includes(p));
  // play backwards: walk around, and when a box is behind us, sometimes pull it along
  const off=[-w,1,w,-1];
  for(let s=0;s<steps;s++){
    const k=Math.floor(R()*4),n=p+off[k];if(g[n]||b.includes(n))continue;
    const behind=p-off[k],bi=b.indexOf(behind);
    if(bi>=0&&R()<.8){b=b.slice();b[bi]=p}
    p=n;
  }
  if(b.some(x=>goals.includes(x)))return null;
  const grid=[];for(let y=0;y<h;y++){let row='';for(let x=0;x<w;x++){const i=y*w+x;const gl=goals.includes(i),bx=b.includes(i),pl=i===p;row+=g[i]?'#':bx?(gl?'*':'$'):pl?(gl?'+':'@'):gl?'.':' '}grid.push(row)}
  return{map:grid,w,g,goals,boxes:b,player:p};
}
function parse(map){
  const h=map.length,w=Math.max(...map.map(r=>r.length));const g=[],goals=[],boxes=[];let player=0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const c=map[y][x]||' ',i=y*w+x;g.push(c==='#'?1:0);if('.*+'.includes(c))goals.push(i);if('$*'.includes(c))boxes.push(i);if('@+'.includes(c))player=i}
  return{w,g,goals,boxes,player};
}

// 챕터별 [방 가로, 세로, 상자 수, 벽 비율, 목표 최소 이동] (5번째는 쉬어가는 판, 10번째가 챕터 최고점)
const CH=[
  {name:'창고 입문',st:[[6,6,1,.08,6],[6,6,1,.1,8],[7,6,1,.1,10],[7,6,2,.08,12],[6,6,1,.1,7],[7,7,2,.1,14],[7,7,2,.12,16],[7,7,2,.12,18],[7,7,2,.14,20],[8,7,2,.14,22]]},
  {name:'좁은 통로',st:[[7,7,2,.14,20],[8,7,2,.14,24],[8,7,2,.16,26],[8,8,2,.16,28],[7,7,2,.12,18],[8,8,3,.12,30],[8,8,3,.14,34],[8,8,3,.14,36],[8,8,3,.16,40],[8,8,3,.16,44]]},
  {name:'큰 창고',st:[[8,8,3,.12,36],[8,8,3,.14,40],[9,8,3,.14,44],[9,8,3,.15,48],[8,8,2,.14,32],[9,9,3,.14,52],[9,9,3,.15,56],[9,9,3,.16,60],[9,9,4,.12,64],[9,9,4,.14,70]]},
];
const levels=[],used=new Set();let seed=11;
CH.forEach((ch,ci)=>ch.st.forEach(([w,h,boxes,wallP,want],k)=>{
  const P={w,h,boxes,wallP,steps:60+want*12};
  let got=null,near=null;
  // try at most 6000 rooms per stage; if none hits the target window, use the closest one found
  for(let t=0;t<6000&&!got;t++){
    const L=make(mulberry(seed++),P);if(!L)continue;
    const sig=L.map.join('/');if(used.has(sig))continue;
    const sol=solve(L,200000);if(!sol||sol.pushes<boxes*2)continue;
    const c={map:L.map,min:sol.moves,sig};
    if(sol.moves>=want&&sol.moves<=want+6)got=c;
    else if(!near||Math.abs(sol.moves-want)<Math.abs(near.min-want))near=c;
  }
  if(!got)got=near;if(!got)throw new Error('stage '+(ci*10+k+1));
  used.add(got.sig);levels.push({map:got.map,min:got.min});
  console.log(`${String(ci*10+k+1).padStart(2)}  ${ch.name}  상자 ${boxes}  최소 ${got.min}번 (목표 ${want}~${want+6})`);
}));
// 목표에 못 미친 판이 있어도 챕터 안에서는 점점 어려워지게: 5번째(쉬어가는 판)는 두고 나머지를 최소 수 순으로
const boxCount=l=>l.map.join('').split('').filter(c=>c==='$'||c==='*').length;
for(let c=0;c<levels.length;c+=10){
  const rest=levels.slice(c,c+10).filter((_,k)=>k!==4).sort((a,b)=>a.min-b.min||boxCount(a)-boxCount(b));
  rest.splice(4,0,levels[c+4]);levels.splice(c,10,...rest);
}
const SOLVER_SRC=`const key=(p,boxes)=>p+'|'+[...boxes].sort((a,b)=>a-b).join(',');
function solve(L,limit=400000){
  const{w,g,goals}=L,goalSet=new Set(goals);
  const wall=i=>g[i]===1;
  // a box pushed into a corner that is not a goal can never move again
  const dead=new Set();for(let i=0;i<g.length;i++){if(wall(i)||goalSet.has(i))continue;const u=wall(i-w),d=wall(i+w),l=wall(i-1),r=wall(i+1);if((u||d)&&(l||r))dead.add(i)}
  const start={p:L.player,b:L.boxes.slice()};
  const done=b=>b.every(x=>goalSet.has(x));
  if(done(start.b))return{moves:0,path:''};
  const seen=new Set([key(start.p,start.b)]);let front=[{p:start.p,b:start.b,path:''}],count=0;
  const off=[-w,1,w,-1],ch='URDL';
  while(front.length){
    const next=[];
    for(const s of front){
      for(let k=0;k<4;k++){
        const n=s.p+off[k];if(wall(n))continue;
        let b=s.b;const bi=b.indexOf(n);let pushed=false;
        if(bi>=0){const nn=n+off[k];if(wall(nn)||b.includes(nn)||dead.has(nn))continue;b=b.slice();b[bi]=nn;pushed=true}
        const kk=key(n,b);if(seen.has(kk))continue;seen.add(kk);
        const path=s.path+(pushed?ch[k]:ch[k].toLowerCase());
        if(pushed&&done(b))return{moves:path.length,pushes:[...path].filter(c=>c>='A'&&c<='Z').length,path};
        next.push({p:n,b,path});if(++count>limit)return undefined;
      }
    }
    front=next;
  }
  return null;
}
function parse(map){
  const h=map.length,w=Math.max(...map.map(r=>r.length));const g=[],goals=[],boxes=[];let player=0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const c=map[y][x]||' ',i=y*w+x;g.push(c==='#'?1:0);if('.*+'.includes(c))goals.push(i);if('$*'.includes(c))boxes.push(i);if('@+'.includes(c))player=i}
  return{w,g,goals,boxes,player};
}
`;
fs.writeFileSync(path.join(__dirname,'..','box-push','levels.js'),`// 자동 생성 파일: node tools/gen-box-push.js
// map: # 벽, . 목표, $ 상자, * 목표 위 상자, @ 플레이어, + 목표 위 플레이어 / min: 검증된 최소 이동 수
window.BOX_LEVELS = [
${levels.map(l=>'  '+JSON.stringify(l)).join(',\n')}
];
// 힌트용 풀이 함수 (생성기와 같은 코드)
${SOLVER_SRC}`);
console.log('saved box-push/levels.js');
