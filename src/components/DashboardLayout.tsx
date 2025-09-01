import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  LogOut, 
  ChevronRight,
  Settings,
  User,
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  FileText,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavigationItems = () => {
    const commonItems = [
      { path: '/dashboard', label: 'Dashboard', icon: Home }
    ];

    switch (user?.role) {
      case 'admin':
        return [
          ...commonItems,
          { path: '/dashboard/users', label: 'Users', icon: Users },
          { path: '/dashboard/programs', label: 'Programs', icon: BookOpen },
          { path: '/dashboard/attendance', label: 'Attendance', icon: BarChart3 },
          { path: '/dashboard/settings', label: 'Settings', icon: Settings }
        ];
      
      case 'trainer':
        return [
          ...commonItems,
          { path: '/dashboard/sessions', label: 'Sessions', icon: Calendar },
          { path: '/dashboard/assignments', label: 'Assignments', icon: FileText },
          { path: '/dashboard/attendance', label: 'Attendance', icon: UserCheck },
          { path: '/dashboard/participants', label: 'Participants', icon: Users }
        ];
      
      case 'participant':
        return [
          ...commonItems,
          { path: '/dashboard/my-trainings', label: 'My Trainings', icon: BookOpen },
          { path: '/dashboard/assignments', label: 'Assignments', icon: FileText },
          { path: '/dashboard/attendance', label: 'Attendance', icon: Calendar },
          { path: '/dashboard/progress', label: 'Progress', icon: BarChart3 }
        ];
      
      default:
        return commonItems;
    }
  };

  const navigationItems = getNavigationItems();

  const getBreadcrumb = () => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const breadcrumbItems = [
      { label: 'Dashboard', path: '/dashboard' }
    ];

    if (pathParts.length > 1) {
      const currentPath = pathParts[1];
      const navItem = navigationItems.find(item => item.path.includes(currentPath));
      if (navItem) {
        breadcrumbItems.push({ label: navItem.label, path: location.pathname });
      }
    }

    return breadcrumbItems;
  };

  const breadcrumbItems = getBreadcrumb();

  return (
    <div className="min-h-screen bg-primary flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">BB</span>
            </div>
            <span className="font-bold text-text">BBPVP</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-text">{user?.name}</p>
              <p className="text-sm text-text/60 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-secondary text-white'
                    : 'text-text hover:bg-gray-100'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <IconComponent className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-3 py-2 text-text hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 mr-2"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2">
                {breadcrumbItems.map((item, index) => (
                  <div key={item.path} className="flex items-center">
                    {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />}
                    <Link
                      to={item.path}
                      className={`text-sm font-medium ${
                        index === breadcrumbItems.length - 1
                          ? 'text-secondary'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </div>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-text">{user?.name}</p>
                <p className="text-xs text-text/60 capitalize">{user?.role}</p>
              </div>
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}