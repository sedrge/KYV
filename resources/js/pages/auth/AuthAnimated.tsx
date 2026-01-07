import { useState } from 'react';
import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import '@/styles/auth-animated.css';

export default function AuthAnimated() {
    const [isActive, setIsActive] = useState(false);

    return (
        <AuthSimpleLayout
            title={isActive ? 'Create account' : 'Welcome back'}
            description={
                isActive
                    ? 'Register to access all features'
                    : 'Access your dashboard securely'
            }
        >
            <div
                className={`container ${isActive ? 'active' : ''}`}
                id="container"
            >
                {/* SIGN UP */}
                <div className="form-container sign-up">
                    <RegisterForm />
                </div>

                {/* SIGN IN */}
                <div className="form-container sign-in">
                    <LoginForm />
                </div>

                {/* TOGGLE */}
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Welcome Back!</h1>
                            <p>
                                Enter your personal details to use all site
                                features
                            </p>
                            <button
                                className="hidden"
                                onClick={() => setIsActive(false)}
                            >
                                Sign In
                            </button>
                        </div>

                        <div className="toggle-panel toggle-right">
                            <h1>Hello, Friend!</h1>
                            <p>
                                Register with your personal details to use all
                                site features
                            </p>
                            <button
                                className="hidden"
                                onClick={() => setIsActive(true)}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthSimpleLayout>
    );
}
