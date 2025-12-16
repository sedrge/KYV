import AppLogoIcon from '@/components/app-logo-icon';
import { ThemeProvider } from '@/components/theme-provider';
import { home } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
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
            <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-4 py-6 sm:gap-6 sm:p-6 md:p-10">
                <div className="w-full max-w-sm px-2 sm:px-0">
                    <div className="flex flex-col gap-6 sm:gap-8">
                        <div className="flex flex-col items-center gap-3 sm:gap-4">
                            <Link
                                href={home()}
                                className="flex flex-col items-center gap-2 font-medium"
                            >
                                <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-md sm:h-9 sm:w-9">
                                    <AppLogoIcon className="h-8 w-8 fill-current text-[var(--foreground)] sm:size-9 dark:text-white" />
                                </div>
                                <span className="sr-only">{title}</span>
                            </Link>

                            <div className="space-y-1.5 text-center sm:space-y-2">
                                <h1 className="text-lg font-medium sm:text-xl">{title}</h1>
                                <p className="text-center text-xs text-muted-foreground sm:text-sm">
                                    {description}
                                </p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}
