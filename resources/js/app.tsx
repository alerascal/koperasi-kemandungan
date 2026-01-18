import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import axios from 'axios';

import { CartProvider } from '@/Context/CartContext';
import { AuthProvider } from '@/Context/AuthContext';

// ✅ SANCTUM CONFIG
axios.defaults.baseURL = import.meta.env.VITE_API_URL ?? '';
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx')
        ),

    setup({ el, App, props }) {
        createRoot(el).render(
            <StrictMode>
                <AuthProvider>
                    <CartProvider>
                        <App {...props} />
                    </CartProvider>
                </AuthProvider>
            </StrictMode>
        );
    },

    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
