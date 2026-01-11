import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <form
                    onSubmit={submit}
                    className="w-96 bg-white p-6 rounded shadow space-y-4"
                >
                    <h1 className="text-2xl font-bold text-center">
                        Login Koperasi
                    </h1>

                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password}</p>
                        )}
                    </div>

                    <button
                        disabled={processing}
                        className="w-full bg-blue-600 text-white py-2 rounded"
                    >
                        Login
                    </button>

                    <p className="text-sm text-center">
                        Belum punya akun?{' '}
                        <Link href="/register" className="text-blue-600">
                            Daftar
                        </Link>
                    </p>
                </form>
            </div>
        </>
    );
}
