import { router } from '@inertiajs/react';

let isLoggingOut = false;

export function logout() {
    if (isLoggingOut) return;
    isLoggingOut = true;

    const token = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;

    router.post(
        '/logout',
        {},
        {
            headers: token ? { 'X-CSRF-TOKEN': token } : undefined,
            preserveScroll: false,
            onFinish: () => {
                isLoggingOut = false;
            },
        },
    );
}

