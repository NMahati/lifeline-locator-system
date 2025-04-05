
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Heart, DropletIcon, MapPin, User, Bell, Calendar, LogOut, Home, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, userType, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Home', path: '/', icon: <Home className="mr-2 h-4 w-4" /> },
    { name: 'Blood Requests', path: '/requests', icon: <Heart className="mr-2 h-4 w-4" /> },
    { name: 'Find Blood Banks', path: '/blood-banks', icon: <MapPin className="mr-2 h-4 w-4" /> },
    { name: 'Eligibility Check', path: '/eligibility', icon: <DropletIcon className="mr-2 h-4 w-4" /> },
    { name: 'My Donations', path: '/my-donations', icon: <Calendar className="mr-2 h-4 w-4" /> },
  ];

  // Filter navigation based on user type
  const filteredNavigation = navigation.filter(item => {
    // Hide My Donations for non-donors
    if (item.path === '/my-donations' && userType !== 'donor') {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blood-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <DropletIcon className="h-8 w-8 text-white mr-2" />
            <span className="text-xl font-bold">Lifeline</span>
          </Link>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="flex items-center px-3 py-2 rounded-md hover:bg-blood-700">
                  <User className="h-5 w-5 mr-1" />
                  <span>{user?.name}</span>
                </Link>
                <Button onClick={logout} variant="ghost" className="text-white hover:bg-blood-700">
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:bg-blood-700">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" className="bg-white text-blood-600 hover:bg-gray-100">Register</Button>
                </Link>
              </>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-white">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-4 border-b">
                  <div className="flex items-center">
                    <DropletIcon className="h-6 w-6 text-blood-600 mr-2" />
                    <span className="text-lg font-bold">Lifeline</span>
                  </div>
                  <Button variant="ghost" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <nav className="flex flex-col mt-4 space-y-2">
                  {filteredNavigation.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-md",
                        location.pathname === item.path
                          ? "bg-blood-50 text-blood-600"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                </nav>
                
                <div className="mt-auto border-t py-4">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                      >
                        <User className="h-5 w-5 mr-2" />
                        My Profile
                      </Link>
                      <Button 
                        variant="ghost" 
                        className="flex items-center w-full justify-start px-3 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="h-5 w-5 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">Login</Button>
                      </Link>
                      <Link to="/register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-blood-600 hover:bg-blood-700">Register</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Sidebar and main content for desktop */}
      <div className="flex flex-1">
        {/* Sidebar - only visible on desktop */}
        <aside className="hidden md:block w-64 bg-gray-50 border-r border-gray-200">
          <nav className="p-4 space-y-1">
            {filteredNavigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md",
                  location.pathname === item.path
                    ? "bg-blood-50 text-blood-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="container mx-auto p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
