export default {
  id: 'spacing-grid',
  description: 'Layout padding, gaps and the margins between laid-out items are multiples of m3.grid (4dp)',
  check(m3, h) {
    const out = [];
    // MUI components that are pure layout. Any other Mui* component has its
    // internal spacing defined by its own spec (e.g. button padding), so only
    // its outer margins are checked.
    const LAYOUT = /^Mui(Stack|Box|Grid|Container|Paper|Card|CardContent|CardActions|Dialog|DialogTitle|DialogContent|DialogActions|Toolbar)-root$/;
    const roots = (el) => [...el.classList].filter((c) => /^Mui[A-Za-z]+-root$/.test(c));
    // Plain elements (no Mui class) count as layout unless they are the
    // internals of a component.
    const isLayout = (el) => {
      for (let n = el; n; n = n.parentElement) {
        const r = roots(n);
        if (r.length) return r.some((c) => LAYOUT.test(c));
      }
      return true;
    };
    const off = (v) => Math.abs(v / m3.grid - Math.round(v / m3.grid)) > 0.01;
    // One violation per element, listing every off-grid property.
    const report = (el, style, props) => {
      const bad = props.filter((p) => off(h.px(style[p]))).map((p) => `${p} ${h.round(h.px(style[p]))}px`);
      if (bad.length) out.push({ el, message: `${h.describe(el)} has ${bad.join(', ')}, not on the ${m3.grid}dp grid` });
    };
    const root = document.querySelector('[data-screen]');
    const scope = [root, ...document.querySelectorAll('[data-screen] *, .MuiDialog-root *')];
    for (const el of scope) {
      if (!el || !h.visible(el) || !isLayout(el)) continue;
      report(el, getComputedStyle(el), ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'rowGap', 'columnGap']);
      for (const child of el.children) {
        if (h.visible(child)) report(child, getComputedStyle(child), ['marginTop', 'marginRight', 'marginBottom', 'marginLeft']);
      }
    }
    return out;
  },
};
