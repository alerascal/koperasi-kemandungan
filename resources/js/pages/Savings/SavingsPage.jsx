import React, { useState, useEffect } from 'react';
import { savingsAPI } from '../../Services/api';

export default function SavingsPage() {
    const [saving, setSaving] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('deposit'); // 'deposit' or 'withdraw'
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSaving();
        fetchTransactions();
    }, []);

    const fetchSaving = async () => {
        try {
            const response = await savingsAPI.get();
            setSaving(response.data);
        } catch (error) {
            console.error('Error fetching saving:', error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await savingsAPI.getTransactions({ per_page: 10 });
            setTransactions(response.data.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = {
                amount: parseFloat(amount),
                description: description || undefined,
            };

            if (modalType === 'deposit') {
                await savingsAPI.deposit(data);
            } else {
                await savingsAPI.withdraw(data);
            }

            alert(`${modalType === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`);
            setShowModal(false);
            setAmount('');
            setDescription('');
            fetchSaving();
            fetchTransactions();
        } catch (error) {
            alert(error.response?.data?.message || 'Transaction failed');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (type) => {
        setModalType(type);
        setShowModal(true);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Tabungan Saya</h1>

            {/* Balance Card */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 text-white mb-8">
                <p className="text-lg mb-2">Saldo Tabungan</p>
                <h2 className="text-4xl font-bold mb-6">
                    Rp {saving?.balance ? parseFloat(saving.balance).toLocaleString('id-ID') : '0'}
                </h2>
                <div className="flex gap-4">
                    <button
                        onClick={() => openModal('deposit')}
                        className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100"
                    >
                        Setor Tabungan
                    </button>
                    <button
                        onClick={() => openModal('withdraw')}
                        className="bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800"
                    >
                        Tarik Tabungan
                    </button>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Riwayat Transaksi</h2>
                {transactions.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">Belum ada transaksi</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Tanggal</th>
                                    <th className="text-left py-3 px-4">Jenis</th>
                                    <th className="text-left py-3 px-4">Deskripsi</th>
                                    <th className="text-right py-3 px-4">Jumlah</th>
                                    <th className="text-right py-3 px-4">Saldo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => (
                                    <tr key={transaction.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            {new Date(transaction.created_at).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                transaction.type === 'deposit' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {transaction.type === 'deposit' ? 'Setoran' : 'Penarikan'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">
                                            {transaction.description || '-'}
                                        </td>
                                        <td className={`py-3 px-4 text-right font-semibold ${
                                            transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {transaction.type === 'deposit' ? '+' : '-'}
                                            Rp {parseFloat(transaction.amount).toLocaleString('id-ID')}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            Rp {parseFloat(transaction.balance_after).toLocaleString('id-ID')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">
                            {modalType === 'deposit' ? 'Setor Tabungan' : 'Tarik Tabungan'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Jumlah (Rp)
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    min="10000"
                                    step="1000"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Minimal Rp 10.000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Keterangan (Opsional)
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Tambahkan keterangan..."
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Submit'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setAmount('');
                                        setDescription('');
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

