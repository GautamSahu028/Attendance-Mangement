import React, { useState, useEffect } from "react";
import { Menu, X, ChevronRight, ChevronLeft } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { SidebarItemType } from "./types";
import { navigationItems } from "./navigation-data";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="fixed top-4 left-4 z-30 md:hidden bg-white p-2 rounded-md shadow-md"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white z-50 transition-all duration-300 ease-in-out shadow-lg
          ${
            isMobile
              ? mobileOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : isOpen
              ? "w-64"
              : "w-20"
          }
          ${className}
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b relative">
          <div
            className={`text-xl font-semibold transition-all duration-200 ${
              !isOpen && !isMobile
                ? "opacity-0 w-0 overflow-hidden"
                : "opacity-100 w-auto"
            }`}
          >
            Dashboard
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer flex-shrink-0"
            aria-label={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isMobile ? (
              <X size={20} />
            ) : isOpen ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
        </div>

        <nav className="p-2 pt-4">
          <ul className="space-y-2">
            {navigationItems.map((item: SidebarItemType) => (
              <SidebarItem
                key={item.id}
                item={item}
                isExpanded={isOpen || isMobile}
              />
            ))}
          </ul>
        </nav>
      </aside>

      {/* Content Padding Adjustment */}
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${isMobile ? "ml-0" : isOpen ? "ml-64" : "ml-20"}
        `}
      />
    </>
  );
};

export default Sidebar;
