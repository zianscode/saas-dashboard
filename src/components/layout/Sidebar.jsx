import { useMemo, useRef, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { NAV_SECTIONS, SIDEBAR_FOOTER_ITEMS } from "../../data/navigation";
import Logo from "../ui/Logo";

function NavLink({ item, isCollapsed, onNavigate }) {
  const IconComponent = item.icon;

  return (
    <a
      href={item.href}
      onClick={onNavigate}
      aria-current={item.isActive ? "page" : undefined}
      aria-label={isCollapsed ? item.label : undefined}
      title={isCollapsed ? item.label : undefined}
      className={`group rounded-xl text-sm font-medium transition-all duration-200 ${
        isCollapsed
          ? "grid size-10 place-items-center"
          : "flex items-center gap-3 px-3 py-2.5"
      } ${
        item.isActive
          ? "bg-brand-600 text-white shadow-sm shadow-brand-600/30"
          : "text-ink-600 hover:bg-surface hover:text-brand-700"
      }`}
    >
      <IconComponent
        strokeWidth={1.9}
        className={`size-4.5 shrink-0 transition-colors ${
          item.isActive
            ? "text-white"
            : "text-ink-400 group-hover:text-brand-600"
        }`}
      />
      <span className={`flex-1 truncate ${isCollapsed ? "lg:hidden" : ""}`}>
        {item.label}
      </span>
      {item.badge && (
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            item.isActive
              ? "bg-white/20 text-white"
              : "bg-brand-100 text-brand-700"
          } ${isCollapsed ? "lg:hidden" : ""}`}
        >
          {item.badge}
        </span>
      )}
    </a>
  );
}

function SidebarSearch({
  isCollapsed,
  query,
  onQueryChange,
  onExpand,
  inputRef,
}) {
  const handleIconClick = () => {
    onExpand();
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <div className={`shrink-0 px-4 lg:pr-0 ${isCollapsed ? "pb-2" : "pb-1"}`}>
      <button
        type="button"
        onClick={handleIconClick}
        aria-label="Buka sidebar untuk mencari menu"
        className={`grid size-10 place-items-center rounded-xl border border-line bg-surface text-ink-600 transition-colors hover:border-brand-500 hover:text-brand-600 ${
          isCollapsed ? "hidden lg:grid" : "hidden"
        }`}
      >
        <Search strokeWidth={1.9} className="size-4.5" />
      </button>

      <div className={`relative ${isCollapsed ? "lg:hidden" : ""}`}>
        <Search
          strokeWidth={1.9}
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Cari menu..."
          aria-label="Cari menu navigasi"
          className="w-full rounded-xl border border-line bg-surface py-2.5 pr-10 pl-9 text-sm text-ink-900 transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        <button
          type="button"
          aria-label="Filter menu"
          className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
        >
          <SlidersHorizontal strokeWidth={1.9} className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({
  isMobileOpen,
  isCollapsed,
  onCloseMobile,
  onToggleDesktop,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  const visibleSections = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    if (!keyword) return NAV_SECTIONS;

    return NAV_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.label.toLowerCase().includes(keyword),
      ),
    })).filter((section) => section.items.length > 0);
  }, [searchQuery]);

  return (
    <>
      <div
        onClick={onCloseMobile}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-ink-900/50 transition-opacity duration-300 lg:hidden ${
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-canvas transition-[width,transform] duration-300 ease-out lg:translate-x-0 lg:bg-transparent ${
          isCollapsed ? "w-full lg:w-14" : "w-full lg:w-64"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Navigasi utama"
        aria-hidden={!isMobileOpen}
      >
        <div className="mt-3 flex h-12 shrink-0 items-center justify-between px-4 pb-2 lg:mt-4 lg:pr-0">
          <Logo isCollapsed={isCollapsed} />

          <button
            type="button"
            onClick={onToggleDesktop}
            aria-label="Ciutkan sidebar"
            className={`rounded-lg p-1.5 text-ink-600 transition-colors hover:bg-surface hover:text-brand-600 ${
              isCollapsed ? "hidden" : "hidden lg:inline-flex"
            }`}
          >
            <PanelLeftClose strokeWidth={1.9} className="size-4.5" />
          </button>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Tutup menu navigasi"
            className="rounded-lg p-1.5 text-ink-600 transition-colors hover:bg-surface hover:text-ink-900 lg:hidden"
          >
            <X strokeWidth={1.9} className="size-5" />
          </button>
        </div>

        {isCollapsed && (
          <div className="hidden shrink-0 pb-2 pl-4 lg:block">
            <button
              type="button"
              onClick={onToggleDesktop}
              aria-label="Buka sidebar"
              className="grid size-10 place-items-center rounded-xl text-ink-600 transition-colors hover:bg-surface hover:text-brand-600"
            >
              <PanelLeftOpen strokeWidth={1.9} className="size-4.5" />
            </button>
          </div>
        )}

        <SidebarSearch
          isCollapsed={isCollapsed}
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onExpand={onToggleDesktop}
          inputRef={searchInputRef}
        />

        <nav
          className={`flex-1 overflow-y-auto px-4 lg:pr-0 ${
            isCollapsed ? "space-y-2 pb-4" : "space-y-1 py-4"
          }`}
        >
          {visibleSections.length === 0 ? (
            <p
              className={`px-3 py-6 text-center text-xs text-ink-400 ${
                isCollapsed ? "lg:hidden" : ""
              }`}
            >
              Menu &quot;{searchQuery}&quot; tidak ditemukan
            </p>
          ) : (
            visibleSections.map((section) => (
              <div key={section.label}>
                <p
                  className={`px-3 pb-2 text-[11px] font-semibold tracking-wider text-ink-400 uppercase ${
                    isCollapsed ? "lg:hidden" : ""
                  }`}
                >
                  {section.label}
                </p>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.label}>
                      <NavLink
                        item={item}
                        isCollapsed={isCollapsed}
                        onNavigate={onCloseMobile}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </nav>

        <div
          className={`shrink-0 px-4 lg:pr-0 ${isCollapsed ? "pb-4" : "py-4"}`}
        >
          <ul className="space-y-1">
            {SIDEBAR_FOOTER_ITEMS.map((item) => (
              <li key={item.label}>
                <NavLink
                  item={item}
                  isCollapsed={isCollapsed}
                  onNavigate={onCloseMobile}
                />
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}