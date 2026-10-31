// Helpers available to rendered rules as `h`. This function is serialized and
// re-created inside the browser, so it must be self-contained (no imports, no
// outer variables).

export function createHelpers() {
  const h = {
    // Visible elements matching a selector (anywhere in the page, incl. dialogs).
    all(selector) {
      return [...document.querySelectorAll(selector)].filter((el) => h.visible(el));
    },

    visible(el) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return false;
      const s = getComputedStyle(el);
      return s.visibility !== 'hidden' && s.display !== 'none';
    },

    // True when the element or an ancestor is fully transparent.
    transparent(el) {
      for (let n = el; n && n !== document.body; n = n.parentElement) {
        if (getComputedStyle(n).opacity === '0') return true;
      }
      return false;
    },

    rect(el) {
      return el.getBoundingClientRect();
    },

    px(value) {
      return parseFloat(value) || 0;
    },

    round(n) {
      return Math.round(n * 10) / 10;
    },

    // Short human label used in messages: Button "Pay now"
    describe(el) {
      // last root class is the most specific: "MuiButtonBase-root MuiButton-root" -> Button
      const mui = [...el.classList].filter((c) => /^Mui[A-Za-z]+-root$/.test(c)).pop();
      const kind = mui ? mui.slice(3, -5) : `<${el.tagName.toLowerCase()}>`;
      const text = (el.innerText || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 30);
      return text ? `${kind} "${text}"` : kind;
    },

    // Elements that render their own text (have a non-empty direct text node).
    textElements() {
      return [...document.body.querySelectorAll('*')].filter(
        (el) =>
          !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName) &&
          [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()) &&
          h.visible(el) &&
          !h.transparent(el),
      );
    },

    interactiveElements() {
      const selector = 'button, a[href], input:not([type=hidden]), select, textarea, [role=button], [role=switch], [role=checkbox], [role=radio], [role=tab], [role=menuitem], [role=option], [role=slider]';
      return h.all(selector);
    },

    windowClass(m3) {
      const w = window.innerWidth;
      return m3.windowClasses.find((c) => c.maxWidth === null || w <= c.maxWidth);
    },

    // Groups of horizontally adjacent buttons: same row, closer than the
    // adjacency threshold. Each group is sorted left to right.
    buttonGroups(m3) {
      const items = h.all('.MuiButton-root').map((el) => ({ el, r: el.getBoundingClientRect() }));
      const rows = [];
      for (const it of items) {
        const cy = it.r.top + it.r.height / 2;
        let row = rows.find((rw) => Math.abs(rw.cy - cy) < it.r.height / 2);
        if (!row) rows.push((row = { cy, items: [] }));
        row.items.push(it);
      }
      const groups = [];
      for (const row of rows) {
        row.items.sort((a, b) => a.r.left - b.r.left);
        let group = [row.items[0]];
        for (let i = 1; i < row.items.length; i++) {
          const gap = row.items[i].r.left - row.items[i - 1].r.right;
          if (gap <= m3.buttons.adjacencyThreshold) group.push(row.items[i]);
          else {
            groups.push(group);
            group = [row.items[i]];
          }
        }
        groups.push(group);
      }
      return groups.filter((g) => g.length > 1);
    },
  };
  return h;
}
