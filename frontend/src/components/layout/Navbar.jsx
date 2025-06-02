import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Menu, 
  X, 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Home, 
  Users, 
  Stethoscope, 
  ShoppingCart, 
  MessageCircle, 
  PlusCircle,
  ChevronDown,
  Shield
} from 'lucide-react';

const Navbar = ({ 
  isAuthenticated = false, 
  userRole = 'user', // 'user', 'vet', 'admin'
  userName = 'John Doe',
  userAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
  cartCount = 3,
  notificationCount = 5,
  onLogin,
  onLogout,
  onSearch,
  currentPage = 'home' // for active state
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false);
      setActiveDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Home', href: '/', icon: Home, key: 'home' },
      { 
        name: 'Adopt', 
        href: '/adopt', 
        icon: Heart, 
        key: 'adopt',
        dropdown: [
          { name: 'Browse Pets', href: '/adopt/browse' },
          { name: 'Post Pet', href: '/adopt/post' },
          { name: 'My Listings', href: '/adopt/my-listings' },
          { name: 'Adoption Requests', href: '/adopt/requests' }
        ]
      },
      { 
        name: 'Care Services', 
        href: '/care', 
        icon: Users, 
        key: 'care',
        dropdown: [
          { name: 'Find Care', href: '/care/browse' },
          { name: 'Become Provider', href: '/care/register' },
          { name: 'My Bookings', href: '/care/bookings' }
        ]
      },
      { name: 'Shop', href: '/shop', icon: ShoppingCart, key: 'shop' }
    ];

    if (userRole === 'vet') {
      baseItems.splice(2, 0, {
        name: 'Vet Portal',
        href: '/vet',
        icon: Stethoscope,
        key: 'vet',
        dropdown: [
          { name: 'My Patients', href: '/vet/patients' },
          { name: 'Appointments', href: '/vet/appointments' },
          { name: 'Medical Records', href: '/vet/records' },
          { name: 'Reminders', href: '/vet/reminders' }
        ]
      });
    }

    if (userRole === 'admin') {
      baseItems.push({
        name: 'Admin',
        href: '/admin',
        icon: Shield,
        key: 'admin',
        dropdown: [
          { name: 'Dashboard', href: '/admin/dashboard' },
          { name: 'Users', href: '/admin/users' },
          { name: 'Reports', href: '/admin/reports' },
          { name: 'Settings', href: '/admin/settings' }
        ]
      });
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const DropdownMenu = ({ items, isOpen }) => (
    <div className={`absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 transform transition-all duration-200 ${
      isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
    }`}>
      {items.map((item, index) => (
        <a
          key={index}
          href={item.href}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors"
        >
          {item.name}
        </a>
      ))}
    </div>
  );

  const UserMenu = () => (
    <div className={`absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 transform transition-all duration-200 ${
      isUserMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
    }`}>
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <img src={userAvatar} alt={userName} className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold text-gray-800">{userName}</p>
            <p className="text-sm text-gray-500 capitalize">{userRole} Account</p>
          </div>
        </div>
      </div>
      
      <div className="py-2">
        <a href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors">
          <User className="h-4 w-4 mr-3" />
          My Profile
        </a>
        <a href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors">
          <Settings className="h-4 w-4 mr-3" />
          Settings
        </a>
        <a href="/messages" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors">
          <MessageCircle className="h-4 w-4 mr-3" />
          Messages
        </a>
        <div className="border-t border-gray-100 mt-2 pt-2">
          <button 
            onClick={onLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
        : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="mr-2 px-4 ">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex">
            <Heart className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              PetCare
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <div key={item.key} className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.dropdown) {
                      setActiveDropdown(activeDropdown === item.key ? null : item.key);
                    }
                  }}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === item.key
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                  {item.dropdown && <ChevronDown className="h-4 w-4 ml-1" />}
                </button>
                
                {item.dropdown && (
                  <DropdownMenu 
                    items={item.dropdown} 
                    isOpen={activeDropdown === item.key} 
                  />
                )}
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center max-w-md mx-4 flex-1">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search pets, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Quick Actions */}
                <button className="hidden md:flex items-center px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium hover:scale-105 transform transition-all">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Post Pet
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-full transition-colors">
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Shopping Cart */}
                <div className="relative">
                  <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-full transition-colors">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsUserMenuOpen(!isUserMenuOpen);
                    }}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-8 h-8 rounded-full border-2 border-gray-200"
                    />
                    <ChevronDown className="h-4 w-4 text-gray-500 hidden sm:block" />
                  </button>
                  <UserMenu />
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={onLogin}
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={onLogin}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-medium hover:scale-105 transform transition-all shadow-lg"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-screen pb-4' : 'max-h-0'
        }`}>
          {/* Mobile Search */}
          <div className="px-4 py-3 border-t border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search pets, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Mobile Navigation Items */}
          <div className="px-4 py-2 space-y-1">
            {navigationItems.map((item) => (
              <div key={item.key}>
                <a
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === item.key
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.name}
                </a>
                {/* Mobile Dropdown Items */}
                {item.dropdown && (
                  <div className="ml-7 mt-1 space-y-1">
                    {item.dropdown.map((subItem, subIndex) => (
                      <a
                        key={subIndex}
                        href={subItem.href}
                        className="block px-3 py-1 text-sm text-gray-600 hover:text-purple-600 hover:bg-gray-50 rounded"
                      >
                        {subItem.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile User Section */}
          {isAuthenticated && (
            <div className="px-4 py-3 border-t border-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <img src={userAvatar} alt={userName} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-semibold text-gray-800">{userName}</p>
                  <p className="text-sm text-gray-500 capitalize">{userRole} Account</p>
                </div>
              </div>
              <div className="space-y-1">
                <a href="/profile" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                  <User className="h-4 w-4 mr-3" />
                  My Profile
                </a>
                <a href="/settings" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </a>
                <button 
                  onClick={onLogout}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;