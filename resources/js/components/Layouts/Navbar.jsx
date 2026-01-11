// resources/js/Components/Layout/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { useCart } from '../../Context/CartContext';

export default function Navbar() {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const { getItemCount } = useCart();
    const navigate = useNavigate();
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <span className="text-2xl font-bold text-blue-600">Koperasi</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-gray-700 hover:text-blue-600">
                            Home
                        </Link>
                        <Link to="/products" className="text-gray-700 hover:text-blue-600">
                            Produk
                        </Link>
                        <Link to="/news" className="text-gray-700 hover:text-blue-600">
                            Berita
                        </Link>
                        
                        {isAuthenticated && (
                            <>
                                <Link to="/savings" className="text-gray-700 hover:text-blue-600">
                                    Tabungan
                                </Link>
                                <Link to="/deposits" className="text-gray-700 hover:text-blue-600">
                                    Deposito
                                </Link>
                                <Link to="/orders" className="text-gray-700 hover:text-blue-600">
                                    Pesanan
                                </Link>
                            </>
                        )}

                        {isAdmin && (
                            <Link to="/admin" className="text-gray-700 hover:text-blue-600">
                                Admin
                            </Link>
                        )}

                        {/* Cart Icon */}
                        <Link to="/cart" className="relative">
                            <svg className="w-6 h-6 text-gray-700 hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {getItemCount() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {getItemCount()}
                                </span>
                            )}
                        </Link>

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2"
                                >
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                        <div className="px-4 py-2 border-b">
                                            <p className="font-semibold">{user?.name}</p>
                                            <p className="text-sm text-gray-600">{user?.email}</p>
                                        </div>
                                        <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="md:hidden"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div className="md:hidden pb-4">
                        <Link to="/" className="block py-2 text-gray-700 hover:text-blue-600">
                            Home
                        </Link>
                        <Link to="/products" className="block py-2 text-gray-700 hover:text-blue-600">
                            Produk
                        </Link>
                        <Link to="/news" className="block py-2 text-gray-700 hover:text-blue-600">
                            Berita
                        </Link>
                        
                        {isAuthenticated && (
                            <>
                                <Link to="/savings" className="block py-2 text-gray-700 hover:text-blue-600">
                                    Tabungan
                                </Link>
                                <Link to="/deposits" className="block py-2 text-gray-700 hover:text-blue-600">
                                    Deposito
                                </Link>
                                <Link to="/orders" className="block py-2 text-gray-700 hover:text-blue-600">
                                    Pesanan
                                </Link>
                                {isAdmin && (
                                    <Link to="/admin" className="block py-2 text-gray-700 hover:text-blue-600">
                                        Admin
                                    </Link>
                                )}
                                <Link to="/cart" className="block py-2 text-gray-700 hover:text-blue-600">
                                    Keranjang ({getItemCount()})
                                </Link>
                                <Link to="/profile" className="block py-2 text-gray-700 hover:text-blue-600">
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left py-2 text-red-600"
                                >
                                    Logout
                                </button>
                            </>
                        )}

                        {!isAuthenticated && (
                            <>
                                <Link to="/login" className="block py-2 text-gray-700 hover:text-blue-600">
                                    Login
                                </Link>
                                <Link to="/register" className="block py-2 text-gray-700 hover:text-blue-600">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}

