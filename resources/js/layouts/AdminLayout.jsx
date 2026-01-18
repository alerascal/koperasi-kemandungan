import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

export default function AdminLayout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Navigation */}
            <nav className="bg-white shadow-lg">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/admin" className="text-2xl font-bold text-blue-600">
                            Admin Panel
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link to="/" className="text-gray-700 hover:text-blue-600">
                                Lihat Website
                            </Link>
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-700">{user?.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-lg min-h-screen">
                    <nav className="p-4">
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/admin"
                                    className="block px-4 py-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600"
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/categories"
                                    className="block px-4 py-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600"
                                >
                                    Kategori
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/products"
                                    className="block px-4 py-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600"
                                >
                                    Produk
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/orders"
                                    className="block px-4 py-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600"
                                >
                                    Pesanan
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/news"
                                    className="block px-4 py-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600"
                                >
                                    Berita
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/users"
                                    className="block px-4 py-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600"
                                >
                                    Users
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}