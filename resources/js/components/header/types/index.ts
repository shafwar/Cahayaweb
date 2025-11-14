export interface HeaderProps {
    className?: string;
}

export interface NavigationItem {
    label: string;
    href: string;
    children?: NavigationItem[];
}

export interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    navigationItems: NavigationItem[];
}

export interface LogoProps {
    className?: string;
    variant?: 'b2c' | 'b2b';
}
