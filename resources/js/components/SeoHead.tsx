import { Head, usePage } from '@inertiajs/react';

type SeoHeadProps = {
    title: string;
    description: string;
    image?: string;
};

export default function SeoHead({ title, description, image }: SeoHeadProps) {
    const { url } = usePage();
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const canonical = origin ? `${origin}${url}` : undefined;
    const ogImage = image ?? `${origin}/cahayanbiyalogo.png`;

    return (
        <Head title={title}>
            <meta name="description" content={description} />
            <meta name="robots" content="index,follow" />
            {canonical && <link rel="canonical" href={canonical} />}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            {canonical && <meta property="og:url" content={canonical} />}
            {ogImage && <meta property="og:image" content={ogImage} />}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {ogImage && <meta name="twitter:image" content={ogImage} />}
        </Head>
    );
}
