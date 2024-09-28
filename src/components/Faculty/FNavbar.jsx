import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import ProfilePopup from './ProfilePopup';

const FNavbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const togglePopup = () => setPopupOpen(!popupOpen);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to the faculty path when the page loads or is refreshed
        if (!['/faculty/addplacementDrives', '/faculty/addexam', '/faculty/addresources', '/faculty/student'].includes(location.pathname)) {
            navigate('/faculty');
        }
    }, [location.pathname, navigate]);

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
                className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } transition-transform duration-300 ease-in-out md:translate-x-0 md:w-64 z-40`}
                style={{ zIndex: 40 }}
            >
                <div className="p-4">
                    <h2
                        className="text-xl pt-2 font-bold cursor-pointer"
                        onClick={() => navigate('/faculty')}  // Link to ChartPage when "Faculty Panel" is clicked
                    >
                        Faculty Panel
                    </h2>

                    <ul className="mt-6 space-y-4">
                        <li>
                            <Link
                                to="/faculty"
                                className={`block px-4 py-2 hover:bg-gray-700 ${location.pathname === '/faculty' ? 'bg-gray-700' : ''}`}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/faculty/addplacementDrives"
                                className={`block px-4 py-2 hover:bg-gray-700 ${location.pathname.includes('addplacementDrives') ? 'bg-gray-700' : ''}`}
                            >
                                Add Placement
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/faculty/addexam"
                                className={`block px-4 py-2 hover:bg-gray-700 ${location.pathname.includes('addexam') ? 'bg-gray-700' : ''}`}
                            >
                                Add Exam
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/faculty/addresources"
                                className={`block px-4 py-2 hover:bg-gray-700 ${location.pathname.includes('addresources') ? 'bg-gray-700' : ''}`}
                            >
                                Add Resources
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/faculty/student"
                                className={`block px-4 py-2 hover:bg-gray-700 ${location.pathname.includes('student') ? 'bg-gray-700' : ''}`}
                            >
                                Student Corner
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Overlay for Sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main content area */}
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} md:ml-64`}>
                {/* Navbar */}
                <nav className="bg-gray-900 text-white p-4 flex items-center justify-between md:justify-start">
                    <button
                        className="md:hidden text-white"
                        onClick={toggleSidebar}
                    >
                        {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                    <div className="flex-1 flex justify-center">
                        <span>Welcome to Faculty Panel</span>
                    </div>
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={toggleDropdown} className="flex items-center text-white">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="rounded-full w-10 h-10 object-cover"
                                />
                            ) : (
                                <FaUserCircle size={40} />
                            )}
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-lg">
                                <ul>
                                    <li>
                                        <button
                                            onClick={() => {
                                                togglePopup();
                                                setDropdownOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                        >
                                            Profile
                                        </button>
                                    </li>
                                    <li>
                                        <Link to="/" className="block px-4 py-2 hover:bg-gray-200">
                                            Log Out
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Profile Popup */}
                {popupOpen && <ProfilePopup onClose={togglePopup} />}

                {/* Main content area */}
                <div className="p-8">
                    <Outlet /> {/* This is where the nested route content will be displayed */}
                </div>
            </div>
        </div>
    );
};

export default FNavbar;
