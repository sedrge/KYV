import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    const { themeConfig } = usePage<SharedData>().props;

    const logoUrl = themeConfig?.logo_light
        ? `/storage/${themeConfig.logo_light}`
        : '/images/logo1.png';

    const organizationName = themeConfig?.organization_short_name
        || themeConfig?.organization_name
        || 'Laravel Starter Kit';

    const hasCustomLogo = themeConfig?.logo_light || themeConfig?.logo_dark;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                {hasCustomLogo ? (
                    <img
                        src={logoUrl}
                        alt={organizationName}
                        className="size-6 object-contain"
                    />
                ) : (
                    <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                )}
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {organizationName}
                </span>
            </div>
        </>
    );
}
