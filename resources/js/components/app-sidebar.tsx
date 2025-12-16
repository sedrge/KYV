import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BuildingIcon, ChartBarIcon, LayoutGrid, LockIcon, SettingsIcon, ShieldIcon, Users2Icon, FileText } from 'lucide-react';
import AppLogo from './app-logo';
import PlaceController from '@/actions/App/Http/Controllers/PlaceController';
import TypePlaceController from '@/actions/App/Http/Controllers/TypePlaceController';
import UserController from '@/actions/App/Http/Controllers/UserController';
import ConfigController from '@/actions/App/Http/Controllers/ConfigController';
import RoleController from '@/actions/App/Http/Controllers/RoleController';
import PermissionController from '@/actions/App/Http/Controllers/PermissionController';
import AuditController from '@/actions/App/Http/Controllers/AuditController';
import VisitorController from '@/actions/App/Http/Controllers/VisitorController';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: ChartBarIcon,
    },
    {
        title: 'Configurations',
        href: ConfigController.index(),
        icon: SettingsIcon,
    },
    {
        title: 'Places',
        href: PlaceController.index(),
        icon: BuildingIcon,
    },
    {
        title: 'Types of Places',
        href: TypePlaceController.index(),
        icon: LayoutGrid,
    },
    {
        title: 'Users',
        href: UserController.index(),
        icon: Users2Icon,
    },

    {
        title: 'Visitors',
        href: VisitorController.index(),
        icon: Users2Icon,
    },

    {
        title: 'Roles',
        href: RoleController.index(),
        icon: ShieldIcon,
    },
    {
        title: 'Permissions',
        href: PermissionController.index(),
        icon: LockIcon,
    },
    {
        title: 'Audits',
        href: AuditController.index(),
        icon: FileText,
    },
];

export function AppSidebar() {
    const { themeConfig } = usePage<SharedData>().props;

    const sidebarHeaderStyle = themeConfig?.sidebar_header_bg
        ? { backgroundColor: themeConfig.sidebar_header_bg }
        : undefined;

    const sidebarMenuStyle = themeConfig?.sidebar_menu_bg
        ? { backgroundColor: themeConfig.sidebar_menu_bg }
        : undefined;

    const sidebarFooterStyle = themeConfig?.sidebar_footer_bg
        ? { backgroundColor: themeConfig.sidebar_footer_bg }
        : undefined;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader
                className="bg-white dark:bg-gray-800"
                style={sidebarHeaderStyle}
            >
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent
                className="bg-white dark:bg-gray-800"
                style={sidebarMenuStyle}
            >
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter
                className="bg-white dark:bg-gray-800"
                style={sidebarFooterStyle}
            >
                <NavFooter className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
