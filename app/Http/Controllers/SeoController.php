<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;

class SeoController extends Controller
{
    public function robotsTxt(): Response
    {
        $baseUrl = config('app.url') ?: request()->getSchemeAndHttpHost();
        $baseUrl = preg_replace('#^http://#', 'https://', $baseUrl);
        $baseUrl = preg_replace('#^https://www\.#', 'https://', $baseUrl);
        $baseUrl = rtrim($baseUrl, '/');

        $content = implode("\n", [
            'User-agent: *',
            'Allow: /',
            'Disallow: /admin',
            'Disallow: /b2b/register',
            'Disallow: /b2b/pending',
            'Disallow: /api',
            'Disallow: /debug',
            '',
            '# Sitemap',
            'Sitemap: '.$baseUrl.'/sitemap.xml',
            '',
            '# Crawl-delay',
            'Crawl-delay: 1',
        ]);

        return response($content, 200)
            ->header('Content-Type', 'text/plain; charset=utf-8')
            ->header('Cache-Control', 'public, max-age=86400');
    }

    public function sitemapXml(): Response
    {
        $baseUrl = config('app.url') ?: request()->getSchemeAndHttpHost();
        $baseUrl = preg_replace('#^http://#', 'https://', $baseUrl);
        $baseUrl = preg_replace('#^https://www\.#', 'https://', $baseUrl);
        $baseUrl = rtrim($baseUrl, '/');

        $urls = [
            ['path' => '/', 'priority' => '1.0', 'changefreq' => 'daily', 'lastmod' => now()->toAtomString()],
            ['path' => '/home', 'priority' => '0.9', 'changefreq' => 'daily', 'lastmod' => now()->toAtomString()],
            ['path' => '/about', 'priority' => '0.8', 'changefreq' => 'monthly', 'lastmod' => now()->subDays(7)->toAtomString()],
            ['path' => '/destinations', 'priority' => '0.9', 'changefreq' => 'weekly', 'lastmod' => now()->toAtomString()],
            ['path' => '/packages', 'priority' => '0.9', 'changefreq' => 'weekly', 'lastmod' => now()->toAtomString()],
            ['path' => '/highlights', 'priority' => '0.8', 'changefreq' => 'weekly', 'lastmod' => now()->toAtomString()],
            ['path' => '/blog', 'priority' => '0.8', 'changefreq' => 'weekly', 'lastmod' => now()->toAtomString()],
            ['path' => '/contact', 'priority' => '0.7', 'changefreq' => 'monthly', 'lastmod' => now()->subDays(30)->toAtomString()],
        ];

        $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
        $xml .= "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"\n";
        $xml .= "        xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n";
        $xml .= "        xsi:schemaLocation=\"http://www.sitemaps.org/schemas/sitemap/0.9\n";
        $xml .= "        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd\">\n";

        foreach ($urls as $url) {
            $xml .= "  <url>\n";
            $xml .= '    <loc>'.htmlspecialchars($baseUrl.$url['path'], ENT_XML1, 'UTF-8')."</loc>\n";
            $xml .= '    <lastmod>'.$url['lastmod']."</lastmod>\n";
            $xml .= '    <changefreq>'.$url['changefreq']."</changefreq>\n";
            $xml .= '    <priority>'.$url['priority']."</priority>\n";
            $xml .= "  </url>\n";
        }

        $xml .= "</urlset>\n";

        return response($xml, 200)
            ->header('Content-Type', 'application/xml; charset=utf-8')
            ->header('Cache-Control', 'public, max-age=3600');
    }
}
