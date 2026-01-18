import { useEffect, useState } from 'react';
import api from '@/Services/api';

export default function Show({ slug }) {
    const [product, setProduct] = useState(null);

    useEffect(() => {
        api.get(`/products/${slug}`).then(res => {
            setProduct(res.data);
        });
    }, [slug]);

    if (!product) return <div>Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p>{product.description}</p>
        </div>
    );
}
