import { COLORS } from '../data/forms';

export default function FormTabs({ forms, selected, onSelect }) {
  return (
    <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: '#E8EDF2' }}>
      {forms.map((form) => (
        <button
          key={form.id}
          onClick={() => onSelect(form.id)}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            selected === form.id ? 'bg-white shadow-md' : 'hover:bg-white/50'
          }`}
          style={selected === form.id ? { color: COLORS.navy } : { color: '#6B7D8D' }}
        >
          {form.label}
        </button>
      ))}
    </div>
  );
}
