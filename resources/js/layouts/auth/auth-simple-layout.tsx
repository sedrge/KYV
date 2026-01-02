import AppLogoIcon from '@/components/app-logo-icon';
import { ThemeProvider } from '@/components/theme-provider';
import { home } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { themeConfig } = usePage().props as any;

    return (
        <ThemeProvider initialConfig={themeConfig}>
            {/* ROOT */}
            <div className="relative h-screen w-screen overflow-hidden">
                {/* 🖼 IMAGE BACKGROUND (VISIBLE) */}
                <div
                    className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('/images/auth-bg3.jpg')",
                    }}
                />

                {/* 🌈 OVERLAY LÉGER (PAS DE BLUR) */}
                <div className="fixed inset-0 z-10 bg-gradient-to-br from-black/40 via-black/20 to-black/40" />

                {/* 🌟 CONTENT */}
                <div className="relative z-20 flex min-h-screen items-center justify-center px-4">
                    <div className="w-full max-w-sm">
                        <div className="flex flex-col gap-6 rounded-xl bg-background/90 p-6 shadow-2xl sm:p-8">
                            {/* LOGO */}
                            <div className="flex flex-col items-center gap-3">
                                <Link
                                    href={home()}
                                    className="flex flex-col items-center gap-2 font-medium"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-md">
                                        <AppLogoIcon className="h-9 w-9 fill-current text-[var(--foreground)] dark:text-white" />
                                    </div>
                                    <span className="sr-only">{title}</span>
                                </Link>

                                <div className="space-y-1 text-center">
                                    <h1 className="text-xl font-semibold">
                                        {title}
                                    </h1>
                                    <p className="text-sm text-muted-foreground">
                                        {description}
                                    </p>
                                </div>
                            </div>

                            {/* FORM */}
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}
