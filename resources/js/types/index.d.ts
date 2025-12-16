import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    themeConfig?: Config['content'] | null;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Place {
    id: string;
    name: string;
}

export interface Config {
    id?: string;
    place_id?: string | null;
    content: {
        organization_name?: string;
        organization_short_name?: string;
        slogan?: string;
        description?: string;
        logo_light?: string;
        logo_dark?: string;
        favicon?: string;
        background_login?: string;
        background_dashboard?: string;
        primary_color?: string;
        secondary_color?: string;
        accent_color?: string;
        footer_text?: string;
        sidebar_header_bg?: string;
        sidebar_header_text?: string;
        sidebar_header_font_family?: string;
        sidebar_header_font_size?: number;
        sidebar_menu_bg?: string;
        sidebar_menu_text?: string;
        sidebar_menu_font_family?: string;
        sidebar_menu_font_size?: number;
        sidebar_footer_bg?: string;
        sidebar_footer_text?: string;
        sidebar_footer_font_family?: string;
        sidebar_footer_font_size?: number;
        navbar_bg?: string;
        navbar_text?: string;
        navbar_border?: string;
        footer_links?: Array<{
            title: string;
            href: string;
        }>;
        [key: string]: unknown;
    };
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}
