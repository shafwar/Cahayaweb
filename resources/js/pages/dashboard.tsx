import SimpleLayout from '@/layouts/simple-layout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <SimpleLayout>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Welcome to Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400">Your dashboard content will appear here.</p>
                    </div>
                </div>
            </div>
        </SimpleLayout>
    );
}
