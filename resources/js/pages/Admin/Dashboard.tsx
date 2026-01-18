import React, { useEffect, useState } from 'react';
import { ordersAPI, productsAPI } from '@/Services/api';
import Sidebar from '@/components/Sidebar';

interface Order {
    id: number;
    order_number: string;
    total_amount: string;
    status: string;
    created_at: string;
    user?: {
        name: string;
        email: string;
    };
}

interface Stats {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalUsers: number;
}

export default function Dashboard() {
    const [stats, setStats] = useState<Stats>({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalUsers: 0,
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeOfDay, setTimeOfDay] = useState('');

    useEffect(() => {
        fetchDashboard();
        updateGreeting();
    }, []);

    const updateGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) setTimeOfDay('Pagi');
        else if (hour < 15) setTimeOfDay('Siang');
        else if (hour < 18) setTimeOfDay('Sore');
        else setTimeOfDay('Malam');
    };

    const fetchDashboard = async () => {
        try {
            const [ordersRes, productsRes] = await Promise.all([
                ordersAPI.getAll({ per_page: 5 }),
                productsAPI.getAll({ per_page: 1 }),
            ]);

            const revenue = ordersRes.data.data
                .filter((o: Order) => o.status === 'completed')
                .reduce(
                    (sum: number, o: Order) =>
                        sum + parseFloat(o.total_amount),
                    0
                );

            setRecentOrders(ordersRes.data.data);
            setStats({
                totalOrders: ordersRes.data.total || 0,
                totalRevenue: revenue,
                totalProducts: productsRes.data.total || 0,
                totalUsers: 0,
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        const colors = {
            completed: {
                bg: 'bg-green-100',
                text: 'text-green-700',
                dot: 'bg-green-500'
            },
            pending: {
                bg: 'bg-yellow-100',
                text: 'text-yellow-700',
                dot: 'bg-yellow-500'
            },
            cancelled: {
                bg: 'bg-red-100',
                text: 'text-red-700',
                dot: 'bg-red-500'
            }
        };
        return colors[status as keyof typeof colors] || colors.cancelled;
    };

    const getStatusText = (status: string) => {
        const statusMap: { [key: string]: string } = {
            completed: 'Selesai',
            pending: 'Pending',
            cancelled: 'Dibatalkan'
        };
        return statusMap[status] || status;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Memuat Dashboard...</p>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Total Pesanan',
            value: stats.totalOrders,
            iconPath: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600',
            accentColor: 'bg-blue-500',
            trend: '+12%',
            trendUp: true,
        },
        {
            label: 'Total Pendapatan',
            value: `Rp ${stats.totalRevenue.toLocaleString('id-ID')}`,
            iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600',
            accentColor: 'bg-green-500',
            trend: '+8.5%',
            trendUp: true,
        },
        {
            label: 'Total Produk',
            value: stats.totalProducts,
            iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
            accentColor: 'bg-purple-500',
            trend: '+3',
            trendUp: true,
        },
        {
            label: 'Pengguna Aktif',
            value: stats.totalUsers,
            iconPath: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
            bgColor: 'bg-orange-100',
            iconColor: 'text-orange-600',
            accentColor: 'bg-orange-500',
            trend: '+5',
            trendUp: true,
        },
    ];

    const quickActions = [
        { 
            label: 'Tambah Anggota', 
            icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', 
            bgColor: 'bg-red-50',
            hoverBg: 'hover:bg-red-100',
            iconBg: 'bg-red-100',
            iconHoverBg: 'group-hover:bg-red-200',
            iconColor: 'text-red-600',
            textColor: 'text-red-700',
            borderColor: 'border-red-100'
        },
        { 
            label: 'Input Simpanan', 
            icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6', 
            bgColor: 'bg-green-50',
            hoverBg: 'hover:bg-green-100',
            iconBg: 'bg-green-100',
            iconHoverBg: 'group-hover:bg-green-200',
            iconColor: 'text-green-600',
            textColor: 'text-green-700',
            borderColor: 'border-green-100'
        },
        { 
            label: 'Proses Pinjaman', 
            icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z', 
            bgColor: 'bg-blue-50',
            hoverBg: 'hover:bg-blue-100',
            iconBg: 'bg-blue-100',
            iconHoverBg: 'group-hover:bg-blue-200',
            iconColor: 'text-blue-600',
            textColor: 'text-blue-700',
            borderColor: 'border-blue-100'
        },
        { 
            label: 'Generate Laporan', 
            icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', 
            bgColor: 'bg-purple-50',
            hoverBg: 'hover:bg-purple-100',
            iconBg: 'bg-purple-100',
            iconHoverBg: 'group-hover:bg-purple-200',
            iconColor: 'text-purple-600',
            textColor: 'text-purple-700',
            borderColor: 'border-purple-100'
        },
    ];

    const chartData = [65, 45, 80, 55, 70, 90, 75];
    const dayLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

    return (
        <div className="min-h-screen flex bg-gray-100">
            <Sidebar />

            <main className="flex-1 overflow-y-auto">
                <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* TOP BAR */}
                        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">
                                    Selamat {timeOfDay}! 👋
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Ringkasan aktivitas Koperasi Merah Putih Kemandungan
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
                                   <img
    src="/images/logo.jpg"
    alt="Garuda"
    className="w-5 h-5 object-contain"
/>
                                    <span className="hidden sm:inline text-sm font-medium text-gray-700">Notifikasi</span>
                                </button>
                                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                                    <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">AD</span>
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-sm font-semibold text-gray-800">Admin</p>
                                        <p className="text-xs text-gray-500">Super Admin</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* HERO BANNER */}
                        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-2xl p-8 shadow-2xl mb-8 relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/5"></div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
    <img
        src="/images/logo.jpg"
        alt="Tegal"
        className="w-full h-full object-contain"
        draggable={false}
    />
</div>
                                    
                                    <div>
                                        <h2 className="text-3xl font-bold text-white mb-2">
                                            Koperasi Merah Putih
                                        </h2>
                                        <p className="text-red-100 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Kemandungan, Indonesia
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button className="bg-white text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition-all duration-200 shadow-lg flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Transaksi Baru
                                    </button>
                                    <button className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Laporan
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* STATS CARDS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {statCards.map((stat, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                                >
                                    <div className={`absolute top-0 right-0 w-32 h-32 ${stat.accentColor}/5 rounded-full blur-2xl group-hover:${stat.accentColor}/10 transition-all duration-300`}></div>
                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                                                <svg className={`w-6 h-6 ${stat.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.iconPath} />
                                                </svg>
                                            </div>
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {stat.trend}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium mb-2">{stat.label}</p>
                                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CONTENT GRID */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {/* QUICK ACTIONS */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-gray-800">Aksi Cepat</h3>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="space-y-3">
                                    {quickActions.map((action, idx) => (
                                        <button
                                            key={idx}
                                            className={`w-full flex items-center gap-3 p-4 ${action.bgColor} ${action.hoverBg} rounded-xl transition-all duration-200 group border ${action.borderColor}`}
                                        >
                                            <div className={`w-10 h-10 ${action.iconBg} ${action.iconHoverBg} rounded-lg flex items-center justify-center transition-colors`}>
                                                <svg className={`w-5 h-5 ${action.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                                                </svg>
                                            </div>
                                            <span className={`text-sm font-semibold ${action.textColor}`}>{action.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* ACTIVITY CHART */}
                            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">Aktivitas Transaksi</h3>
                                        <p className="text-sm text-gray-500 mt-1">7 hari terakhir</p>
                                    </div>
                                    <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                                        <option>7 Hari</option>
                                        <option>30 Hari</option>
                                        <option>90 Hari</option>
                                    </select>
                                </div>
                                <div className="h-64 flex items-end justify-between gap-3">
                                    {chartData.map((height, idx) => (
                                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                            <div 
                                                className="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-lg hover:from-red-700 hover:to-red-500 transition-all duration-300 cursor-pointer relative group" 
                                                style={{ height: `${height}%` }}
                                            >
                                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    {height} transaksi
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500 font-medium">
                                                {dayLabels[idx]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RECENT ORDERS TABLE */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Pesanan Terbaru</h3>
                                    <p className="text-red-100 text-sm mt-1">5 transaksi terakhir</p>
                                </div>
                                <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors text-sm font-semibold border border-white/30">
                                    Lihat Semua
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">No. Pesanan</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Total</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tanggal</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {recentOrders.map((order) => {
                                            const statusColor = getStatusColor(order.status);
                                            return (
                                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm font-semibold text-gray-800">
                                                            {order.order_number}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                                                                <span className="text-white font-semibold text-sm">
                                                                    {order.user?.name?.charAt(0) || 'U'}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-800">{order.user?.name}</p>
                                                                <p className="text-xs text-gray-500">{order.user?.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm font-bold text-gray-800">
                                                            Rp {parseFloat(order.total_amount).toLocaleString('id-ID')}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${statusColor.bg} ${statusColor.text}`}>
                                                            <span className={`w-2 h-2 rounded-full ${statusColor.dot}`}></span>
                                                            {getStatusText(order.status)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-1">
                                                            Detail
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
                                <p className="text-sm text-gray-600">
                                    Menampilkan <span className="font-semibold text-gray-800">{recentOrders.length}</span> dari{' '}
                                    <span className="font-semibold text-gray-800">{stats.totalOrders}</span> pesanan
                                </p>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                                        Previous
                                    </button>
                                    <button className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}