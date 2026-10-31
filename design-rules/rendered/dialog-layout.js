export default {
  id: 'dialog-layout',
  description: 'Dialogs are 280-560dp wide, have 24dp padding and end-aligned actions',
  check(m3, h) {
    const out = [];
    const d = m3.dialog;
    for (const paper of h.all('.MuiDialog-paper')) {
      const pr = h.rect(paper);
      if (pr.width < d.minWidth - 0.5 || pr.width > d.maxWidth + 0.5) {
        out.push({ el: paper, message: `Dialog is ${h.round(pr.width)}px wide; M3 dialogs are ${d.minWidth}-${d.maxWidth}px` });
      }
      for (const section of paper.querySelectorAll('.MuiDialogTitle-root, .MuiDialogContent-root, .MuiDialogActions-root')) {
        const s = getComputedStyle(section);
        for (const side of ['Left', 'Right']) {
          if (Math.abs(h.px(s[`padding${side}`]) - d.padding) > 0.5) {
            out.push({ el: section, message: `${h.describe(section)} has ${s[`padding${side}`]} ${side.toLowerCase()} padding; M3 dialogs use ${d.padding}px` });
          }
        }
      }
      const actions = paper.querySelector('.MuiDialogActions-root');
      const buttons = actions ? h.all('.MuiDialogActions-root .MuiButton-root').filter((b) => actions.contains(b)) : [];
      if (buttons.length) {
        const ar = h.rect(actions);
        const contentRight = ar.right - h.px(getComputedStyle(actions).paddingRight);
        const lastRight = Math.max(...buttons.map((b) => h.rect(b).right));
        if (Math.abs(contentRight - lastRight) > 1) {
          out.push({ el: actions, message: `Dialog actions are not aligned to the end (last button ends ${h.round(contentRight - lastRight)}px early)` });
        }
      }
    }
    return out;
  },
};
