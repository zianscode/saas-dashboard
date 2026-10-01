export default function MiniBars({ values }) {
  const max = values.reduce((peak, value) => Math.max(peak, value), 0);

  return (
    <div className="flex h-7 items-end gap-0.75" aria-hidden="true">
      {values.map((value, index) => (
        <span
          key={index}
          className={`flex-1 rounded-t-xs ${
            value === max && max > 0 ? "bg-brand-500" : "bg-brand-200"
          }`}
          style={{
            height: max === 0 ? "0%" : `${(value / max) * 100}%`,
          }}
        />
      ))}
    </div>
  );
}
