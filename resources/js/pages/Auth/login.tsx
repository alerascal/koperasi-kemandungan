import { authAPI } from '@/Services/api';
import { useState } from 'react';

export default function Login() {
    const [data, setData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<any>({});
    const [processing, setProcessing] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const res = await authAPI.login(data);

            // simpan token & user
            localStorage.setItem('token', res.data.access_token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            window.location.href = '/dashboard';
        } catch (err: any) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else if (err.response?.status === 403) {
                alert(err.response.data.message);
            } else {
                alert('Login gagal');
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 p-4 relative overflow-hidden">
      {/* Background subtle pattern / decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-100/50 overflow-hidden transition-all duration-500 hover:shadow-red-200/40">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 px-8 py-10 text-center">
            {/* Optional subtle overlay pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.12)_0%,transparent_50%)]" />

            <div className="w-20 h-20 bg-white/95 rounded-2xl mx-auto mb-5 flex items-center justify-center shadow-xl ring-1 ring-white/30">
              <img
                src="/images/logo.jpg"
                alt="Koperasi Merah Putih"
                className="w-12 h-12 object-contain"
              />
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
              Koperasi Merah Putih
            </h1>
            <p className="mt-2 text-red-100/90 text-sm md:text-base font-medium">
              Kemandirian • Gotong Royong • Maju Bersama
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="p-8 md:p-10 space-y-7">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="w-full px-5 py-3.5 rounded-xl border border-gray-300 
                           bg-white/70 backdrop-blur-sm text-gray-900 
                           placeholder-gray-400 
                           focus:border-red-500 focus:ring-2 focus:ring-red-500/30 
                           transition-all duration-200 outline-none"
                placeholder="nama@email.com"
                required
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Kata Sandi
              </label>
              <input
                type="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className="w-full px-5 py-3.5 rounded-xl border border-gray-300 
                           bg-white/70 backdrop-blur-sm text-gray-900 
                           placeholder-gray-400 
                           focus:border-red-500 focus:ring-2 focus:ring-red-500/30 
                           transition-all duration-200 outline-none"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1.5">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 
                         hover:from-red-700 hover:to-red-800 
                         text-white py-4 rounded-xl font-semibold text-lg
                         shadow-lg shadow-red-600/30 
                         hover:shadow-red-700/40 
                         transform hover:-translate-y-0.5 
                         transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {processing ? (
                <div className="flex items-center justify-center gap-3">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Memproses...
                </div>
              ) : (
                'Masuk'
              )}
            </button>

            {/* Optional extra links */}
            <div className="text-center text-sm text-gray-500 mt-4">
              Lupa kata sandi?{' '}
              <a href="#" className="text-red-600 hover:text-red-700 font-medium">
                Reset di sini
              </a>
            </div>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          © {new Date().getFullYear()} Koperasi Merah Putih • All rights reserved
        </p>
      </div>
    </div>
  );
}
