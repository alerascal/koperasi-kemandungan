import React from 'react';
import { useCart } from '../../Context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Keranjang Kosong
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Belum ada produk di keranjang Anda
                    </p>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Mulai Belanja
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Keranjang Belanja</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map(item => (
                        <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex gap-4">
                            <img
                                src={item.image ? `/storage/${item.image}` : '/images/no-image.png'}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded"
                            />
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                                <p className="text-blue-600 font-bold mb-2">
                                    Rp {Number(item.price).toLocaleString('id-ID')}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-1 bg-gray-100 rounded">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="ml-auto text-red-600 hover:text-red-800"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold">
                                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                        <h2 className="text-xl font-bold mb-4">Ringkasan Belanja</h2>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>Rp {getTotal().toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Ongkir</span>
                                <span>Akan dihitung saat checkout</span>
                            </div>
                        </div>
                        <div className="border-t pt-4 mb-4">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-blue-600">
                                    Rp {getTotal().toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 mb-2"
                        >
                            Checkout
                        </button>
                        <button
                            onClick={clearCart}
                            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                        >
                            Kosongkan Keranjang
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}