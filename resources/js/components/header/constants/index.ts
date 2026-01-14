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
        label: 'Home',
        href: '/b2b',
        icon: 'Home',
    },
    {
        label: 'Packages',
        href: '#packages',
        icon: 'Briefcase',
        action: 'open-b2b-packages', // Special action to trigger packages dialog
    },
    {
        label: 'Consultation',
        href: '#consultation',
        icon: 'Phone',
        action: 'open-consultation', // Special action to trigger consultation dialog
    },
    {
        label: 'WhatsApp',
        href: 'https://wa.me/6281234567890',
        icon: 'MessageCircle',
        external: true,
    },
];

export const HEADER_CONFIG = {
    height: '80px',
    zIndex: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
} as const;
