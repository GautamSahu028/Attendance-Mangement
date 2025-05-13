import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { SidebarItemType } from "./types";

interface SidebarItemProps {
  item: SidebarItemType;
  isExpanded: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, isExpanded }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = location.pathname === item.path;

  return (
    <li>
      {hasChildren ? (
        <div className="space-y-1">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`
              flex items-center w-full px-3 py-2 rounded-md transition-colors
              ${isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"}
            `}
          >
            <span className="flex items-center">
              <span className="mr-3">{item.icon}</span>
              {isExpanded && (
                <span className="transition-opacity duration-200">
                  {item.label}
                </span>
              )}
            </span>
            {isExpanded && hasChildren && (
              <span className="ml-auto">
                {isOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </span>
            )}
          </button>

          {isExpanded && isOpen && hasChildren && (
            <ul className="pl-8 space-y-1">
              {item.children
                ?.filter((child) => !!child.path)
                .map((child) => (
                  <li key={child.id}>
                    <Link
                      to={child.path as string}
                      className={`
                        block px-3 py-2 rounded-md transition-colors text-sm
                        ${
                          location.pathname === child.path
                            ? "bg-blue-50 text-blue-700"
                            : "hover:bg-gray-100"
                        }
                      `}
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </div>
      ) : (
        <Link
          to={item.path ?? "#"}
          className={`
            flex items-center px-3 py-2 rounded-md transition-colors
            ${isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"}
          `}
        >
          <span className="mr-3">{item.icon}</span>
          {isExpanded && (
            <span className="transition-opacity duration-200">
              {item.label}
            </span>
          )}
        </Link>
      )}
    </li>
  );
};

export default SidebarItem;
