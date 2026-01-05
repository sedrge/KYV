import AppLogoIcon from '@/components/app-logo-icon';
import { ThemeProvider } from '@/components/theme-provider';
import { home } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface PublicLayoutProps {
    showHeader?: boolean;
}

export default function PublicLayout({
    children,
    showHeader = true,
}: PropsWithChildren<PublicLayoutProps>) {
    const { themeConfig } = usePage().props as any;

    return (
        <ThemeProvider initialConfig={themeConfig}>
            <div className="relative min-h-screen w-screen overflow-hidden">
                {/* VIDEO BACKGROUND */}
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="fixed inset-0 h-screen w-screen object-cover"
                >
                    <source src="/videos/visitor-bg1.mp4" type="video/mp4" />
                </video>

                {/* OVERLAY */}
                <div className="fixed inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40" />

                {/* CONTENT */}
                <div className="relative z-10">
                    {showHeader && (
                        <header className="flex items-center justify-between px-6 py-4">
                            <Link
                                href={home()}
                                className="flex items-center gap-2"
                            >
                                <AppLogoIcon className="h-8 w-8 fill-current text-white" />
                                <span className="text-lg font-semibold text-white">
                                    KYV
                                </span>
                            </Link>
                        </header>
                    )}

                    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10">
                        {children}
                    </main>
                </div>
            </div>
        </ThemeProvider>
    );
}
