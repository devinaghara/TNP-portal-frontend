import React, { createContext, useState, useContext } from 'react';

// Create Context
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    const login = (userData, userRole) => {
        setUser(userData);
        setRole(userRole);
    };

    const logout = () => {
        setUser(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ user, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to use AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
