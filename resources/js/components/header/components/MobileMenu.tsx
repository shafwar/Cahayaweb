import { Link } from '@inertiajs/react';
import { MobileMenuProps } from '../types';

export function MobileMenu({ isOpen, onClose, navigationItems }: MobileMenuProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="bg-opacity-50 fixed inset-0 z-40 bg-black md:hidden" onClick={onClose} />

            {/* Mobile Menu */}
            <div className="fixed top-0 right-0 z-50 h-full w-80 transform bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden">
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                        <button onClick={onClose} className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 px-6 py-4">
                        <ul className="space-y-2">
                            {navigationItems.map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        onClick={onClose}
                                        className="block rounded-md px-4 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-900"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Footer */}
                    <div className="border-t border-gray-200 p-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-500">© 2024 Cahaya Anbiya</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
