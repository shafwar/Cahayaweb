import { Link } from '@inertiajs/react';
import { ArrowRight, ArrowLeftRight, Grid3x3 } from 'lucide-react';
import { Logo } from './components/Logo';
import { MobileMenu } from './components/MobileMenu';
import { Navigation } from './components/Navigation';
import { B2C_NAVIGATION_ITEMS, HEADER_CONFIG, HEADER_COLORS } from './constants';
import { useMobileMenu } from './hooks/useMobileMenu';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { HeaderProps } from './types';

export function B2CHeader({ className = '' }: HeaderProps) {
    const { isOpen, toggleMenu, closeMenu } = useMobileMenu();
    const { isScrolled } = useSmoothScroll({ threshold: 10, hideOnScrollDown: false });

    return (
        <>
            {/* Top Bar - Abu-abu gelap */}
            <div
                className="fixed top-0 left-0 right-0 z-[10000] hidden items-center justify-between px-4 lg:flex"
                style={{
                    height: HEADER_CONFIG.topBarHeight,
                    backgroundColor: HEADER_COLORS.topBarBg,
                    color: HEADER_COLORS.white,
                }}
            >
                <div className="flex items-center">
                    <Grid3x3 className="h-4 w-4 text-white" />
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span>All Bookmarks</span>
                </div>
            </div>

            {/* Main Navigation Bar - Hitam */}
            <header
                className={`fixed left-0 right-0 z-[9999] ${className}`}
                style={{
                    top: HEADER_CONFIG.topBarHeight,
                    height: HEADER_CONFIG.height,
                    backgroundColor: HEADER_COLORS.mainNavBg,
                    borderBottom: 'none',
                }}
            >
                <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-full items-center justify-between">
                        {/* Logo */}
                        <Logo variant="b2c" />

                        {/* Desktop Navigation */}
                        <Navigation items={B2C_NAVIGATION_ITEMS} />

                        {/* Right Side Actions */}
                        <div className="hidden items-center gap-4 lg:flex">
                            {/* B2C → B2B Button */}
                            <Link
                                href="/home"
                                className="flex items-center gap-2 rounded-md border border-white px-4 py-2 font-medium text-white transition-colors hover:bg-gray-900"
                            >
                                <ArrowLeftRight className="h-[18px] w-[18px]" />
                                B2C → B2B
                            </Link>

                            {/* Login Button */}
                            <Link
                                href="/auth/login"
                                className="flex items-center gap-2 rounded-md border px-4 py-2 font-medium text-white transition-colors hover:opacity-90"
                                style={{
                                    backgroundColor: HEADER_COLORS.orange,
                                    borderColor: HEADER_COLORS.orange,
                                }}
                            >
                                <span>Login</span>
                                <ArrowRight className="h-[18px] w-[18px]" />
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="rounded-md p-2 text-white transition-colors hover:bg-gray-900 lg:hidden"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <MobileMenu isOpen={isOpen} onClose={closeMenu} navigationItems={B2C_NAVIGATION_ITEMS} />

            {/* Spacer untuk kompensasi fixed header */}
            <div style={{ height: `calc(${HEADER_CONFIG.topBarHeight} + ${HEADER_CONFIG.height})` }} />
        </>
    );
}
