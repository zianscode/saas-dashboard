import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import useMediaQuery from "../../hooks/useMediaQuery";

export default function AppLayout({ children }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    useState(false);

  const isDesktopViewport = useMediaQuery("(min-width: 1024px)");
  const isCollapsed = isDesktopViewport && isDesktopSidebarCollapsed;
  const isDrawerOpen = isMobileSidebarOpen && !isDesktopViewport;

  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsMobileSidebarOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  return (
    <div className="min-h-screen bg-canvas">
      <div
        className={`transition-[padding] duration-300 ease-out ${
          isCollapsed ? "lg:pl-14 lg:ps-4" : "lg:pl-64 lg:ps-4"
        }`}
      >
        <div className="flex min-h-screen flex-col p-3 lg:pt-4 lg:pr-4 lg:pb-4">
          <div className="flex flex-1 flex-col rounded-2xl bg-surface shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
            <Topbar onToggleMobile={() => setIsMobileSidebarOpen(true)} />

            <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-6">
              {children}
            </div>
          </div>
        </div>
      </div>

      <Sidebar
        isMobileOpen={isDrawerOpen}
        isCollapsed={isCollapsed}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onToggleDesktop={() =>
          setIsDesktopSidebarCollapsed((collapsed) => !collapsed)
        }
      />
    </div>
  );
}
