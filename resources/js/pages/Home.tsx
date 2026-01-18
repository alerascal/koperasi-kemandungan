import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, TrendingUp, Users, Wallet, ShoppingBag, Newspaper, Phone, Clock, MapPin, LogIn, UserPlus, ArrowRight } from 'lucide-react';

// API Configuration
const API_BASE = '/api';

const api = {
  get: async (endpoint) => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Accept': 'application/json',
      }
    });
    if (response.status === 401) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    }
    return response.json();
  }
};

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return 'Baru saja';
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('id-ID', options);
};

const HomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalMembers: '1,234',
    totalSavings: '2.5M',
    activeDeposits: '156',
    totalOrders: '892'
  });
  const [products, setProducts] = useState([]);
  const [news, setNews] = useState([]);
  const [saving, setSaving] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      
      // Load user if logged in
      if (token) {
        try {
          const userData = await api.get('/me');
          setUser(userData);
          
          // Load user saving
          const savingData = await api.get('/saving');
          setSaving(savingData);
        } catch (error) {
          console.error('Auth error:', error);
        }
      }

      // Load products
      try {
        const productsData = await api.get('/products?limit=3');
        setProducts(productsData.data || []);
      } catch (err) {
        console.error('Error loading products:', err);
      }

      // Load news
      try {
        const newsData = await api.get('/news?limit=3');
        setNews(newsData.data || []);
      } catch (err) {
        console.error('Error loading news:', err);
      }

    } catch (error) {
      console.error('Error loading data:', error);
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };
  

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
    setSaving(null);
  };

  const services = [
    {
      title: 'Simpanan',
      description: 'Kelola simpanan pokok, wajib, dan sukarela dengan mudah',
      icon: <Wallet className="w-8 h-8" />,
      gradient: 'from-blue-500 to-blue-600',
      href: '/saving'
    },
    {
      title: 'Deposito',
      description: 'Investasi jangka panjang dengan keuntungan optimal',
      icon: <TrendingUp className="w-8 h-8" />,
      gradient: 'from-green-500 to-green-600',
      href: '/deposits'
    },
    {
      title: 'Belanja Produk',
      description: 'Dapatkan produk berkualitas dengan harga anggota',
      icon: <ShoppingBag className="w-8 h-8" />,
      gradient: 'from-orange-500 to-orange-600',
      href: '/products'
    },
    {
      title: 'Berita & Info',
      description: 'Update terbaru seputar koperasi dan kegiatan',
      icon: <Newspaper className="w-8 h-8" />,
      gradient: 'from-purple-500 to-purple-600',
      href: '/news'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-red-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-700 rounded-xl blur-sm opacity-75"></div>
                <div className="relative w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg lg:text-xl">K</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                  Koperasi Merah Putih
                </h1>
                <p className="text-xs text-gray-600 hidden lg:block">Bersama Membangun Kesejahteraan</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="/" className="text-red-600 font-semibold relative group">
                Beranda
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-red-600 to-red-800"></span>
              </a>
              <a href="/products" className="text-gray-700 hover:text-red-600 font-medium transition">Produk</a>
              <a href="/news" className="text-gray-700 hover:text-red-600 font-medium transition">Berita</a>
              
              {user ? (
                <>
                  <a href="/saving" className="text-gray-700 hover:text-red-600 font-medium transition">Simpanan</a>
                  <a href="/deposits" className="text-gray-700 hover:text-red-600 font-medium transition">Deposito</a>
                  <div className="flex items-center space-x-3">
                    <a href="/profile" className="w-9 h-9 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-semibold hover:shadow-lg transition">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </a>
                    <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-red-600 transition">
                      Keluar
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <a href="/login" className="text-gray-700 hover:text-red-600 font-medium transition">
                    Masuk
                  </a>
                  <a href="/register" className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-xl blur opacity-75 group-hover:opacity-100 transition"></div>
                    <div className="relative bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                      Daftar
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 space-y-3 border-t border-gray-100">
              <a href="/" className="block px-4 py-2 text-red-600 font-semibold bg-red-50 rounded-lg">Beranda</a>
              <a href="/products" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition">Produk</a>
              <a href="/news" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition">Berita</a>
              
              {user ? (
                <>
                  <a href="/saving" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition">Simpanan</a>
                  <a href="/deposits" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition">Deposito</a>
                  <a href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition">Profile</a>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition">Masuk</a>
                  <a href="/register" className="block px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold text-center">
                    Daftar Sekarang
                  </a>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl mb-8 lg:mb-12">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-red-900"></div>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
          
          <div className="absolute top-0 right-0 w-64 h-64 lg:w-96 lg:h-96 bg-white rounded-full opacity-5 blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 lg:w-96 lg:h-96 bg-red-900 rounded-full opacity-20 blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative px-6 lg:px-12 py-12 lg:py-16">
            <div className="max-w-3xl">
              <div className="inline-block mb-4">
                <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                  🎉 Platform Koperasi Digital Terpercaya
                </div>
              </div>
              <h1 className="text-3xl lg:text-5xl font-extrabold mb-4 lg:mb-6 text-white leading-tight">
                Wujudkan Impian<br/>
                <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                  Bersama Koperasi
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-red-50 mb-8 lg:mb-10 leading-relaxed">
                Platform koperasi digital yang memberikan kemudahan dalam mengelola simpanan, deposito, dan berbelanja produk berkualitas untuk anggota.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                {!user ? (
                  <>
                    <a href="/register" className="group relative text-center">
                      <div className="absolute inset-0 bg-white rounded-2xl blur-sm opacity-50 group-hover:opacity-75 transition"></div>
                      <div className="relative bg-white text-red-600 px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                        Daftar Sekarang
                      </div>
                    </a>
                    <a href="/login" className="bg-white/10 backdrop-blur-sm text-white px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-bold hover:bg-white/20 transition-all border-2 border-white/30 transform hover:-translate-y-1 text-center">
                      Masuk
                    </a>
                  </>
                ) : (
                  <a href="/saving" className="group relative text-center">
                    <div className="absolute inset-0 bg-white rounded-2xl blur-sm opacity-50 group-hover:opacity-75 transition"></div>
                    <div className="relative bg-white text-red-600 px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                      Lihat Simpanan Saya <ArrowRight className="w-5 h-5" />
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-8 lg:mb-12 lg:-mt-20 relative z-10">
          {[
            { icon: <Users className="w-6 h-6" />, value: stats.totalMembers, label: 'Total Anggota', color: 'blue', badge: 'AKTIF' },
            { icon: <Wallet className="w-6 h-6" />, value: `Rp ${stats.totalSavings}`, label: 'Total Simpanan', color: 'green', badge: '+12%' },
            { icon: <TrendingUp className="w-6 h-6" />, value: stats.activeDeposits, label: 'Deposito Aktif', color: 'orange', badge: 'LIVE' },
            { icon: <ShoppingBag className="w-6 h-6" />, value: stats.totalOrders, label: 'Total Transaksi', color: 'purple', badge: '+8%' }
          ].map((stat, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition"></div>
              <div className="relative backdrop-blur-xl bg-white/90 rounded-2xl p-4 lg:p-6 border border-gray-100 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center text-white shadow-lg">
                    {stat.icon}
                  </div>
                  <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 lg:px-3 py-1 rounded-full">
                    {stat.badge}
                  </div>
                </div>
                <h3 className="text-xl lg:text-3xl font-extrabold text-gray-900 mb-1 lg:mb-2">{stat.value}</h3>
                <p className="text-xs lg:text-sm font-medium text-gray-600">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* User Saving Info */}
        {user && saving && (
          <div className="relative mb-8 lg:mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-3xl blur-xl opacity-50"></div>
            <div className="relative backdrop-blur-xl bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-6 lg:p-8 border border-red-400/50 shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0">
                <div>
                  <p className="text-red-100 text-sm font-semibold mb-2 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    Saldo Simpanan Anda
                  </p>
                  <h3 className="text-3xl lg:text-4xl font-extrabold text-white mb-1">
                    Rp {saving.balance?.toLocaleString('id-ID') || '0'}
                  </h3>
                  <p className="text-red-200 text-sm">Update terakhir: Hari ini</p>
                </div>
                <div className="flex gap-3">
                  <a href="/saving/deposit" className="group relative flex-1 lg:flex-none">
                    <div className="absolute inset-0 bg-white rounded-xl blur opacity-50 group-hover:opacity-75 transition"></div>
                    <div className="relative bg-white text-red-600 px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-center text-sm lg:text-base">
                      💳 Setor
                    </div>
                  </a>
                  <a href="/saving/withdraw" className="bg-white/10 backdrop-blur-sm text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl font-bold hover:bg-white/20 transition-all border-2 border-white/30 transform hover:-translate-y-1 flex-1 lg:flex-none text-center text-sm lg:text-base">
                    💸 Tarik
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services */}
        <div className="mb-12 lg:mb-16">
          <div className="text-center mb-8 lg:mb-10">
            <h2 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-3">
              Layanan Unggulan
            </h2>
            <p className="text-gray-600 text-base lg:text-lg">Solusi keuangan lengkap untuk kebutuhan Anda</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {services.map((service, index) => (
              <a key={index} href={service.href} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-all duration-300`}></div>
                <div className="relative backdrop-blur-xl bg-white/90 rounded-3xl p-6 lg:p-8 border border-gray-200 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
                  <div className={`w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg mb-4 lg:mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                    {service.icon}
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 lg:mb-3">{service.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3 lg:mb-4">{service.description}</p>
                  <div className="flex items-center text-red-600 font-semibold text-sm">
                    Lihat Detail
                    <ChevronRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Products & News */}
<div className="mb-12">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

    {/* ===================== */}
    {/* PRODUCTS SECTION */}
    {/* ===================== */}
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition duration-500" />
      <div className="relative backdrop-blur-xl bg-white/95 rounded-3xl p-6 lg:p-8 border border-gray-200 shadow-xl h-full flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl lg:text-2xl font-extrabold text-gray-900">
              🛍️ Produk Terbaru
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Penawaran eksklusif untuk anggota
            </p>
          </div>
          <a
            href="/products"
            className="flex items-center text-sm font-semibold text-red-600 hover:text-red-700 transition"
          >
            Lihat Semua <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>

        {/* Content */}
        <div className="flex-1">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-gray-100 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              {error}
            </div>
          ) : products.length > 0 ? (
            <div className="space-y-2">
              {products.map((product) => (
                <a
                  key={product.id || product.slug}
                  href={`/products/${product.slug}`}
                  className="group/item flex items-center space-x-4 p-4 rounded-2xl hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                >
                  <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        🛍️
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 group-hover/item:text-red-600 transition line-clamp-2">
                      {product.name}
                    </h4>
                    <p className="text-lg font-bold text-red-600 mt-1">
                      Rp {Number(product.price || 0).toLocaleString('id-ID')}
                    </p>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover/item:text-red-600 transition" />
                </a>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-16 text-gray-500">
              <ShoppingBag className="w-14 h-14 mb-4 opacity-50" />
              <p>Belum ada produk tersedia</p>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* ===================== */}
    {/* NEWS SECTION */}
    {/* ===================== */}
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition duration-500" />
      <div className="relative backdrop-blur-xl bg-white/95 rounded-3xl p-6 lg:p-8 border border-gray-200 shadow-xl h-full flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl lg:text-2xl font-extrabold text-gray-900">
              📰 Berita Terbaru
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Informasi & kegiatan koperasi
            </p>
          </div>
          <a
            href="/news"
            className="flex items-center text-sm font-semibold text-purple-600 hover:text-purple-700 transition"
          >
            Lihat Semua <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>

        {/* Content */}
        <div className="flex-1">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-100 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : news.length > 0 ? (
            <div className="space-y-2">
              {news.map((item) => (
                <a
                  key={item.id || item.slug}
                  href={`/news/${item.slug}`}
                  className="group/item block p-4 rounded-2xl hover:bg-purple-50 transition-all border border-transparent hover:border-purple-100"
                >
                  <h4 className="font-semibold text-gray-900 group-hover/item:text-purple-700 line-clamp-2">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDate(item.published_at)}</span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-16 text-gray-500">
              <Newspaper className="w-14 h-14 mb-4 opacity-50" />
              <p>Belum ada berita terbaru</p>
            </div>
          )}
        </div>
      </div>
    </div>

  </div>
</div>


        {/* Contact Section */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-3xl blur-xl opacity-30"></div>
          <div className="relative backdrop-blur-xl bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-8 lg:p-12 border border-red-400/50 shadow-2xl">
            <div className="text-center text-white">
              <h2 className="text-2xl lg:text-3xl font-extrabold mb-4">Hubungi Kami</h2>
              <p className="text-red-100 mb-8 max-w-2xl mx-auto">
                Tim kami siap membantu Anda. Jangan ragu untuk menghubungi kami jika ada pertanyaan.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <Phone className="w-8 h-8 mx-auto mb-3" />
                  <p className="font-semibold mb-1">Telepon</p>
                  <p className="text-red-100 text-sm">+62 123 4567 890</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <Clock className="w-8 h-8 mx-auto mb-3" />
                  <p className="font-semibold mb-1">Jam Operasional</p>
                  <p className="text-red-100 text-sm">Senin - Jumat, 08:00 - 16:00</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <MapPin className="w-8 h-8 mx-auto mb-3" />
                  <p className="font-semibold mb-1">Lokasi</p>
                  <p className="text-red-100 text-sm">Jl. Koperasi No. 123, Jakarta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">K</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Koperasi Merah Putih</h3>
                  <p className="text-gray-400 text-sm">Bersama Membangun Kesejahteraan</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Platform koperasi digital terpercaya untuk mengelola simpanan, deposito, dan berbelanja produk berkualitas.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/saving" className="hover:text-white transition">Simpanan</a></li>
                <li><a href="/deposits" className="hover:text-white transition">Deposito</a></li>
                <li><a href="/products" className="hover:text-white transition">Produk</a></li>
                <li><a href="/news" className="hover:text-white transition">Berita</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Informasi</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/about" className="hover:text-white transition">Tentang Kami</a></li>
                <li><a href="/contact" className="hover:text-white transition">Kontak</a></li>
                <li><a href="/faq" className="hover:text-white transition">FAQ</a></li>
                <li><a href="/terms" className="hover:text-white transition">Syarat & Ketentuan</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 Koperasi Merah Putih. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
               