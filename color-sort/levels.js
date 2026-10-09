// 자동 생성 파일: node tools/gen-color-sort.js
// tubes: 튜브마다 아래→위 색 글자(A~G), 빈 문자열은 빈 튜브. min: 검증된 최소 이동 수
window.SORT_LEVELS = [
  {"tubes":["BCBA","CAAB","CBAC","",""],"min":9},
  {"tubes":["ACBA","BCCB","ACAB","",""],"min":10},
  {"tubes":["CAAC","BCDD","BBAD","DCAB","",""],"min":11},
  {"tubes":["ABDA","DCBB","ACCD","DABC","",""],"min":12},
  {"tubes":["CABA","BBCA","CCBA","",""],"min":8},
  {"tubes":["DBAA","CBDC","BDCA","DBAC","",""],"min":13},
  {"tubes":["DBCA","CDAC","ADBD","ABCB","",""],"min":14},
  {"tubes":["DEAE","BCAC","ADDE","CEAB","BCBD","",""],"min":15},
  {"tubes":["DEBD","ACEC","CAAE","CBDB","AEBD","",""],"min":16},
  {"tubes":["CDEB","ADBC","EDAC","DBAE","BCEA","",""],"min":17},
  {"tubes":["CAEC","BBDE","AEAE","DBAB","DCDC","",""],"min":16},
  {"tubes":["FAAB","ADED","BEEC","ECBD","BDCF","ACFF","",""],"min":17},
  {"tubes":["FCAA","ECFB","ABDE","DBCD","DFBC","AFEE","",""],"min":18},
  {"tubes":["EDAB","CBEA","AFDD","BFCA","BECE","FDCF","",""],"min":19},
  {"tubes":["BCDB","EADA","CEBA","BDEE","CCAD","",""],"min":15},
  {"tubes":["BDAB","FAFA","DACF","DECB","FEBC","DCEE","",""],"min":20},
  {"tubes":["GAEC","BGGC","ABFA","GFCF","EEBD","BCAE","DFDD","",""],"min":21},
  {"tubes":["CACB","GBBF","EGAA","CEDG","DFBC","EFGA","DFED","",""],"min":22},
  {"tubes":["CBAE","DEBE","DCFF","EGBG","AFDC","AGCB","ADFG","",""],"min":23},
  {"tubes":["EDBC","BFEA","GACB","BADF","ECAG","GEFC","GFDD","",""],"min":24},
  {"tubes":["BABC","CABB","ACCA",""],"min":8},
  {"tubes":["CAAC","ABCB","DDBC","BDDA",""],"min":10},
  {"tubes":["BCDB","CBBC","DDCA","AADA",""],"min":11},
  {"tubes":["ABDC","DCBD","AACB","BDCA",""],"min":12},
  {"tubes":["BBCB","CACC","ABAA",""],"min":7},
  {"tubes":["BCDC","ACAD","EBBA","ABEE","CEDD",""],"min":13},
  {"tubes":["DBAC","AADA","BECD","BEBE","EDCC",""],"min":14},
  {"tubes":["ABDE","AECE","CCAE","ADCB","DBBD",""],"min":15},
  {"tubes":["AAEC","ACDE","BDFB","CEEA","BFBD","DCFF",""],"min":17},
  {"tubes":["EDFE","FFDC","ACAB","FCBD","ACEA","DEBB",""],"min":19}
];
// 힌트용 풀이 함수 (생성기와 같은 코드)
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
}
