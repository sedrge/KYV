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
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Building2Icon, BuildingIcon, ChartBarIcon, Folder, LayoutGrid, LockIcon, SettingsIcon, ShieldIcon, Users2Icon, FileText } from 'lucide-react';
import AppLogo from './app-logo';
import PlaceController from '@/actions/App/Http/Controllers/PlaceController';
import TypePlaceController from '@/actions/App/Http/Controllers/TypePlaceController';
import UserController from '@/actions/App/Http/Controllers/UserController';
import ConfigController from '@/actions/App/Http/Controllers/ConfigController';
import RoleController from '@/actions/App/Http/Controllers/RoleController';
import PermissionController from '@/actions/App/Http/Controllers/PermissionController';
import AuditController from '@/actions/App/Http/Controllers/AuditController';

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

const footerNavItems: NavItem[] = [
    {
        title: 'Africasys',
        href: 'https://www.africasys.com',
        icon: Folder,
    },
    {
        title: 'Know Your Visitors',
        href: 'https://www.africasys.com',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
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

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
