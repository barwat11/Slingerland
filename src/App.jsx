import { useState, useCallback, useRef } from 'react';
import {
  PlayCircle,
  ChevronRight,
  Sparkles,
  RotateCcw,
  FileDown,
  Printer,
  TableIcon,
  BarChart2,
  Activity,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FORMS, COLORS, COPYRIGHT_TEXT } from './data/forms';
import { createEmptyState, generateSampleData, computeSubtestResult, formatPct, pctColorClass, pctBgClass } from './data/utils';
import DisclaimerBanner from './components/DisclaimerBanner';
import FormTabs from './components/FormTabs';
import StudentInfo from './components/StudentInfo';
import RawScoresTable from './components/RawScoresTable';
import ComparisonReport from './components/ComparisonReport';

export default function App() {
  const [selectedFormId, setSelectedFormId] = useState('A');
  const [activeTab, setActiveTab] = useState('scores');
  const [formStates, setFormStates] = useState(() => {
    const states = {};
    FORMS.forEach((form) => {
      states[form.id] = createEmptyState(form);
    });
    return states;
  });
  const [exporting, setExporting] = useState(false);
  const mainRef = useRef(null);

  const currentForm = FORMS.find((f) => f.id === selectedFormId);
  const currentState = formStates[selectedFormId];
  const results = currentForm.subtests.map((st, idx) =>
    computeSubtestResult(st, currentState.subtests[idx])
  );

  const handleFieldChange = useCallback(
    (field, value) => {
      setFormStates((prev) => ({
        ...prev,
        [selectedFormId]: { ...prev[selectedFormId], [field]: value },
      }));
    },
    [selectedFormId]
  );

  const handleSubtestChange = useCallback(
    (stIdx, field, value) => {
      setFormStates((prev) => {
        const formState = { ...prev[selectedFormId] };
        const subtests = [...formState.subtests];
        subtests[stIdx] = { ...subtests[stIdx], [field]: value };
        return { ...prev, [selectedFormId]: { ...formState, subtests } };
      });
    },
    [selectedFormId]
  );

  const handleChildChange = useCallback(
    (stIdx, childIdx, field, value) => {
      setFormStates((prev) => {
        const formState = { ...prev[selectedFormId] };
        const subtests = [...formState.subtests];
        const childInputs = [...(subtests[stIdx].childInputs || [])];
        childInputs[childIdx] = { ...childInputs[childIdx], [field]: value };
        subtests[stIdx] = { ...subtests[stIdx], childInputs };
        return { ...prev, [selectedFormId]: { ...formState, subtests } };
      });
    },
    [selectedFormId]
  );

  const handleReset = useCallback(() => {
    if (window.confirm('Reset all scores for this form? This cannot be undone.')) {
      setFormStates((prev) => ({
        ...prev,
        [selectedFormId]: createEmptyState(currentForm),
      }));
    }
  }, [selectedFormId, currentForm]);

  const handleSampleData = useCallback(() => {
    setFormStates(() => {
      const states = {};
      for (const form of FORMS) {
        states[form.id] = generateSampleData(form);
      }
      return states;
    });
  }, []);

  const handlePrint = useCallback(() => {
    const wasScores = activeTab !== 'report';
    if (wasScores) setActiveTab('report');
    setTimeout(() => {
      window.print();
      if (wasScores) setActiveTab('scores');
    }, 300);
  }, [activeTab]);

  const convertSvgsToCanvases = useCallback(async (container) => {
    const svgs = container.querySelectorAll('.recharts-wrapper svg');
    const replacements = [];
    for (const svg of Array.from(svgs)) {
      const parent = svg.parentElement;
      if (!parent) continue;
      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(svg);
      const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = svg.clientWidth * 2;
          canvas.height = svg.clientHeight * 2;
          canvas.style.width = svg.clientWidth + 'px';
          canvas.style.height = svg.clientHeight + 'px';
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.scale(2, 2);
            ctx.drawImage(img, 0, 0, svg.clientWidth, svg.clientHeight);
          }
          svg.style.display = 'none';
          parent.appendChild(canvas);
          replacements.push({ svg, canvas, parent });
          URL.revokeObjectURL(url);
          resolve();
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
        img.src = url;
      });
    }
    return replacements;
  }, []);

  const restoreSvgs = useCallback((replacements) => {
    for (const r of replacements) {
      r.svg.style.display = '';
      r.parent.removeChild(r.canvas);
    }
  }, []);

  const handleExportPDF = useCallback(async () => {
    if (!mainRef.current || exporting) return;
    setExporting(true);
    const wasScores = activeTab !== 'report';
    if (wasScores) setActiveTab('report');
    await new Promise((r) => setTimeout(r, 800));

    try {
      const container = mainRef.current;
      if (!container) return;
      const replacements = await convertSvgsToCanvases(container);
      const sections = container.querySelectorAll('[data-pdf-section]');
      const images = [];

      for (const section of Array.from(sections)) {
        const canvas = await html2canvas(section, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });
        images.push({
          imgData: canvas.toDataURL('image/png'),
          width: canvas.width,
          height: canvas.height,
        });
      }

      restoreSvgs(replacements);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentW = pageW - margin * 2;
      const contentH = pageH - margin * 2;
      let curY = margin;

      for (const img of images) {
        const imgH = (img.height * contentW) / img.width;
        if (curY + imgH > pageH - margin && curY > margin + 1) {
          pdf.addPage();
          curY = margin;
        }
        if (imgH > contentH) {
          const totalH = imgH;
          let drawn = 0;
          while (drawn < totalH) {
            if (drawn > 0) {
              pdf.addPage();
              curY = margin;
            }
            const available = pageH - margin - curY;
            pdf.addImage(img.imgData, 'PNG', margin, curY - drawn, contentW, totalH);
            drawn += available;
            curY = margin + Math.min(totalH - (drawn - available), available);
          }
          curY = margin + (totalH % contentH);
          if (curY <= margin) curY = margin;
          curY += 4;
        } else {
          pdf.addImage(img.imgData, 'PNG', margin, curY, contentW, imgH);
          curY += imgH + 4;
        }
      }

      const nameSlug = currentState.studentName
        ? '_' + currentState.studentName.replace(/\s+/g, '_')
        : '';
      const filename = 'Slingerland_' + currentForm.label.replace(' ', '_') + nameSlug + '.pdf';
      pdf.save(filename);
    } finally {
      setExporting(false);
      if (wasScores) setActiveTab('scores');
    }
  }, [currentForm, currentState.studentName, exporting, activeTab, convertSvgsToCanvases, restoreSvgs]);

  const hasEnteredData = results.some(
    (r) => r.numberWrong > 0 || (r.childResults && r.childResults.some((cr) => cr.numberWrong > 0))
  );

  return (
    <div
      className="min-h-screen"
      style={{ background: `linear-gradient(135deg, #f8fafc, #ffffff, ${COLORS.lightGold}40)` }}
    >
      {/* Header */}
      <header
        className="bg-white border-b shadow-sm sticky top-0 z-50"
        style={{ borderColor: COLORS.navy + '20' }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img src="/sli-logo.png" alt="Slingerland Literacy Institute" className="h-12 w-auto" />
              <div>
                <h1
                  className="text-lg font-bold flex items-center gap-2"
                  style={{ color: COLORS.navy }}
                >
                  Screening Comparison Calculator
                </h1>
                <p className="text-xs" style={{ color: COLORS.gold }}>
                  Slingerland&reg; Literacy Institute
                </p>
              </div>
            </div>
            <FormTabs forms={FORMS} selected={selectedFormId} onSelect={setSelectedFormId} />
          </div>
        </div>
      </header>

      {/* Disclaimer */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <DisclaimerBanner />
      </div>

      {/* Tab switcher and action buttons */}
      <div className="max-w-6xl mx-auto px-4 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex gap-1 p-1 rounded-lg" style={{ backgroundColor: COLORS.navy + '0A' }}>
          <button
            onClick={() => setActiveTab('scores')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'scores' ? 'bg-white shadow' : ''
            }`}
            style={activeTab === 'scores' ? { color: COLORS.navy } : { color: '#6B7D8D' }}
          >
            <span className="flex items-center gap-1.5">
              <TableIcon className="w-3.5 h-3.5" />
              Raw Scores
            </span>
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'report' ? 'bg-white shadow' : ''
            }`}
            style={activeTab === 'report' ? { color: COLORS.navy } : { color: '#6B7D8D' }}
          >
            <span className="flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5" />
              Comparison Report
            </span>
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSampleData}
            className="flex items-center gap-1.5 px-3 py-2 text-sm border-2 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
            style={{ color: '#059669', borderColor: '#059669' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Sample Data
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            style={{ color: COLORS.navy }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-white rounded-lg transition-colors disabled:opacity-50"
            style={{ backgroundColor: COLORS.gold }}
          >
            <FileDown className="w-3.5 h-3.5" />
            {exporting ? 'Exporting...' : 'Export PDF'}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-white rounded-lg transition-colors"
            style={{ backgroundColor: COLORS.navy }}
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 pb-8" ref={mainRef}>
        {hasEnteredData && (
          <div
            className={`mb-4 flex items-center gap-2 px-4 py-3 rounded-lg border text-xs ${pctBgClass(
              results.reduce((s, r) => s + r.totalCorrect, 0) /
                Math.max(results.reduce((s, r) => s + r.totalPossible, 0), 1)
            )}`}
          >
            <Activity className="w-4 h-4" />
            <span>
              Data entered for {currentForm.label}. Overall:{' '}
              <strong>
                {formatPct(
                  results.reduce((s, r) => s + r.totalCorrect, 0) /
                    Math.max(results.reduce((s, r) => s + r.totalPossible, 0), 1)
                )}
              </strong>{' '}
              correct
            </span>
          </div>
        )}

        <div className="space-y-6">
          <StudentInfo state={currentState} onChange={handleFieldChange} />

          {activeTab === 'scores' && (
            <>
              <RawScoresTable
                form={currentForm}
                state={currentState}
                results={results}
                onSubtestChange={handleSubtestChange}
                onChildChange={handleChildChange}
              />
              <div className="flex justify-center pt-2 pb-4">
                <button
                  onClick={() => setActiveTab('report')}
                  className="flex items-center gap-3 px-8 py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                  style={{ backgroundColor: COLORS.navy }}
                >
                  <PlayCircle className="w-6 h-6" />
                  Run Analysis
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </>
          )}

          {activeTab === 'report' && (
            <div data-print-area>
              <ComparisonReport form={currentForm} results={results} state={currentState} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-8 border-t" style={{ borderColor: COLORS.navy + '20' }}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <img src="/sli-logo.png" alt="SLI" className="h-8 w-auto" />
              <span className="text-xs font-semibold" style={{ color: COLORS.navy }}>
                Slingerland&reg; Literacy Institute
              </span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs" style={{ color: COLORS.navy + 'AA' }}>
                {COPYRIGHT_TEXT}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
