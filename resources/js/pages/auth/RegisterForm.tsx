import { Form } from '@inertiajs/react';
import { store } from '@/routes/register';
import InputError from '@/components/input-error';

export default function RegisterForm() {
    return (
        <Form {...store.form()} className="flex flex-col">
            {({ processing, errors }) => (
                <>
                    <h1>Create Account</h1>

                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        required
                    />
                    <InputError message={errors.name} />

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
                        Sign Up
                    </button>
                </>
            )}
        </Form>
    );
}
