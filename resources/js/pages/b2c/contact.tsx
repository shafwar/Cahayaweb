import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';

export default function Contact() {
    return (
        <PublicLayout>
            <Head title="Contact" />
            <section className="mx-auto max-w-6xl p-6 md:p-10">
                <h1 className="text-3xl font-semibold">Contact</h1>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <form className="grid gap-4 rounded-xl border p-6">
                        <div className="grid gap-1">
                            <label className="text-sm">Name</label>
                            <input className="rounded-md border bg-background p-2" placeholder="John Doe" />
                        </div>
                        <div className="grid gap-1">
                            <label className="text-sm">Nationality</label>
                            <input className="rounded-md border bg-background p-2" placeholder="Indonesia" />
                        </div>
                        <div className="grid gap-1 md:grid-cols-2 md:items-center md:gap-3">
                            <div>
                                <label className="text-sm">Group Size</label>
                                <input className="mt-1 w-full rounded-md border bg-background p-2" placeholder="4" />
                            </div>
                            <div>
                                <label className="text-sm">WhatsApp</label>
                                <input className="mt-1 w-full rounded-md border bg-background p-2" placeholder="+62" />
                            </div>
                        </div>
                        <div className="grid gap-1 md:grid-cols-2 md:items-center md:gap-3">
                            <div>
                                <label className="text-sm">Email</label>
                                <input className="mt-1 w-full rounded-md border bg-background p-2" placeholder="you@mail.com" />
                            </div>
                            <div>
                                <label className="text-sm">Notes</label>
                                <input className="mt-1 w-full rounded-md border bg-background p-2" placeholder="Trip preferences" />
                            </div>
                        </div>
                        <button type="button" className="mt-2 rounded-md bg-primary px-4 py-2 text-primary-foreground">
                            Send
                        </button>
                    </form>
                    <div className="grid content-start gap-4">
                        <div className="rounded-xl border p-6">
                            <h3 className="font-medium">Alternative Contacts</h3>
                            <p className="text-sm text-muted-foreground">Email: hello@cahaya-anbiya.com</p>
                            <p className="text-sm text-muted-foreground">WhatsApp: +62 812-3456-7890</p>
                        </div>
                        <div className="rounded-xl border p-6">
                            <h3 className="font-medium">Social Media</h3>
                            <div className="mt-2 flex gap-4 text-sm">
                                <a href="#" className="hover:text-accent">
                                    Instagram
                                </a>
                                <a href="#" className="hover:text-accent">
                                    TikTok
                                </a>
                                <a href="#" className="hover:text-accent">
                                    YouTube
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
