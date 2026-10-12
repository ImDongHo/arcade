// PC 키보드: 결과 화면(판 끝, 스테이지 깸, 게임 오버)이 떠 있을 때 Enter나 스페이스를 누르면
// 그 화면의 강조 버튼(다음 스테이지 / 다시 시작 / 새 게임 등)을 누른 것처럼 동작해요.
// 결과 화면이 없을 때는 아무것도 하지 않아요. 마우스가 있는 기기에서만 안내 문구를 붙여요.
(() => {
  const OVERLAYS = '.banner, .end, .cele';
  const shown = el => !el.hidden && el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden';
  function target() {
    // the last visible overlay wins (e.g. a celebration on top of the board)
    const list = [...document.querySelectorAll(OVERLAYS)].filter(shown);
    for (let i = list.length - 1; i >= 0; i--) {
      const b = [...list[i].querySelectorAll('.btn.primary')].find(x => !x.disabled && shown(x));
      if (b) return b;
    }
    return null;
  }
  addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
    const t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    const b = target();
    if (!b) return;
    e.preventDefault();   // keep the key from also pressing whatever button has focus
    b.click();
  });
  function addHints() {
    if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    document.querySelectorAll(OVERLAYS).forEach(o => {
      const b = o.querySelector('.btn.primary');
      if (!b || o.querySelector('.enter-hint')) return;
      const h = document.createElement('div');
      h.className = 'enter-hint';
      h.textContent = 'Enter / 스페이스로 ' + b.textContent.trim();
      h.style.cssText = 'font:500 12px "IBM Plex Sans KR",system-ui,sans-serif;color:#8b93ad;margin-top:2px;text-align:center';
      (b.parentElement === o ? b : b.parentElement).after(h);
    });
  }
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', addHints); else addHints();
})();
