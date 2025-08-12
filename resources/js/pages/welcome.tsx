import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <div className="flex min-h-dvh items-center justify-center bg-background p-8 text-foreground">
            <Head title="Welcome" />
            <div className="max-w-xl space-y-6 text-center">
                <h1 className="text-4xl font-semibold">Cahaya Anbiya Wisata</h1>
                <p className="text-muted-foreground">Pilih mode untuk memulai.</p>
                <div className="flex items-center justify-center gap-4">
                    <Link href={route('b2b.index')} className="rounded-md bg-primary px-5 py-2 text-primary-foreground">
                        B2B
                    </Link>
                    <Link href={route('b2c.home')} className="rounded-md border px-5 py-2">
                        B2C
                    </Link>
                </div>
            </div>
        </div>
    );
}
