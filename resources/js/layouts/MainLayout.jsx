// resources/js/Components/Layout/MainLayout.jsx
import React from 'react';
import Navbar from './Navbar'; // asumsikan Navbar sudah dipindah ke component terpisah
import Footer from './Footer';

export default function MainLayout({ children, className = '', noPadding = false }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Subtle noise/grain background untuk luxury feel */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.02] dark:opacity-[0.04] mix-blend-soft-light">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#1f2937_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
      </div>

      <Navbar />

      <main className={`
        flex-1 
        ${noPadding ? '' : 'pt-10 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24'}
        ${className}
      `}>
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}