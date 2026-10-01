import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { MATERIAL_STATUSES } from "../../utils/validation";

const OPTIONS = ["Semua", ...MATERIAL_STATUSES];

export default function StatusFilter({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="inline-flex items-center gap-1.5 rounded-field border border-line bg-surface px-3 py-2 text-sm text-ink-600 transition-colors hover:bg-surface-muted"
      >
        {value}
        <ChevronDown
          strokeWidth={1.9}
          className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute right-0 z-20 mt-1.5 max-h-64 w-44 overflow-auto rounded-field border border-line bg-surface py-1 shadow-float"
        >
          {OPTIONS.map((option) => (
            <li key={option}>
              <button
                type="button"
                role="option"
                aria-selected={option === value}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-surface-muted ${
                  option === value ? "text-brand-600" : "text-ink-600"
                }`}
              >
                {option}
                {option === value && (
                  <Check strokeWidth={2.2} className="size-4 shrink-0" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
