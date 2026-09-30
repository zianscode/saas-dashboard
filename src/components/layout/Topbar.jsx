import { useEffect, useRef, useState } from "react";
import {
  PanelLeft,
  CircleHelp,
  Sun,
  Moon,
  Bell,
  ChevronsUpDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const ICON_BUTTON =
  "rounded-lg border border-line bg-surface p-2 text-ink-600 transition-colors hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600";

const MENU_ITEM =
  "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm text-ink-600 transition-colors hover:bg-surface-muted hover:text-ink-900";

export default function Topbar({ onToggleMobile }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    if (!isProfileMenuOpen) return;

    const handlePointerDown = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsProfileMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileMenuOpen]);

  const closeProfileMenu = () => setIsProfileMenuOpen(false);

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 px-4 sm:px-6">
      <button
        type="button"
        onClick={onToggleMobile}
        aria-label="Buka menu navigasi"
        className="-ml-2 rounded-lg border border-line bg-surface p-2 text-ink-600 transition-colors hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600 lg:hidden"
      >
        <PanelLeft strokeWidth={1.8} className="size-5" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold text-ink-900 sm:text-xl">
          Welcome back, Fajar
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <div className="hidden items-center gap-1 sm:flex">
          <button
            type="button"
            aria-label="Bantuan"
            title="Bantuan"
            className={ICON_BUTTON}
          >
            <CircleHelp strokeWidth={1.8} className="size-4.75" />
          </button>

          <button
            type="button"
            onClick={() => setIsDarkMode((dark) => !dark)}
            aria-label={
              isDarkMode ? "Aktifkan mode terang" : "Aktifkan mode gelap"
            }
            title="Tema"
            className={ICON_BUTTON}
          >
            {isDarkMode ? (
              <Sun strokeWidth={1.8} className="size-4.75" />
            ) : (
              <Moon strokeWidth={1.8} className="size-4.75" />
            )}
          </button>

          <button
            type="button"
            aria-label="Notifikasi"
            title="Notifikasi"
            className={`relative ${ICON_BUTTON}`}
          >
            <Bell strokeWidth={1.8} className="size-4.75" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-brand-500 ring-2 ring-surface" />
          </button>
        </div>

        <span
          aria-hidden="true"
          className="mx-1 hidden h-6 w-px bg-line sm:block"
        />

        <div ref={profileMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((open) => !open)}
            aria-expanded={isProfileMenuOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2.5 rounded-xl border border-transparent p-1 pr-2 transition-colors hover:border-line hover:bg-surface-muted"
          >
            <img
              src="/profile.jpg"
              alt="Fajar Fauzian"
              className="size-8 shrink-0 rounded-full object-cover ring-1 ring-line"
            />
            <span className="hidden text-left sm:block">
              <span className="block text-xs font-semibold text-ink-900">
                Fajar Fauzian
              </span>
              <span className="block text-[11px] text-ink-400">
                fajarfauzian@gmail.com
              </span>
            </span>
            <ChevronsUpDown
              strokeWidth={1.8}
              className={`size-4 shrink-0 text-ink-400 transition-transform duration-200 ${
                isProfileMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isProfileMenuOpen && (
            <div
              role="menu"
              className="absolute top-[calc(100%+8px)] right-0 z-50 w-60 origin-top-right overflow-hidden rounded-card border border-line bg-surface p-1.5 shadow-float"
            >
              <div className="flex items-center gap-3 rounded-lg px-2.5 py-2.5">
                <img
                  src="/profile.jpg"
                  alt=""
                  className="size-10 shrink-0 rounded-full object-cover ring-1 ring-line"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ink-900">
                    Fajar Fauzian
                  </span>
                  <span className="block truncate text-xs text-ink-400">
                    fajarfauzian@gmail.com
                  </span>
                </span>
              </div>

              <span
                aria-hidden="true"
                className="mx-1 my-1 block h-px bg-line"
              />

              <button
                type="button"
                role="menuitem"
                className={`${MENU_ITEM} sm:hidden`}
              >
                <CircleHelp
                  strokeWidth={1.9}
                  className="size-4.5 shrink-0 text-ink-400"
                />
                Bantuan
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => setIsDarkMode((dark) => !dark)}
                className={`${MENU_ITEM} sm:hidden`}
              >
                {isDarkMode ? (
                  <Sun
                    strokeWidth={1.9}
                    className="size-4.5 shrink-0 text-ink-400"
                  />
                ) : (
                  <Moon
                    strokeWidth={1.9}
                    className="size-4.5 shrink-0 text-ink-400"
                  />
                )}
                Tema
                <span className="ml-auto text-xs text-ink-400">
                  {isDarkMode ? "Gelap" : "Terang"}
                </span>
              </button>

              <button
                type="button"
                role="menuitem"
                className={`${MENU_ITEM} sm:hidden`}
              >
                <Bell
                  strokeWidth={1.9}
                  className="size-4.5 shrink-0 text-ink-400"
                />
                Notifikasi
                <span className="ml-auto rounded-full bg-brand-100 px-1.5 py-0.5 text-[11px] font-semibold text-brand-700">
                  3
                </span>
              </button>

              <span
                aria-hidden="true"
                className="mx-1 my-1 block h-px bg-line sm:hidden"
              />

              <button type="button" role="menuitem" className={MENU_ITEM}>
                <User
                  strokeWidth={1.9}
                  className="size-4.5 shrink-0 text-ink-400"
                />
                Profil saya
              </button>

              <button type="button" role="menuitem" className={MENU_ITEM}>
                <Settings
                  strokeWidth={1.9}
                  className="size-4.5 shrink-0 text-ink-400"
                />
                Pengaturan
              </button>

              <span
                aria-hidden="true"
                className="mx-1 my-1 block h-px bg-line"
              />

              <button
                type="button"
                role="menuitem"
                onClick={closeProfileMenu}
                className={`${MENU_ITEM} text-red-600 hover:bg-red-50 hover:text-red-700`}
              >
                <LogOut strokeWidth={1.9} className="size-4.5 shrink-0" />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}