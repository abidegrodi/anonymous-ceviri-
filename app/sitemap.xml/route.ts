const SITE_URL = 'https://www.anonymousceviri.com';

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  const sitemaps = [
    { loc: `${SITE_URL}/pages.xml`, lastmod: today },
    { loc: `${SITE_URL}/games.xml`, lastmod: today },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (s) => `  <sitemap>
    <loc>${s.loc}</loc>
    <lastmod>${s.lastmod}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
