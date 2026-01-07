import { useState } from 'react';
import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';
import LoginForm from '../pages/auth/LoginForm';
import RegisterForm from '../pages/auth/RegisterForm';
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
      variant="fullscreen" // full screen pour l'animation
    >
      <div className={`container ${isActive ? 'active' : ''}`} id="container">
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
            {/* PANEL LEFT - Sign In */}
            <div
              className="toggle-panel toggle-left cursor-pointer select-none"
              onClick={() => setIsActive(false)}
            >
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all site features</p>
              <span className="mt-4 inline-block px-6 py-2 bg-white text-purple-700 font-bold rounded-lg shadow hover:bg-purple-50 transition">
                Sign In
              </span>
            </div>

            {/* PANEL RIGHT - Sign Up */}
            <div
              className="toggle-panel toggle-right cursor-pointer select-none"
              onClick={() => setIsActive(true)}
            >
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details to use all site features</p>
              <span className="mt-4 inline-block px-6 py-2 bg-white text-purple-700 font-bold rounded-lg shadow hover:bg-purple-50 transition">
                Sign Up
              </span>
            </div>
          </div>
        </div>
      </div>
    </AuthSimpleLayout>
  );
}
