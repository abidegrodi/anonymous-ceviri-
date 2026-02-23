const SITE_URL = 'https://www.anonymousceviri.com';
const API_BASE_URL = 'https://api.anonymousceviri.com/api/website';

interface GameListItem {
  gameId: number;
  name: string;
  slug?: string;
  releaseDate: string;
}

interface GamesApiResponse {
  status: boolean;
  data: {
    games: GameListItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function fetchAllGames(): Promise<GameListItem[]> {
  const allGames: GameListItem[] = [];
  let page = 1;
  let totalPages = 1;

  try {
    while (page <= totalPages) {
      const res = await fetch(`${API_BASE_URL}/games?page=${page}&limit=50`, {
        cache: 'no-store',
        headers: { 'Accept': 'application/json' },
      });

      if (!res.ok) break;

      const json: GamesApiResponse = await res.json();
      const { games, pagination } = json.data;

      allGames.push(...games);
      totalPages = pagination.totalPages;
      page++;
    }
  } catch {
    // API unavailable
  }

  return allGames;
}

export async function GET() {
  const games = await fetchAllGames();
  const today = new Date().toISOString().split('T')[0];

  const urls = games.map((game) => {
    const slug = game.slug || `${generateSlug(game.name)}-turkce-yama`;
    const lastmod = game.releaseDate
      ? new Date(game.releaseDate).toISOString().split('T')[0]
      : today;

    return `  <url>
    <loc>${SITE_URL}/ceviriler/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

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
