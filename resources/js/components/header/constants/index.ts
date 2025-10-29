export const B2C_NAVIGATION_ITEMS = [
    {
        label: 'Home',
        href: '/',
        icon: 'home',
    },
    {
        label: 'About Us',
        href: '/about',
        icon: 'info',
    },
    {
        label: 'Destinations',
        href: '/destinations',
        icon: 'map-pin',
        hasDropdown: true,
        children: [
            { label: 'All Destinations', href: '/destinations' },
            { label: 'Saudi Arabia', href: '/destinations/saudi-arabia' },
            { label: 'Turkey', href: '/destinations/turkey' },
            { label: 'Bali', href: '/destinations/bali' },
        ],
    },
    {
        label: 'Packages',
        href: '/packages',
        icon: 'package',
        hasDropdown: true,
        children: [
            { label: 'All Packages', href: '/packages' },
            { label: 'Umrah Packages', href: '/packages/umrah' },
            { label: 'Hajj Packages', href: '/packages/hajj' },
            { label: 'Tour Packages', href: '/packages/tour' },
        ],
    },
    {
        label: 'Highlights',
        href: '/highlights',
        icon: 'star',
    },
    {
        label: 'Contact',
        href: '/contact',
        icon: 'phone',
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
    topBarHeight: '40px',
    zIndex: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
} as const;

// Color constants sesuai desain
export const HEADER_COLORS = {
    topBarBg: '#3F3F3F', // Abu-abu gelap
    mainNavBg: '#000000', // Hitam solid
    gold: '#FFD700', // Emas
    orange: '#A0522D', // Oranye gelap/merah bata
    white: '#FFFFFF',
    darkGray: '#2F2F2F', // Abu-abu gelap untuk toggle
    lightGray: '#9CA3AF', // Abu-abu terang untuk copyright
} as const;
