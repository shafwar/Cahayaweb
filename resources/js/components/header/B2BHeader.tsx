import { Link } from '@inertiajs/react';
import { Logo } from './components/Logo';
import { MobileMenu } from './components/MobileMenu';
import { Navigation } from './components/Navigation';
import { B2B_NAVIGATION_ITEMS, HEADER_CONFIG } from './constants';
import { useMobileMenu } from './hooks/useMobileMenu';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { HeaderProps } from './types';

export function B2BHeader({ className = '' }: HeaderProps) {
    const { isOpen, toggleMenu, closeMenu } = useMobileMenu();
    const { isScrolled, opacity, blurIntensity, scrollY } = useSmoothScroll({ threshold: 10, hideOnScrollDown: false });

    // Parallax shift: small translateY based on scroll, capped for stability
    const parallaxShift = Math.min(12, Math.max(0, scrollY * 0.08));

    return (
        <>
            <header
                className={`fixed top-0 right-0 left-0 z-50 ${className}`}
                style={{
                    height: HEADER_CONFIG.height,
                    zIndex: HEADER_CONFIG.zIndex,
                    backgroundColor: `rgba(255, 255, 255, ${0.85 + opacity * 0.15})`,
                    backdropFilter: `blur(${blurIntensity}px)`,
                    WebkitBackdropFilter: `blur(${blurIntensity}px)`,
                    borderBottom: isScrolled ? '1px solid rgba(229, 231, 235, 1)' : '1px solid transparent',
                    boxShadow: isScrolled ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none',
                    transition: 'transform 0.18s ease-out, opacity 0.24s ease, backdrop-filter 0.24s ease, box-shadow 0.24s ease',
                    willChange: 'transform, opacity, backdrop-filter',
                    transform: `translateY(${parallaxShift}px) translateZ(0)`,
                    WebkitTransform: 'translateZ(0)',
                }}
            >
                <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-full items-center justify-between">
                        {/* Logo */}
                        <Logo variant="b2b" />

                        {/* Desktop Navigation */}
                        <Navigation items={B2B_NAVIGATION_ITEMS} />

                        {/* Right Side Actions */}
                        <div className="hidden items-center space-x-4 md:flex">
                            <Link href="/b2b/profile" className="font-medium text-gray-700 transition-colors duration-200 hover:text-gray-900">
                                Profile
                            </Link>
                            <Link
                                href="/auth/logout"
                                method="post"
                                className="rounded-md bg-red-600 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-red-700"
                            >
                                Logout
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 md:hidden"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <MobileMenu isOpen={isOpen} onClose={closeMenu} navigationItems={B2B_NAVIGATION_ITEMS} />

            {/* Spacer untuk mengkompensasi fixed header */}
            <div style={{ height: HEADER_CONFIG.height }} />
        </>
    );
}
