// 확대된 상태에서 "원래 크기로" 버튼을 띄워서 한 번에 전체 화면으로 돌아가게 해요.
// iOS는 페이지에서 확대 배율을 직접 바꿀 수 없어서, viewport의 maximum-scale을 잠깐 1로 바꿨다가 되돌리는 방식을 써요.
(() => {
  const vv = window.visualViewport;
  const meta = document.querySelector('meta[name="viewport"]');
  if (!vv || !meta) return;
  const base = meta.getAttribute('content');

  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = '원래 크기로';
  b.style.cssText = [
    'position:absolute', 'left:0', 'top:0', 'z-index:9999', 'transform-origin:0 0',
    'font:600 15px "IBM Plex Sans KR",system-ui,sans-serif', 'color:#041016', 'background:#43f0ff',
    'border:0', 'border-radius:999px', 'padding:11px 18px', 'box-shadow:0 6px 24px rgba(0,0,0,.55)',
    'touch-action:manipulation', 'display:none', 'cursor:pointer'
  ].join(';');

  function place() {
    const zoomed = vv.scale > 1.05;
    b.style.display = zoomed ? 'block' : 'none';
    if (!zoomed) return;
    const s = 1 / vv.scale;
    const x = vv.pageLeft + vv.width - (b.offsetWidth + 14) * s;
    const y = vv.pageTop + vv.height - (b.offsetHeight + 28) * s;
    b.style.transform = `translate(${x}px,${y}px) scale(${s})`;
  }

  b.addEventListener('click', () => {
    meta.setAttribute('content', base + ', maximum-scale=1');
    setTimeout(() => { meta.setAttribute('content', base); place(); }, 350);
  });

  document.body.appendChild(b);
  vv.addEventListener('resize', place);
  vv.addEventListener('scroll', place);
  place();
})();
