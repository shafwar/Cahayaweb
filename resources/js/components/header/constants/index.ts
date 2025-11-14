export const B2C_NAVIGATION_ITEMS = [
    {
        label: 'Home',
        href: '/home',
        icon: 'Home',
    },
    {
        label: 'About Us',
        href: '/about',
        icon: 'Info',
    },
    {
        label: 'Destinations',
        href: '/destinations',
        icon: 'MapPin',
        hasDropdown: true,
    },
    {
        label: 'Packages',
        href: '/packages',
        icon: 'Box',
        hasDropdown: true,
    },
    {
        label: 'Highlights',
        href: '/highlights',
        icon: 'Sparkles',
    },
    {
        label: 'Contact',
        href: '/contact',
        icon: 'Phone',
    },
];

export const B2B_NAVIGATION_ITEMS = [
    {
        label: 'Dashboard',
        href: '/b2b/dashboard',
    },
    {
        label: 'Packages',
        href: '/b2b/packages',
    },
    {
        label: 'Customers',
        href: '/b2b/customers',
    },
    {
        label: 'Reports',
        href: '/b2b/reports',
    },
    {
        label: 'Settings',
        href: '/b2b/settings',
    },
];

export const HEADER_CONFIG = {
    height: '80px',
    zIndex: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
} as const;
