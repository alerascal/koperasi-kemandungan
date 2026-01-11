// ==============================================
// resources/js/Components/Layout/MainLayout.jsx
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 bg-gray-50">
                {children}
            </main>
            <Footer />
        </div>
    );
}