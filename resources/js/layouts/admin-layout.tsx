import AdminHeader from '@/components/AdminHeader';
import AdminMobileSidebar from '@/components/AdminMobileSidebar';
import AdminSidebar from '@/components/AdminSidebar';
import { Head } from '@inertiajs/react';
import { type ReactNode, useState } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function AdminLayout({ children, title = 'Admin Dashboard' }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const currentPath = window.location.pathname;

    return (
        <div className="flex h-screen w-full bg-gray-900">
            <Head title={title} />

            {/* Mobile sidebar overlay */}
            <AdminMobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} currentPath={currentPath} />

            {/* Desktop sidebar - Fixed */}
            <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50">
                <AdminSidebar currentPath={currentPath} />
            </div>

            {/* Main content area - Full width on mobile, offset on desktop */}
            <div className="flex flex-1 flex-col lg:ml-80">
                {/* Fixed header */}
                <AdminHeader title={title} onMenuClick={() => setSidebarOpen(true)} />

                {/* Page content - Scrollable */}
                <main className="flex-1 overflow-y-auto bg-gray-900">
                    <div className="p-4 sm:p-6 lg:p-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
