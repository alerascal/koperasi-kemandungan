import { Head, Link, useForm, router } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <>
            <Head title="Register" />

            <form onSubmit={submit}>
                {/* form */}
                <Link href="/login">Login</Link>
            </form>
        </>
    );
}
