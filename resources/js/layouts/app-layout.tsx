import { PropsWithChildren, useEffect } from 'react';
import axios from 'axios';

export default function AppLayout({ children }: PropsWithChildren) {
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = '/login';
            return;
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        axios.interceptors.response.use(
            res => res,
            err => {
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
                return Promise.reject(err);
            }
        );
    }, []);

    return (
        <div className="min-h-screen flex bg-red-50">
            {children}
        </div>
    );
}
