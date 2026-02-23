const SITE_URL = 'https://www.anonymousceviri.com';

const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/turkce-ceviriler', priority: '0.9', changefreq: 'daily' },
  { loc: '/duyurular', priority: '0.7', changefreq: 'weekly' },
  { loc: '/destek', priority: '0.5', changefreq: 'monthly' },
  { loc: '/iletisim', priority: '0.5', changefreq: 'monthly' },
  { loc: '/sss', priority: '0.5', changefreq: 'monthly' },
];

const announcementSlugs = [
  'starfield-turkce-yama-v1-2',
  'baldurs-gate-3-ceviri-tamamlandi',
  'cyberpunk-2077-dlc-yama-hazirligi',
  'elden-ring-turkce-yama-v2',
  'god-of-war-ragnarok-beta',
  'hogwarts-legacy-yama-duyurusu',
];

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  const urls = [
    ...staticPages.map(
      (page) => `  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    ),
    ...announcementSlugs.map(
      (slug) => `  <url>
    <loc>${SITE_URL}/duyurular/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
