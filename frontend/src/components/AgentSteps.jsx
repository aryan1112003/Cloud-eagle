import { useState } from "react";

const STEPS = [
  {
    icon: "✦",
    label: "Intent",
    color: "text-violet-400",
    dot: "bg-violet-500",
    description: (d) =>
      d.country_detected
        ? `${d.country_detected} · ${d.fields_requested?.join(", ") || "general"}`
        : "No country detected",
  },
  {
    icon: "⬡",
    label: "Fetch",
    color: "text-cyan-400",
    dot: "bg-cyan-500",
    description: (d) =>
      d.country_detected
        ? `restcountries.com/v3.1 · ${d.fields_requested?.length || 0} field(s)`
        : "Skipped",
  },
  {
    icon: "◈",
    label: "Compose",
    color: "text-indigo-400",
    dot: "bg-indigo-500",
    description: (d) =>
      d.sources?.length ? "Grounded — no hallucination" : "Error handled",
  },
];

export default function AgentSteps({ data }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-1.5 ml-1">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors duration-150 group"
      >
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-90" : ""} group-hover:text-indigo-400`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-medium">3-step trace</span>
      </button>

      {open && (
        <div className="mt-2 pl-2 step-line ml-1.5 space-y-2">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs">
              <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
                <span className={`${step.dot} w-1.5 h-1.5 rounded-full flex-shrink-0`} />
              </div>
              <div>
                <span className={`font-semibold ${step.color} font-mono`}>{step.icon} {step.label}</span>
                <span className="text-slate-500 ml-2">{step.description(data)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
