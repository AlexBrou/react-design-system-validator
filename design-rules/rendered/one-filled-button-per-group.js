export default {
  id: 'one-filled-button-per-group',
  description: 'A group of adjacent buttons has at most one filled (highest emphasis) button',
  check(m3, h) {
    const out = [];
    for (const group of h.buttonGroups(m3)) {
      const filled = group.filter(({ el }) => el.matches('.MuiButton-filled, .MuiButton-contained'));
      if (filled.length > m3.buttons.maxFilledPerGroup) {
        for (const { el } of filled.slice(m3.buttons.maxFilledPerGroup)) {
          out.push({ el, message: `${h.describe(el)}: ${filled.length} filled buttons side by side; use tonal/outlined/text for secondary actions` });
        }
      }
    }
    return out;
  },
};
