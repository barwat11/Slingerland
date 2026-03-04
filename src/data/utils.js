export function createEmptyState(form) {
  return {
    studentName: '',
    screenerName: '',
    testDate: '',
    subtests: form.subtests.map((st) => ({
      numberWrong: '',
      selfCorrections: '',
      childInputs: st.children
        ? st.children.map((child) => ({
            numberWrong: '',
            selfCorrections: '',
            totalPossible: String(child.totalPossible),
          }))
        : undefined,
    })),
  };
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateSampleData(form) {
  const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'James', 'Sophia', 'Lucas'];
  const lastNames = ['Johnson', 'Smith', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore'];
  const screeners = ['Ms. Thompson', 'Mr. Rodriguez', 'Dr. Chen', 'Mrs. Baker', 'Ms. Patel'];

  const studentName = firstNames[randInt(0, firstNames.length - 1)] + ' ' + lastNames[randInt(0, lastNames.length - 1)];
  const screenerName = screeners[randInt(0, screeners.length - 1)];
  const now = new Date();
  const daysAgo = randInt(0, 30);
  const testDate = new Date(now.getTime() - daysAgo * 86400000).toISOString().split('T')[0];

  return {
    studentName,
    screenerName,
    testDate,
    subtests: form.subtests.map((st) => {
      if (st.children) {
        return {
          numberWrong: '',
          selfCorrections: '',
          childInputs: st.children.map((child) => {
            const tp = child.totalPossible;
            const maxWrong = Math.ceil(tp * 0.4);
            const nw = randInt(0, maxWrong);
            const sc = randInt(0, Math.min(nw, 3));
            return {
              numberWrong: String(nw),
              selfCorrections: String(sc),
              totalPossible: String(tp),
            };
          }),
        };
      }
      const tp = st.totalPossible;
      const maxWrong = Math.ceil(tp * 0.4);
      const nw = randInt(0, maxWrong);
      const sc = randInt(0, Math.min(nw, 3));
      return { numberWrong: String(nw), selfCorrections: String(sc) };
    }),
  };
}

function parseNum(val) {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

export function computeSubtestResult(subtestDef, subtestState) {
  if (subtestDef.children && subtestState.childInputs) {
    const childResults = subtestDef.children.map((child, idx) => {
      const input = subtestState.childInputs[idx];
      const tp = input.totalPossible ? parseNum(input.totalPossible) : child.totalPossible;
      const nw = parseNum(input.numberWrong);
      const sc = parseNum(input.selfCorrections);
      const tc = tp - nw;
      return {
        totalPossible: tp,
        numberWrong: nw,
        selfCorrections: sc,
        totalCorrect: tc,
        pctCorrect: tp > 0 ? tc / tp : 0,
      };
    });
    const totalPossible = childResults.reduce((s, r) => s + r.totalPossible, 0);
    const numberWrong = childResults.reduce((s, r) => s + r.numberWrong, 0);
    const selfCorrections = childResults.reduce((s, r) => s + r.selfCorrections, 0);
    const totalCorrect = totalPossible - numberWrong;
    return {
      totalPossible,
      numberWrong,
      selfCorrections,
      totalCorrect,
      pctCorrect: totalPossible > 0 ? totalCorrect / totalPossible : 0,
      childResults,
    };
  }
  const tp = subtestDef.totalPossible;
  const nw = parseNum(subtestState.numberWrong);
  const sc = parseNum(subtestState.selfCorrections);
  const tc = tp - nw;
  return {
    totalPossible: tp,
    numberWrong: nw,
    selfCorrections: sc,
    totalCorrect: tc,
    pctCorrect: tp > 0 ? tc / tp : 0,
  };
}

export function formatPct(decimal) {
  return (decimal * 100).toFixed(1) + '%';
}

export function pctColorClass(pct) {
  return pct >= 0.85 ? 'text-emerald-600' : pct >= 0.7 ? 'text-amber-600' : 'text-red-600';
}

export function pctBgClass(pct) {
  return pct >= 0.85
    ? 'bg-emerald-50 border-emerald-200'
    : pct >= 0.7
      ? 'bg-amber-50 border-amber-200'
      : 'bg-red-50 border-red-200';
}

export function getDivergenceLabel(diff) {
  return diff >= 20 ? 'Strategic Divergence' : 'Modality Alignment';
}
