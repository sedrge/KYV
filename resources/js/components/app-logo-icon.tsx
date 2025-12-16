import { SVGAttributes } from 'react';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    const { themeConfig } = usePage<SharedData>().props;

    const logoUrl = themeConfig?.logo_light
        ? `/storage/${themeConfig.logo_light}`
        : '/images/logo1.png';

    const organizationName = themeConfig?.organization_short_name
        || themeConfig?.organization_name
        || 'Know your visitor';

    return (
        <img
            src={logoUrl}
            alt={organizationName}
            className={props.className || 'h-6 w-6'}
            style={{ objectFit: 'contain' }}
        />
    );


}
