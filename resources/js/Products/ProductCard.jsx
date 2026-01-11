import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../Context/CartContext';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
        alert('Produk ditambahkan ke keranjang!');
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <Link to={`/products/${product.slug}`}>
                <img
                    src={product.image ? `/storage/${product.image}` : '/images/no-image.png'}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                />
            </Link>
            <div className="p-4">
                <Link to={`/products/${product.slug}`}>
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 mb-2">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {product.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-blue-600">
                        Rp {Number(product.price).toLocaleString('id-ID')}
                    </span>
                    <span className="text-sm text-gray-500">
                        Stock: {product.stock}
                    </span>
                </div>
                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                </button>
            </div>
        </div>
    );
}
