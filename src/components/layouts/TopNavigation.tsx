import React, { useState, useRef, useEffect } from "react";
import { Menu, Bell, Moon, Sun, User, ChevronDown } from "lucide-react";

interface TopNavigationProps {
  onToggleSidebar: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  collapsed?: boolean;
  onToggle?: boolean;
}

const languages = [
  { code: "en", label: "EN" },
  { code: "bn", label: "বাংলা" },
  { code: "hi", label: "हिन्दी" },
  { code: "es", label: "ES" },
];

const TopNavigation: React.FC<TopNavigationProps> = ({
  onToggleSidebar,
  darkMode,
  onToggleDarkMode,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const langRef = useRef<HTMLDivElement>(null);

  // Close language dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectLanguage = (lang: typeof languages[0]) => {
    setSelectedLang(lang);
    setIsLangOpen(false);
  };

  return (
    <header className="glass-nav sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-600 cursor-pointer hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3 relative">
          {/* Language dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center space-x-1 px-3 py-1 border border-slate-300 rounded-md text-sm text-slate-700 hover:bg-slate-100 transition"
              aria-haspopup="listbox"
              aria-expanded={isLangOpen}
              aria-label="Select Language"
            >
              <span>{selectedLang.label}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isLangOpen && (
              <ul
                className="absolute right-0 mt-2 w-28 bg-white border border-slate-300 rounded-md shadow-lg z-50"
                role="listbox"
                tabIndex={-1}
              >
                {languages.map((lang) => (
                  <li
                    key={lang.code}
                    role="option"
                    aria-selected={selectedLang.code === lang.code}
                    className={`cursor-pointer px-4 py-2 hover:bg-blue-100 ${
                      selectedLang.code === lang.code
                        ? "font-semibold bg-blue-50"
                        : ""
                    }`}
                    onClick={() => selectLanguage(lang)}
                  >
                    {lang.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-slate-600 cursor-pointer hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              className="p-2 cursor-pointer text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              3
            </span>
          </div>

          {/* Profile dropdown */}
          <div className="flex items-center space-x-2 pl-2 relative cursor-pointer">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-slate-900">SUPER ADMIN</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-lg transition-all duration-200"
              aria-haspopup="true"
              aria-expanded={isProfileOpen}
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
