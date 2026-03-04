import { AlertTriangle } from 'lucide-react';
import { COLORS, DISCLAIMER_TEXT, COPYRIGHT_TEXT } from '../data/forms';

export default function DisclaimerBanner() {
  return (
    <div
      className="rounded-xl border-2 p-4 mb-4"
      style={{ borderColor: COLORS.gold, backgroundColor: COLORS.lightGold }}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: COLORS.gold }} />
        <div>
          <p className="text-xs font-semibold mb-1.5" style={{ color: COLORS.navy }}>
            {DISCLAIMER_TEXT}
          </p>
          <p className="text-xs mt-2" style={{ color: COLORS.darkTeal }}>
            {COPYRIGHT_TEXT}
          </p>
        </div>
      </div>
    </div>
  );
}
