import { BarChart2 } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Cell,
} from 'recharts';
import { COLORS, DISCLAIMER_TEXT, COPYRIGHT_TEXT, COMPARISON_LABELS } from '../data/forms';
import { formatPct, pctColorClass, getDivergenceLabel } from '../data/utils';

export default function ComparisonReport({ form, results, state }) {
  const totals = {
    totalCorrect: results.reduce((s, r) => s + r.totalCorrect, 0),
    numberWrong: results.reduce((s, r) => s + r.numberWrong, 0),
    selfCorrections: results.reduce((s, r) => s + r.selfCorrections, 0),
    totalPossible: results.reduce((s, r) => s + r.totalPossible, 0),
  };
  const overallPct = totals.totalPossible > 0 ? totals.totalCorrect / totals.totalPossible : 0;

  const getPctForSubtest = (num, focusLabel) => {
    const idx = form.subtests.findIndex((st) => st.num === num);
    if (idx < 0) return 0;
    const res = results[idx];
    if (focusLabel === 'Spelling (with writing)') {
      const st = form.subtests[idx];
      if (st.children && res.childResults) {
        const childIdx = st.children.findIndex((c) => c.focus.toLowerCase().includes('spelling'));
        if (childIdx >= 0) return res.childResults[childIdx].pctCorrect;
      }
    }
    return res.pctCorrect;
  };

  const allComparisons = [...form.comparisons, ...(form.extraComparisons || [])];
  const hasData = results.some(
    (r) => r.numberWrong > 0 || (r.childResults && r.childResults.some((cr) => cr.numberWrong > 0))
  );

  const barChartData = form.subtests.map((st, idx) => ({
    name: st.name,
    pct: Math.round(results[idx].pctCorrect * 100),
  }));

  const comparisonChartData = allComparisons.map((comp) => {
    const leftPct = Math.round(getPctForSubtest(comp.leftNum, comp.leftFocus) * 100);
    const rightPct = Math.round(getPctForSubtest(comp.rightNum, comp.rightFocus) * 100);
    const key = `${comp.leftNum}-${comp.rightNum}`;
    const label = COMPARISON_LABELS[key] || `${comp.leftFocus} vs ${comp.rightFocus}`;
    return {
      name: label.length > 25 ? label.substring(0, 22) + '...' : label,
      fullName: label,
      Benchmark: leftPct,
      Output: rightPct,
    };
  });

  return (
    <div className="space-y-6">
      {/* Legal Disclaimer */}
      <div
        data-pdf-section
        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4">
          <h4
            className="text-xs font-bold uppercase tracking-wider mb-2"
            style={{ color: COLORS.navy }}
          >
            Legal Disclaimer & Property Notice
          </h4>
          <p className="text-xs text-slate-600 mb-3">{COPYRIGHT_TEXT}</p>
          <div className="border-t border-slate-200 pt-3">
            <p className="text-xs italic text-slate-500">{DISCLAIMER_TEXT}</p>
          </div>
        </div>
      </div>

      {/* Insight Synthesis Report Header */}
      <div
        data-pdf-section
        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-5" style={{ borderBottom: `3px solid ${COLORS.gold}` }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h2
              className="text-2xl font-black uppercase tracking-tight"
              style={{ color: COLORS.navy }}
            >
              Insight Synthesis Report
            </h2>
            <div className="text-right">
              <div className="text-base font-bold" style={{ color: COLORS.navy }}>
                {state.studentName || '---'}
              </div>
              <div className="text-xs text-slate-500">
                {form.label} &bull; {state.testDate || '---'}
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg border px-5 py-4 text-center" style={{ borderColor: COLORS.navy + '20' }}>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Accuracy</div>
              <div className="text-3xl font-black" style={{ color: COLORS.navy }}>
                {Math.round(overallPct * 100)}%
              </div>
            </div>
            <div className="rounded-lg border px-5 py-4 text-center" style={{ borderColor: COLORS.navy + '20' }}>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Total Wrong</div>
              <div className="text-3xl font-black" style={{ color: COLORS.navy }}>
                {totals.numberWrong}
              </div>
            </div>
            <div className="rounded-lg border px-5 py-4 text-center" style={{ borderColor: COLORS.navy + '20' }}>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Self-Correction</div>
              <div className="text-3xl font-black" style={{ color: COLORS.navy }}>
                {totals.selfCorrections}
              </div>
            </div>
            <div className="rounded-lg border px-5 py-4 text-center" style={{ borderColor: COLORS.gold }}>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Items</div>
              <div className="text-3xl font-black" style={{ color: COLORS.gold }}>
                {totals.totalPossible}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Scores Data Table */}
      <div
        data-pdf-section
        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 rounded-full" style={{ backgroundColor: COLORS.navy }} />
            <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: COLORS.navy }}>
              Raw Scores Data
            </h3>
          </div>
        </div>
        <div className="px-6 py-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2" style={{ borderColor: COLORS.navy + '20' }}>
                <th className="text-left py-2 text-xs font-bold uppercase tracking-wide" style={{ color: COLORS.navy }}>#</th>
                <th className="text-left py-2 text-xs font-bold uppercase tracking-wide" style={{ color: COLORS.navy }}>Subtest</th>
                <th className="text-left py-2 text-xs font-bold uppercase tracking-wide" style={{ color: COLORS.navy }}>Focus</th>
                <th className="text-center py-2 text-xs font-bold uppercase tracking-wide" style={{ color: COLORS.navy }}>Total Possible</th>
                <th className="text-center py-2 text-xs font-bold uppercase tracking-wide" style={{ color: COLORS.navy }}># Wrong</th>
                <th className="text-center py-2 text-xs font-bold uppercase tracking-wide" style={{ color: COLORS.navy }}>Self Corr.</th>
                <th className="text-center py-2 text-xs font-bold uppercase tracking-wide" style={{ color: COLORS.navy }}>Total Correct</th>
                <th className="text-center py-2 text-xs font-bold uppercase tracking-wide" style={{ color: COLORS.navy }}>% Correct</th>
              </tr>
            </thead>
            <tbody>
              {form.subtests.map((st, idx) => {
                const res = results[idx];
                return (
                  <tr key={idx} className="border-b border-slate-100">
                    <td className="py-2 text-xs text-slate-500">{st.num}</td>
                    <td className="py-2 text-xs font-medium" style={{ color: COLORS.navy }}>{st.name}</td>
                    <td className="py-2 text-xs text-slate-600">{st.focus}</td>
                    <td className="py-2 text-xs text-center text-slate-600">{res.totalPossible}</td>
                    <td className="py-2 text-xs text-center font-semibold" style={{ color: COLORS.navy }}>{res.numberWrong}</td>
                    <td className="py-2 text-xs text-center text-slate-600">{res.selfCorrections}</td>
                    <td className="py-2 text-xs text-center font-semibold" style={{ color: COLORS.navy }}>{res.totalCorrect}</td>
                    <td className={`py-2 text-xs text-center font-bold ${pctColorClass(res.pctCorrect)}`}>
                      {formatPct(res.pctCorrect)}
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t-2" style={{ borderColor: COLORS.navy + '30' }}>
                <td className="py-2" colSpan={3}>
                  <span className="text-xs font-bold uppercase" style={{ color: COLORS.navy }}>Totals</span>
                </td>
                <td className="py-2 text-xs text-center font-bold" style={{ color: COLORS.navy }}>{totals.totalPossible}</td>
                <td className="py-2 text-xs text-center font-bold" style={{ color: COLORS.navy }}>{totals.numberWrong}</td>
                <td className="py-2 text-xs text-center font-bold" style={{ color: COLORS.navy }}>{totals.selfCorrections}</td>
                <td className="py-2 text-xs text-center font-bold" style={{ color: COLORS.navy }}>{totals.totalCorrect}</td>
                <td className={`py-2 text-xs text-center font-bold ${pctColorClass(overallPct)}`}>
                  {formatPct(overallPct)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty state */}
      {!hasData && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-12 text-center">
          <BarChart2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-400">
            Enter raw scores above to see the full Insight Synthesis Report
          </p>
        </div>
      )}

      {/* Charts and analysis - only when data entered */}
      {hasData && (
        <>
          {/* I. Modality Performance Matrix */}
          <div
            data-pdf-section
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ backgroundColor: COLORS.navy }} />
                <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: COLORS.navy }}>
                  I. Modality Performance Matrix
                </h3>
              </div>
            </div>
            <div className="px-6 py-6">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={barChartData} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                    height={80}
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    formatter={(val) => [`${val}%`, '% Correct']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
                  />
                  <Bar dataKey="pct" radius={[4, 4, 0, 0]} maxBarSize={50}>
                    {barChartData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS.navy} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* II. Clinical Comparison Analytics */}
          <div
            data-pdf-section
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ backgroundColor: COLORS.navy }} />
                <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: COLORS.navy }}>
                  II. Clinical Comparison Analytics
                </h3>
              </div>
            </div>
            <div className="px-6 py-6">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={comparisonChartData} margin={{ top: 5, right: 10, left: 0, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#64748B' }}
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                    height={100}
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    formatter={(val, name) => [`${val}%`, name]}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Bar dataKey="Benchmark" fill="#CBD5E1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Output" fill={COLORS.gold} radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* III. Strategic Findings */}
          <div data-pdf-section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 rounded-full" style={{ backgroundColor: COLORS.navy }} />
              <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: COLORS.navy }}>
                III. Strategic Findings
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allComparisons.map((comp, idx) => {
                const leftPct = Math.round(getPctForSubtest(comp.leftNum, comp.leftFocus) * 100);
                const rightPct = Math.round(getPctForSubtest(comp.rightNum, comp.rightFocus) * 100);
                const diff = Math.abs(leftPct - rightPct);
                const key = `${comp.leftNum}-${comp.rightNum}`;
                const label = COMPARISON_LABELS[key] || `${comp.leftFocus} vs ${comp.rightFocus}`;
                const isDivergent = diff >= 20;
                const leftName = form.subtests.find((st) => st.num === comp.leftNum)?.name || comp.leftFocus;
                const rightName = form.subtests.find((st) => st.num === comp.rightNum)?.name || comp.rightFocus;

                return (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                  >
                    <div
                      className="px-5 py-3"
                      style={{ borderBottom: `2px solid ${isDivergent ? COLORS.gold : '#E2E8F0'}` }}
                    >
                      <h4
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: isDivergent ? COLORS.gold : COLORS.navy }}
                      >
                        {label}
                      </h4>
                    </div>
                    <div className="px-5 py-4">
                      <div
                        className="flex items-end justify-between mb-3"
                        style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            {leftName}
                          </div>
                          <div className="text-4xl font-black" style={{ color: COLORS.navy }}>
                            {leftPct}%
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            {rightName}
                          </div>
                          <div className="text-4xl font-black" style={{ color: COLORS.navy }}>
                            {rightPct}%
                          </div>
                        </div>
                      </div>
                      <p className="text-xs italic text-slate-500">
                        Variance of {diff}%. Analysis identifies:{' '}
                        <span
                          className="font-semibold"
                          style={{ color: isDivergent ? COLORS.gold : COLORS.navy }}
                        >
                          {getDivergenceLabel(diff)}
                        </span>
                        .
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="text-center py-4">
        <p
          className="text-xs uppercase tracking-widest font-semibold"
          style={{ color: COLORS.navy + '60' }}
        >
          Slingerland&reg; Literacy Institute Methodology Synthesis &bull; Copyright &copy;{' '}
          {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
