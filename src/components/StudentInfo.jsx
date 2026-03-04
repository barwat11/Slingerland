import { ClipboardList } from 'lucide-react';
import { COLORS } from '../data/forms';

export default function StudentInfo({ state, onChange }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h3
        className="text-base font-semibold mb-4 flex items-center gap-2"
        style={{ color: COLORS.navy }}
      >
        <ClipboardList className="w-4 h-4" style={{ color: COLORS.gold }} />
        Student Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Student Name</label>
          <input
            type="text"
            value={state.studentName}
            onChange={(e) => onChange('studentName', e.target.value)}
            placeholder="Enter student name"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Screener Name</label>
          <input
            type="text"
            value={state.screenerName}
            onChange={(e) => onChange('screenerName', e.target.value)}
            placeholder="Enter screener name"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Date of Test</label>
          <input
            type="date"
            value={state.testDate}
            onChange={(e) => onChange('testDate', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
}
