import React, { useState, useEffect } from 'react';
import { depositsAPI } from '../../Services/api';

export default function DepositsPage() {
    const [deposits, setDeposits] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        period_months: '12',
    });
    const [loading, setLoading] = useState(false);

    const interestRates = {
        3: 5.0,
        6: 6.0,
        12: 7.5,
        24: 9.0,
    };

    useEffect(() => {
        fetchDeposits();
    }, []);

    const fetchDeposits = async () => {
        try {
            const response = await depositsAPI.getAll();
            setDeposits(response.data.data);
        } catch (error) {
            console.error('Error fetching deposits:', error);
        }
    };

    const calculateReturn = (amount, months) => {
        const rate = interestRates[months] / 100 / 12;
        const interest = amount * rate * months;
        return amount + interest;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = {
                amount: parseFloat(formData.amount),
                period_months: parseInt(formData.period_months),
            };

            await depositsAPI.create(data);
            alert('Deposito berhasil dibuat!');
            setShowModal(false);
            setFormData({ amount: '', period_months: '12' });
            fetchDeposits();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create deposit');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!confirm('Apakah Anda yakin ingin membatalkan deposito ini?')) return;

        try {
            await depositsAPI.cancel(id);
            alert('Deposito berhasil dibatalkan');
            fetchDeposits();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to cancel deposit');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Deposito Saya</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                    Buat Deposito Baru
                </button>
            </div>

            {/* Interest Rates Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {Object.entries(interestRates).map(([months, rate]) => (
                    <div key={months} className="bg-white rounded-lg shadow-md p-4 text-center">
                        <p className="text-gray-600 text-sm">Tenor {months} Bulan</p>
                        <p className="text-2xl font-bold text-blue-600">{rate}%</p>
                        <p className="text-gray-500 text-xs">per tahun</p>
                    </div>
                ))}
            </div>

            {/* Deposits List */}
            <div className="space-y-4">
                {deposits.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-600">Belum ada deposito</p>
                    </div>
                ) : (
                    deposits.map((deposit) => (
                        <div key={deposit.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">
                                        Deposito {deposit.period_months} Bulan
                                    </h3>
                                    <p className="text-gray-600">
                                        Bunga: {deposit.interest_rate}% per tahun
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded text-sm font-semibold ${
                                    deposit.status === 'active' ? 'bg-green-100 text-green-800' :
                                    deposit.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {deposit.status === 'active' ? 'Aktif' :
                                     deposit.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-600">Nominal Deposito</p>
                                    <p className="text-lg font-bold">
                                        Rp {parseFloat(deposit.amount).toLocaleString('id-ID')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Pengembalian</p>
                                    <p className="text-lg font-bold text-green-600">
                                        Rp {deposit.total_return ? 
                                            parseFloat(deposit.total_return).toLocaleString('id-ID') :
                                            calculateReturn(
                                                parseFloat(deposit.amount), 
                                                deposit.period_months
                                            ).toLocaleString('id-ID')
                                        }
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Jatuh Tempo</p>
                                    <p className="text-lg font-bold">
                                        {new Date(deposit.end_date).toLocaleDateString('id-ID')}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t pt-4 flex justify-between items-center">
                                <div className="text-sm text-gray-600">
                                    Mulai: {new Date(deposit.start_date).toLocaleDateString('id-ID')}
                                </div>
                                {deposit.status === 'active' && (
                                    <button
                                        onClick={() => handleCancel(deposit.id)}
                                        className="text-red-600 hover:text-red-800 text-sm font-semibold"
                                    >
                                        Batalkan Deposito
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Buat Deposito Baru</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Nominal Deposito (Rp)
                                </label>
                                <input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                    min="100000"
                                    step="100000"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Minimal Rp 100.000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Pilih Tenor
                                </label>
                                <select
                                    value={formData.period_months}
                                    onChange={(e) => setFormData({...formData, period_months: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="3">3 Bulan (5% per tahun)</option>
                                    <option value="6">6 Bulan (6% per tahun)</option>
                                    <option value="12">12 Bulan (7.5% per tahun)</option>
                                    <option value="24">24 Bulan (9% per tahun)</option>
                                </select>
                            </div>

                            {formData.amount && (
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-2">Estimasi Pengembalian:</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        Rp {calculateReturn(
                                            parseFloat(formData.amount), 
                                            parseInt(formData.period_months)
                                        ).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Buat Deposito'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setFormData({ amount: '', period_months: '12' });
                                    }}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}