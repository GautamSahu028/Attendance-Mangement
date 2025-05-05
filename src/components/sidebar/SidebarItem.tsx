import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SidebarItemType } from "./types";

interface SidebarItemProps {
  item: SidebarItemType;
  isExpanded: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, isExpanded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const toggleOpen = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <li>
      <div
        className={`
          flex items-center p-2 rounded-md cursor-pointer
          ${item.active ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"} 
          transition-colors duration-200
        `}
        onClick={toggleOpen}
      >
        {item.icon && (
          <div className="mr-2">
            {React.cloneElement(item.icon, {
              size: 20,
              className: item.active ? "text-blue-700" : "text-gray-600",
            })}
          </div>
        )}

        {isExpanded && (
          <div className="flex justify-between items-center w-full">
            <span
              className={`text-sm font-medium ${
                item.active ? "text-blue-700" : "text-gray-700"
              }`}
            >
              {item.label}
            </span>

            {hasChildren && (
              <div className="ml-auto">
                {isOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Render children if expanded and open */}
      {hasChildren && isOpen && isExpanded && (
        <ul className="ml-6 mt-1 space-y-1">
          {(item.children ?? []).map((child) => (
            <SidebarItem key={child.id} item={child} isExpanded={isExpanded} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default SidebarItem;
