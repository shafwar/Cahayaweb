import { Head, usePage } from '@inertiajs/react';

type SeoHeadProps = {
    title: string;
    description: string;
    image?: string;
    type?: 'website' | 'article' | 'business.business';
    keywords?: string;
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
};

export default function SeoHead({ 
    title, 
    description, 
    image, 
    type = 'website',
    keywords,
    author = 'Cahaya Anbiya Wisata Indonesia',
    publishedTime,
    modifiedTime
}: SeoHeadProps) {
    const { url } = usePage();
    let origin = typeof window !== 'undefined' ? window.location.origin : 'https://cahayaanbiya.com';
    // Remove www. prefix for canonical non-www URLs (consistent with server-side redirect)
    if (origin.startsWith('https://www.')) {
        origin = origin.replace('https://www.', 'https://');
    }
    const canonical = origin ? `${origin}${url}` : undefined;
    const ogImage = image ?? `${origin}/cahayanbiyalogo.png`;
    const fullTitle = title.includes('Cahaya Anbiya') ? title : `${title} | Cahaya Anbiya`;

    // Organization structured data for Google Business Profile
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'PT. Cahaya Anbiya Wisata Indonesia',
        alternateName: 'Cahaya Anbiya',
        url: 'https://cahayaanbiya.com',
        logo: `${origin}/cahayanbiyalogo.png`,
        description: 'B2B & B2C premium Hajj, Umrah, and travel services with trusted guidance. Travel Halal Spesialis Aqsa & 3TAN.',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Jakarta Selatan',
            addressRegion: 'DKI Jakarta',
            addressCountry: 'ID'
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+62-812-1237-9190',
            contactType: 'Customer Service',
            areaServed: 'ID',
            availableLanguage: ['Indonesian', 'English', 'Arabic']
        },
        sameAs: [
            'https://www.instagram.com/cahayaanbiya_id/'
        ],
        areaServed: {
            '@type': 'City',
            name: 'Jakarta Selatan'
        }
    };

    // LocalBusiness schema for Google Business Profile
    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'TravelAgency',
        name: 'PT. Cahaya Anbiya Wisata Indonesia',
        image: `${origin}/cahayanbiyalogo.png`,
        '@id': 'https://cahayaanbiya.com',
        url: 'https://cahayaanbiya.com',
        telephone: '+62-812-1237-9190',
        priceRange: '$$',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Jakarta Selatan',
            addressRegion: 'DKI Jakarta',
            addressCountry: 'ID'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: -6.2088,
            longitude: 106.8456
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
            ],
            opens: '08:00',
            closes: '17:00'
        },
        servesCuisine: 'Halal',
        areaServed: {
            '@type': 'City',
            name: 'Jakarta Selatan'
        }
    };

    return (
        <Head title={fullTitle}>
            {/* Basic Meta Tags */}
            <meta name="description" content={description} />
            <meta name="robots" content="index,follow" />
            <meta name="googlebot" content="index,follow" />
            {keywords && <meta name="keywords" content={keywords} />}
            {author && <meta name="author" content={author} />}
            
            {/* Canonical URL */}
            {canonical && <link rel="canonical" href={canonical} />}
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            {canonical && <meta property="og:url" content={canonical} />}
            {ogImage && <meta property="og:image" content={ogImage} />}
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="Cahaya Anbiya" />
            <meta property="og:locale" content="id_ID" />
            {publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
            
            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            {ogImage && <meta name="twitter:image" content={ogImage} />}
            <meta name="twitter:site" content="@cahayaanbiya_id" />
            
            {/* Structured Data - Organization */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            
            {/* Structured Data - LocalBusiness */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
            />
        </Head>
    );
}
