import React, { useState,} from "react";
import { Menu, Moon, Sun, User} from "lucide-react";
import { useProfileQuery } from "../../redux/features/auth/authApi";

interface TopNavigationProps {
  onToggleSidebar: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  collapsed?: boolean;
  onToggle?: boolean;
}


const TopNavigation: React.FC<TopNavigationProps> = ({
  onToggleSidebar,
  darkMode,
  onToggleDarkMode,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const {data: profile} = useProfileQuery("")

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
          {/* Profile dropdown */}
          <div className="flex items-center space-x-2 pl-2 relative cursor-pointer">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-slate-900">{profile?.data?.name}</p>
              <p className="text-xs text-slate-500">{profile?.data?.email}</p>
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
