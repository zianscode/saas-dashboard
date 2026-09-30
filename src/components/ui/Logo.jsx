export default function Logo({ isCollapsed = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-10 shrink-0 place-items-center">
        <img
          src="/logo.png"
          alt="Logo"
          className="size-7 shrink-0 object-cover"
        />
      </span>
      <span
        className={`text-[16px] leading-tight font-semibold tracking-tight text-ink-900 ${
          isCollapsed ? "lg:hidden" : ""
        }`}
      >
        SaaS Dashboard
      </span>
    </div>
  );
}
