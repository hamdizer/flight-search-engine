import {
  Plane,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
} from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/helpers";

export interface HeaderProps {
  onMenuClick?: () => void;
  showSearch?: boolean;
  sticky?: boolean;
  transparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  showSearch = false,
  sticky = true,
  transparent = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "border-b border-gray-200 z-40",
        sticky && "sticky top-0",
        transparent ? "bg-white/95 backdrop-blur-sm" : "bg-white",
        "shadow-sm",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {import.meta.env.VITE_APP_NAME}
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Find your perfect flight
                </p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-6">
              <a
                href="#flights"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Flights
              </a>
              <a
                href="#hotels"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Hotels
              </a>
              <a
                href="#car-rental"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Car Rental
              </a>
              <a
                href="#deals"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Deals
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {showSearch && (
              <button className="hidden md:flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Search className="w-4 h-4" />
                <span>Search...</span>
              </button>
            )}

            <button className="hidden md:block relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="hidden md:block relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      John Doe
                    </p>
                    <p className="text-xs text-gray-500">john@example.com</p>
                  </div>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 animate-slide-down">
            <nav className="space-y-2">
              <a
                href="#flights"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Flights
              </a>
              <a
                href="#hotels"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Hotels
              </a>
              <a
                href="#car-rental"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Car Rental
              </a>
              <a
                href="#deals"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Deals
              </a>
            </nav>
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2">
                <User className="w-4 h-4" />
                My Profile
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export const MinimalHeader: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {import.meta.env.VITE_APP_NAME}
            </h1>
            <p className="text-xs text-gray-500">Find your perfect flight</p>
          </div>
        </div>
      </div>
    </header>
  );
};
