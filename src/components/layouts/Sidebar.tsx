import React, { useState } from "react";
import {
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Gauge,
  Wallet,
  CalendarRange,
  BookOpenCheck,
  Brain,
  FileQuestion,
} from "lucide-react";
import { useNavigate } from "react-router";

// ---------- Types ----------
interface SubMenuItem {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  subMenu?: SubMenuItem[]; // optional
}

interface SidebarProps {
  collapsed: boolean;
  isMobile: boolean;
  onClose: () => void;
  onToggle: () => void;
}

// ---------- Component ----------
const Sidebar: React.FC<SidebarProps> = ({ collapsed, isMobile, onClose }) => {
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const navigate = useNavigate();



const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  {
    icon: Wallet,
    label: "Budget Tracker",
    path: "/budget-tracker",
  },
  {
    icon: CalendarRange,
    label: "Schedule",
    path: "/schedule-tracker",
  },
  {
    icon: BookOpenCheck,
    label: "Study Planner",
    path: "/study-planner",
  },
  {
    icon: Brain, 
    label: "Study Assistant",
    path: "/study-assistant",
  },
  {
    icon: FileQuestion,
    label: "Quiz Generator",
    path: "/quiz-generator",
  }
];


  return (
    <aside
      className={`sidebar-gradient fixed top-0 left-0 z-40 h-screen transition-all duration-500 ease-in-out ${collapsed ? (isMobile ? "-translate-x-full" : "w-16") : "w-64"
        } shadow-2xl`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center animate-slide-in space-x-3">
            <div
              className={`shadow-md font-semibold select-none ${collapsed ? "h-6 w-6 text-2xl" : ""
                } drop-shadow-sm text-white`}
            >
              {collapsed ? <Gauge /> : ""}
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="text-xl font-bold text-white drop-shadow-sm leading-none">
                  Brain <span className="text-blue-400">Sync</span>
                </h1>
                <p className="text-xs text-white/60 mt-0.5">
                  Current version: v1.0.0
                </p>
              </div>
            )}
          </div>

          {isMobile && (
            <button
              onClick={onClose}
              aria-label="Close sidebar"
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-5 overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            {menuItems.map((item, index) => {
              const hasSubMenu = Array.isArray(item.subMenu);
              const isOpen = openSubMenu === item.label;

              return (
                <div
                  key={item.label}
                  className="animate-slide-in"
                  style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                >
                  {/* Main Menu */}
                  <div
                    className={`nav-link flex items-center px-5 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden cursor-pointer text-white hover:bg-slate-600 hover:shadow-md ${collapsed ? "justify-center" : "justify-start"
                      }`}
                    onClick={() => {
                      if (hasSubMenu) {
                        setOpenSubMenu(isOpen ? null : item.label);
                      } else {
                        navigate(item.path);
                      }
                    }}
                  >
                    <div className="flex items-center flex-shrink-0 text-white transition-colors duration-300">
                      <item.icon
                        className={`${collapsed ? "h-5 w-6" : "h-4 w-5"
                          } drop-shadow-sm`}
                      />
                    </div>

                    {!collapsed && (
                      <>
                        <span className="ml-4 font-semibold text-sm tracking-wide truncate">
                          {item.label}
                        </span>
                        {hasSubMenu && (
                          <ChevronRight
                            className={`w-4 h-4 ml-auto transition-transform duration-300 transform ${isOpen
                              ? "rotate-90 text-white"
                              : "text-white/60"
                              }`}
                          />
                        )}
                      </>
                    )}
                  </div>

                  {/* Submenu */}
                  {!collapsed &&
                    hasSubMenu &&
                    isOpen &&
                    item.subMenu &&
                    item.subMenu.map((subItem, subIndex) => {
                      const Icon = subItem.icon;
                      return (
                        <div
                          key={subItem.label}
                          className={`ml-4 mt-1 nav-link flex items-center px-5 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden cursor-pointer text-white hover:bg-slate-600 hover:shadow-md ${collapsed ? "justify-center" : "justify-start"
                            }`}
                          style={{
                            animationDelay: `${(subIndex + 1) * 0.1}s`,
                          }}
                          onClick={() => navigate(subItem.path)}
                        >
                          {Icon && (
                            <Icon
                              className={`${collapsed ? "h-5 w-6" : "h-4 w-5"
                                } drop-shadow-sm`}
                            />
                          )}
                          {!collapsed && (
                            <span className="ml-4 font-semibold text-sm tracking-wide truncate">
                              {subItem.label}
                            </span>
                          )}
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-600">
          <div
            className={`nav-link flex items-center px-4 py-3.5 rounded-2xl text-white/70 hover:text-white hover:bg-red-500/20 hover:border-red-400/30 border border-transparent transition-all duration-300 animate-slide-in group ${collapsed ? "justify-center" : "justify-start"
              }`}
            style={{ animationDelay: "0.8s" }}
            onClick={() => navigate("/logout")}
          >
            <LogOut
              className={`flex-shrink-0 ${collapsed ? "h-5 w-5" : "h-4 w-4"
                } drop-shadow-sm group-hover:text-red-300 transition-colors duration-300`}
            />
            {!collapsed && (
              <span className="ml-4 font-semibold text-sm tracking-wide">
                Logout
              </span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
