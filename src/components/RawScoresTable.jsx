import { ChevronRight } from 'lucide-react';
import { COLORS } from '../data/forms';
import { formatPct, pctColorClass } from '../data/utils';
import { TableIcon } from 'lucide-react';

function ChildRows({ st, stIdx, state, res, onChildChange }) {
  return (
    <>
      <tr style={{ backgroundColor: COLORS.navy + '06' }}>
        <td className="px-4 py-3 text-slate-500 font-medium">{st.num}</td>
        <td className="px-4 py-3 font-medium" style={{ color: COLORS.navy }}>
          {st.name}
        </td>
        <td className="px-4 py-3 text-slate-600">{st.focus}</td>
        <td className="px-4 py-3 text-center font-semibold text-slate-700">{res.totalPossible}</td>
        <td className="px-4 py-3 text-center text-slate-500">{res.numberWrong}</td>
        <td className="px-4 py-3 text-center text-slate-500">{res.selfCorrections}</td>
        <td className="px-4 py-3 text-center font-semibold text-slate-700">{res.totalCorrect}</td>
        <td className={`px-4 py-3 text-center font-bold ${pctColorClass(res.pctCorrect)}`}>
          {formatPct(res.pctCorrect)}
        </td>
      </tr>
      {st.children.map((child, childIdx) => {
        const childRes = res.childResults[childIdx];
        const childInput = state.subtests[stIdx].childInputs[childIdx];
        return (
          <tr key={childIdx} className="hover:bg-slate-50 transition-colors">
            <td className="px-4 py-2" />
            <td className="px-4 py-2 pl-10 text-slate-500 text-xs flex items-center gap-1">
              <ChevronRight className="w-3 h-3" />
              {child.focus}
            </td>
            <td className="px-4 py-2 text-slate-500 text-xs">{child.focus}</td>
            <td className="px-4 py-2">
              {child.editableTotalPossible ? (
                <input
                  type="number"
                  min="0"
                  value={childInput.totalPossible}
                  onChange={(e) => onChildChange(stIdx, childIdx, 'totalPossible', e.target.value)}
                  className="w-full px-2 py-1 border rounded-md text-center text-xs outline-none"
                  style={{ borderColor: COLORS.gold, backgroundColor: COLORS.lightGold }}
                  title={child.editableHint}
                />
              ) : (
                <div className="text-center text-xs font-medium text-slate-600">
                  {child.totalPossible}
                </div>
              )}
            </td>
            <td className="px-4 py-2">
              <input
                type="number"
                min="0"
                max={childRes.totalPossible}
                value={childInput.numberWrong}
                onChange={(e) => onChildChange(stIdx, childIdx, 'numberWrong', e.target.value)}
                className="w-full px-2 py-1 border border-slate-300 rounded-md text-center text-xs outline-none"
                placeholder="0"
              />
            </td>
            <td className="px-4 py-2">
              <input
                type="number"
                min="0"
                value={childInput.selfCorrections}
                onChange={(e) => onChildChange(stIdx, childIdx, 'selfCorrections', e.target.value)}
                className="w-full px-2 py-1 border border-slate-300 rounded-md text-center text-xs outline-none"
                placeholder="0"
              />
            </td>
            <td className="px-4 py-2 text-center text-xs font-medium text-slate-600">
              {childRes.totalCorrect}
            </td>
            <td className={`px-4 py-2 text-center text-xs font-bold ${pctColorClass(childRes.pctCorrect)}`}>
              {formatPct(childRes.pctCorrect)}
            </td>
          </tr>
        );
      })}
    </>
  );
}

export default function RawScoresTable({ form, state, results, onSubtestChange, onChildChange }) {
  const totals = {
    totalPossible: results.reduce((s, r) => s + r.totalPossible, 0),
    numberWrong: results.reduce((s, r) => s + r.numberWrong, 0),
    selfCorrections: results.reduce((s, r) => s + r.selfCorrections, 0),
    totalCorrect: results.reduce((s, r) => s + r.totalCorrect, 0),
  };
  const overallPct = totals.totalPossible > 0 ? totals.totalCorrect / totals.totalPossible : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div
        className="px-6 py-4 border-b border-slate-200"
        style={{ background: `linear-gradient(to right, ${COLORS.lightGold}, #f8fafc)` }}
      >
        <h3
          className="text-base font-semibold flex items-center gap-2"
          style={{ color: COLORS.navy }}
        >
          <TableIcon className="w-4 h-4" style={{ color: COLORS.gold }} />
          Raw Scores Entry
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Enter the Number Wrong and Self Corrections for each subtest
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200" style={{ backgroundColor: COLORS.navy + '08' }}>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 w-10">#</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Subtest</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Focus</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 w-24">Total Possible</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 w-28">Number Wrong</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 w-28">Self Corrections</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 w-24">Total Correct</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 w-24">% Correct</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {form.subtests.map((st, idx) => {
              const res = results[idx];
              return st.children ? (
                <ChildRows
                  key={st.num}
                  st={st}
                  stIdx={idx}
                  state={state}
                  res={res}
                  onChildChange={onChildChange}
                />
              ) : (
                <tr key={st.num} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-500 font-medium">{st.num}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: COLORS.navy }}>
                    {st.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{st.focus}</td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-700">
                    {st.totalPossible}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      max={st.totalPossible}
                      value={state.subtests[idx].numberWrong}
                      onChange={(e) => onSubtestChange(idx, 'numberWrong', e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded-md text-center text-sm outline-none"
                      placeholder="0"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      value={state.subtests[idx].selfCorrections}
                      onChange={(e) => onSubtestChange(idx, 'selfCorrections', e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded-md text-center text-sm outline-none"
                      placeholder="0"
                    />
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-700">
                    {res.totalCorrect}
                  </td>
                  <td className={`px-4 py-3 text-center font-bold ${pctColorClass(res.pctCorrect)}`}>
                    {formatPct(res.pctCorrect)}
                  </td>
                </tr>
              );
            })}
            <tr
              className="font-semibold border-t-2"
              style={{ backgroundColor: COLORS.navy + '0A', borderColor: COLORS.navy + '30' }}
            >
              <td className="px-4 py-3" colSpan={3}>
                <span style={{ color: COLORS.navy }}>TOTALS</span>
              </td>
              <td className="px-4 py-3 text-center" style={{ color: COLORS.navy }}>
                {totals.totalPossible}
              </td>
              <td className="px-4 py-3 text-center" style={{ color: COLORS.navy }}>
                {totals.numberWrong}
              </td>
              <td className="px-4 py-3 text-center" style={{ color: COLORS.navy }}>
                {totals.selfCorrections}
              </td>
              <td className="px-4 py-3 text-center" style={{ color: COLORS.navy }}>
                {totals.totalCorrect}
              </td>
              <td className={`px-4 py-3 text-center font-bold ${pctColorClass(overallPct)}`}>
                {formatPct(overallPct)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
