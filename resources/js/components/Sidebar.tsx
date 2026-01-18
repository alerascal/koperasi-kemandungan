// resources/js/components/Sidebar.tsx
import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
  Menu, X, LayoutDashboard, Package, Tags, ShoppingCart, 
  PiggyBank, HandCoins, Newspaper, UserCircle, LogOut 
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Produk',    href: '/products',   icon: Package },
  { label: 'Kategori',  href: '/categories', icon: Tags },
  { label: 'Pesanan',   href: '/orders',     icon: ShoppingCart },
  { label: 'Simpanan',  href: '/savings',    icon: PiggyBank },
  { label: 'Setoran',   href: '/deposits',   icon: HandCoins },
  { label: 'Berita',    href: '/news',       icon: Newspaper },
  { label: 'Profil',    href: '/profile',    icon: UserCircle },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { url } = usePage();  // ← Ini ambil URL saat ini dari Inertia (contoh: '/dashboard', '/products/abc')

  return (
    <>
      {/* Hamburger mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-full bg-white shadow-lg text-red-700 hover:bg-red-50 transition-all"
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 lg:w-64
          bg-gradient-to-b from-red-700 to-red-800 text-white flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          shadow-2xl lg:shadow-none
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-red-600/50 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shadow-inner">
            <img 
              src="/images/logo.jpg" 
              alt="Logo Koperasi Merah Putih" 
              className="w-7 h-7 object-contain" 
            />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">Koperasi Merah Putih</h1>
            <p className="text-xs text-red-200/90">Kemandungan</p>
          </div>
        </div>

        {/* Menu Links */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          {menuItems.map((item) => {
            // Active jika exact match ATAU nested (misal /products/create masih highlight Produk)
            const isActive = url === item.href || url.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                preserveScroll  // Jaga scroll position saat navigasi
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium mb-1.5
                  transition-all duration-200 group
                  ${isActive 
                    ? 'bg-white/20 text-white shadow-md' 
                    : 'text-red-100 hover:bg-white/10 hover:text-white hover:shadow-sm'
                  }
                `}
              >
                <Icon 
                  size={20} 
                  className={`${isActive ? 'text-white' : 'text-red-200 group-hover:text-white'}`} 
                />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout - pakai POST agar sesuai Laravel Auth */}
        <div className="p-4 border-t border-red-600/50 mt-auto">
          <Link
            href="/logout"
            method="post"
            as="button"
            className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 py-3 rounded-xl font-medium transition-all border border-white/10 hover:border-white/30"
          >
            <LogOut size={18} />
            Logout
          </Link>
        </div>
      </aside>
    </>
  );
}