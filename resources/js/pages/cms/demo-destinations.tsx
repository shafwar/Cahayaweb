import { EditableImage, EditableText } from '@/components/cms';
import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';

export default function CmsDemoDestinations() {
    const items = [
        { id: 1, name: 'Arab Saudi', description: 'Spiritual journey to the Holy Land', image: '/arabsaudi.jpg' },
        { id: 2, name: 'Dubai', description: 'Modern wonders & desert adventures', image: '/dubai1.jpeg' },
    ];

    return (
        <PublicLayout>
            <Head title="CMS Demo Destinations" />
            <div className="mx-auto max-w-6xl px-6 py-10">
                <EditableText sectionKey="cms.demo.title" value="CMS Demo Destinations" tag="h1" className="text-3xl font-bold" />
                <p className="mt-2 text-gray-500">
                    <EditableText
                        sectionKey="cms.demo.subtitle"
                        value="Try editing texts and replacing images inline. Only admins see the controls."
                        tag="span"
                    />
                </p>

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {items.map((d) => (
                        <div key={d.id} className="overflow-hidden rounded-xl border border-white/10 bg-black/50">
                            <EditableImage
                                sectionKey={`cms.demo.dest.${d.id}.image`}
                                src={d.image}
                                alt={d.name}
                                imgClassName="h-56 w-full object-cover"
                            />
                            <div className="p-4">
                                <EditableText
                                    sectionKey={`cms.demo.dest.${d.id}.name`}
                                    value={d.name}
                                    tag="h3"
                                    className="text-lg font-semibold text-white"
                                />
                                <EditableText
                                    sectionKey={`cms.demo.dest.${d.id}.desc`}
                                    value={d.description}
                                    tag="p"
                                    className="mt-1 text-sm text-gray-300"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}
