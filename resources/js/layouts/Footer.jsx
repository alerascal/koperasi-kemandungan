import React from 'react';
import { Link, router } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Koperasi</h3>
                        <p className="text-gray-400">
                            Platform e-commerce koperasi dengan sistem tabungan dan deposito yang terpercaya.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Menu</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-white">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-gray-400 hover:text-white">
                                    Produk
                                </Link>
                            </li>
                            <li>
                                <Link to="/news" className="text-gray-400 hover:text-white">
                                    Berita
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Layanan</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/savings" className="text-gray-400 hover:text-white">
                                    Tabungan
                                </Link>
                            </li>
                            <li>
                                <Link to="/deposits" className="text-gray-400 hover:text-white">
                                    Deposito
                                </Link>
                            </li>
                            <li>
                                <Link to="/orders" className="text-gray-400 hover:text-white">
                                    Pesanan
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Kontak</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>Email: info@koperasi.com</li>
                            <li>Phone: (021) 1234-5678</li>
                            <li>Alamat: Jl. Koperasi No. 123</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 Sistem Koperasi. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}