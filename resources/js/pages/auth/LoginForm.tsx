import { Form } from '@inertiajs/react';
import { store } from '@/routes/login';
import InputError from '@/components/input-error';

export default function LoginForm() {
    return (
        <Form {...store.form()} className="flex flex-col">
            {({ processing, errors }) => (
                <>
                    <h1>Sign In</h1>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                    />
                    <InputError message={errors.email} />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                    />
                    <InputError message={errors.password} />

                    <button type="submit" disabled={processing}>
                        Sign In
                    </button>
                </>
            )}
        </Form>
    );
}
