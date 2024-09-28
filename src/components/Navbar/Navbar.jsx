import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const { user, role, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-blue-500 text-white p-4">
            <div className="container mx-auto flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold">
                    Training & Placement
                </Link>
                <div className="flex items-center space-x-4">
                    <Link to="/" className="hover:underline">Home</Link>
                    {!user ? (
                        <>
                            <Link to="/login" className="hover:underline">Login</Link>
                            <Link to="/signup" className="hover:underline">Sign Up</Link>
                        </>
                    ) : (
                        <>
                            {role === 'student' && <Link to="/student-dashboard" className="hover:underline">Student Dashboard</Link>}
                            {role === 'faculty' && <Link to="/faculty-dashboard" className="hover:underline">Faculty Dashboard</Link>}
                            {role === 'company' && <Link to="/company-dashboard" className="hover:underline">Company Dashboard</Link>}
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 p-2 rounded-full"
                                >
                                    <span>Profile</span>
                                </button>
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
                                        <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
