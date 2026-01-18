import { useEffect, useState } from 'react';
import api from '@/Services/api';
import ProductCard from '@/Components/ProductCard';

export default function Index() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        api.get('/products').then(res => {
            setProducts(res.data.data);
        });
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <h1 className="text-2xl font-bold mb-6">Produk</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </div>
    );
}
