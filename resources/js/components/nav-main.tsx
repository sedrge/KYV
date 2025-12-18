import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { NavItemWithSubMenu, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown } from 'lucide-react';

export function NavMain({ items = [] }: { items: NavItemWithSubMenu[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    item.href
                        ? renderNavItem(item as NavItem)
                        : renderNavItemsGroup(item)
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}


function renderNavItem(item: NavItem) {
    const page = usePage();
    return (
        <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
                asChild
                isActive={page.url.startsWith(
                    resolveUrl(item.href),
                )}
                tooltip={{ children: item.title }}
            >
                <Link href={item.href} prefetch>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}


 function renderNavItemsGroup(item: NavItemWithSubMenu) {
    const page = usePage();
    const isOpen = item.items?.some((subItem) =>
        page.url.startsWith(
            resolveUrl(subItem.href),
        )
    ) || false;

  return (
    <Collapsible defaultOpen={isOpen} className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger>
            {item.title}
            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent >
            {item.items?.map((subItem) => (
                renderNavItem(subItem)
            ))}
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}