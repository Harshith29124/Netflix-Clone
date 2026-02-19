import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

// Higher-order component to protect the Home route
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        // Redirect to login if user is not authenticated
        return <Navigate to="/login" replace />;
    }
    return children;
};

// Component to handle redirection if user is already logged in
const PublicRoute = ({ children }) => {
    const { user } = useAuth();
    if (user) {
        // Redirect to home if user is already logged in
        return <Navigate to="/" replace />;
    }
    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <PublicRoute>
                                    <Register />
                                </PublicRoute>
                            }
                        />
                        {/* Fallback for 404s */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;

