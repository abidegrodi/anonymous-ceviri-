const SITE_URL = 'https://www.anonymousceviri.com';

const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/duyuru', priority: '0.9', changefreq: 'daily' },
  { loc: '/uyelik', priority: '0.9', changefreq: 'daily' },
  { loc: '/bize-katilin', priority: '0.9', changefreq: 'daily' },
  { loc: '/gizlilik', priority: '0.9', changefreq: 'daily' },
  { loc: '/stellaris-turkce-yama', priority: '0.9', changefreq: 'daily' },
  { loc: '/%C3%BCcretsiz-yamalar', priority: '0.9', changefreq: 'daily' },
];

const posts = [
  'anonymous-ceviri-uyelik-sistemi-ve-client-kullanim-rehberi',
  'assassins-creed-origins-turkce-yama-uyelik-sistemi-eklendi',
  'avatar-frontiers-of-pandora-turkce-yama-uyelik-sistemine-eklendi',
  'alone-in-the-dark-turkce-yama-uyelik-sistemine-eklendi',
  '15-nisan-2024-genel-durum-guncellemesi',
  'f1-2023-turkce-yama-uyelik-sistemine-eklendi',
];

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  const pageUrls = staticPages.map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  );

  const postUrls = posts.map(
    (slug) => `  <url>
    <loc>${SITE_URL}/post/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...pageUrls, ...postUrls].join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
