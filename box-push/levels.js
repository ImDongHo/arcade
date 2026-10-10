// 자동 생성 파일: node tools/gen-box-push.js
// map: # 벽, . 목표, $ 상자, * 목표 위 상자, @ 플레이어, + 목표 위 플레이어 / min: 검증된 최소 이동 수
window.BOX_LEVELS = [
  {"map":["######","# .  #","# @$ #","##   #","##   #","######"],"min":6},
  {"map":["######","#   +#","#  $ #","#   ##","#    #","######"],"min":9},
  {"map":["#######","#  . @#","# $#  #","#   # #","#  #  #","#######"],"min":11},
  {"map":["#######","# @.$ #","# $   #","#    ##","#   . #","#######"],"min":12},
  {"map":["######","##   #","# $ ##","#    #","#@ . #","######"],"min":7},
  {"map":["#######","#     #","#   #$#","# $@ .#","#     #","#  .  #","#######"],"min":15},
  {"map":["#######","#    ##","#.  $ #","# $#  #","#    .#","#@   ##","#######"],"min":16},
  {"map":["#######","# #  ##","#  $ ##","# # @.#","# $.  #","#   # #","#######"],"min":18},
  {"map":["#######","# .   #","# # $.#","#@ #  #","### $ #","#     #","#######"],"min":24},
  {"map":["########","#@  #  #","#   $$ #","#.     #","#      #","#   .  #","########"],"min":25},
  {"map":["#######","#     #","# $##$#","#     #","#  . .#","#   #@#","#######"],"min":22},
  {"map":["########","#   @. #","# $#  ##","#     .#","# $#   #","#   #  #","########"],"min":24},
  {"map":["########","#   #  #","#      #","#. # $ #","# $    #","# # # +#","########"],"min":26},
  {"map":["########","#@     #","# $##  #","# $ . ##","# # #  #","##.    #","#   #  #","########"],"min":30},
  {"map":["#######","# ##  #","#   $ #","#.    #","#@  $ #","#  .  #","#######"],"min":20},
  {"map":["########","#  #  .#","#    #$#","#. @## #","#  #   #","#$# $. #","#      #","########"],"min":30},
  {"map":["########","#     ##","# $ #$ #","# #    #","#@..$# #","# .   ##","#      #","########"],"min":35},
  {"map":["########","#@   # #","#    $.#","# $# . #","##   . #","#  $#  #","#      #","########"],"min":38},
  {"map":["########","#   ## #","#    $ #","#  . # #","#  .   #","# $# $##","#   . @#","########"],"min":40},
  {"map":["########","###    #","# $$#  #","#@#   .#","#  .  .#","#  $   #","####   #","########"],"min":42},
  {"map":["########","# @#   #","# $ .# #","#. # # #","# .#   #","## $ $ #","#      #","########"],"min":38},
  {"map":["########","# #  . #","#    $##","# $ #  #","#   # ##","# $  .##","#@ # . #","########"],"min":40},
  {"map":["#########","# @ #  .#","## $ $$ #","#  #    #","## .  # #","##      #","###    .#","#########"],"min":42},
  {"map":["#########","#@$ .  .#","# $ #   #","#  .##  #","#.  #   #","#  #  # #","#$### $ #","#       #","#########"],"min":44},
  {"map":["########","#  $+. #","# #    #","# #  # #","#  # # #","#  $ # #","#     ##","########"],"min":31},
  {"map":["#########","#    ## #","# $#    #","#   #   #","##$## $ #","#   .#  #","#    #. #","##+     #","#########"],"min":45},
  {"map":["#########","#      .#","#     $ #","#    ####","##      #","#   @#  #","#  $ $  #","# # .. ##","#########"],"min":46},
  {"map":["#########","#   #   #","#  # ...#","#   #   #","# $  # $#","##  #   #","#    $$##","#.  #@  #","#########"],"min":46},
  {"map":["#########","#  @    #","# ##   .#","#   #   #","##$#    #","# $ $ . #","#  .   ##","#########"],"min":48},
  {"map":["#########","#@     ##","#       #","#       #","### .   #","#    #  #","# $$ # .#","#    .$ #","#########"],"min":48}
];
// 힌트용 풀이 함수 (생성기와 같은 코드)
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
function parse(map){
  const h=map.length,w=Math.max(...map.map(r=>r.length));const g=[],goals=[],boxes=[];let player=0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const c=map[y][x]||' ',i=y*w+x;g.push(c==='#'?1:0);if('.*+'.includes(c))goals.push(i);if('$*'.includes(c))boxes.push(i);if('@+'.includes(c))player=i}
  return{w,g,goals,boxes,player};
}
