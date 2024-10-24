import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';

const SNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const location = useLocation();
  const navigate = useNavigate();

  // Sidebar closes automatically when route is changed
  useEffect(() => {
    if (sidebarOpen) setSidebarOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 md:w-64 z-40`}
        style={{ zIndex: 40 }}
      >
        <div className="p-4">
          <h2 className="text-xl pt-2 font-bold cursor-pointer" onClick={() => navigate('/')}>
            Student Panel
          </h2>
          <ul className="mt-6 space-y-4">
            <li>
              <Link
                to="placementDrives"
                className={`block px-4 py-2 hover:bg-gray-700 ${location.pathname.includes('placementDrives') ? 'bg-gray-700' : ''}`}
              >
                Placement Drives
              </Link>
            </li>
            <li>
              <Link
                to="examCenter"
                className={`block px-4 py-2 hover:bg-gray-700 ${location.pathname.includes('examCenter') ? 'bg-gray-700' : ''}`}
              >
                Exam Center
              </Link>
            </li>
            <li>
              <Link
                to="resources"
                className={`block px-4 py-2 hover:bg-gray-700 ${location.pathname.includes('resources') ? 'bg-gray-700' : ''}`}
              >
                Resources
              </Link>
            </li>
            <li>
              <Link
                to="feedback"
                className={`block px-4 py-2 hover:bg-gray-700 ${location.pathname.includes('feedback') ? 'bg-gray-700' : ''}`}
              >
                Feedback
              </Link>
            </li>
            <li>
              <Link
                to="support"
                className={`block px-4 py-2 hover:bg-gray-700 ${location.pathname.includes('support') ? 'bg-gray-700' : ''}`}
              >
                Support
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main content area */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} md:ml-64`}>
        <nav className="bg-gray-900 text-white p-4 flex items-center justify-between md:justify-start">
          <button className="md:hidden text-white" onClick={toggleSidebar}>
            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <div className="flex-1 flex justify-center">
            <span>Welcome to TNP Portal Charusat</span>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="flex items-center text-white">
              <FaUserCircle size={40} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-gray-800 shadow-lg rounded-lg w-48 z-50">
                <ul>
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SNavbar;
