/**
 * Strapi panel API - Duyurular ve SSS için.
 * Panel çalışırken: http://localhost:1337
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export interface StrapiDuyuru {
  id: number;
  documentId?: string;
  title: string;
  subtitle?: string;
  slug: string;
  category?: string;
  date?: string;
  readTime?: string;
  tagText?: string;
  tagColor?: string;
  content?: string;
  author?: string;
  version?: string;
  note?: string;
  videoThumbnail?: string;
  image?: { data?: { attributes?: { url: string } } };
  heroImage?: { data?: { attributes?: { url: string } } };
  screenshots?: { data?: Array<{ attributes?: { url: string } }> };
  changes?: string[] | Record<string, unknown>;
  platforms?: string[] | Record<string, unknown>;
}

function getMediaUrl(media: StrapiDuyuru["image"]) {
  const url = media?.data?.attributes?.url;
  return url ? `${STRAPI_URL}${url}` : null;
}

function getMediaUrls(media: StrapiDuyuru["screenshots"]) {
  const list = media?.data ?? [];
  return list.map((item) => `${STRAPI_URL}${item.attributes?.url ?? ""}`).filter(Boolean);
}

/** Liste sayfası için: Strapi cevabını uygulama tipine çevirir */
export function mapStrapiDuyuruToAnnouncement(item: StrapiDuyuru) {
  const imageUrl = getMediaUrl(item.image);
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    subtitle: item.subtitle ?? "",
    category: item.category ?? "Duyuru",
    date: item.date ?? "",
    readTime: item.readTime ?? "",
    image: imageUrl ?? "https://placehold.co/400x250",
    tag:
      item.tagText != null && item.tagText !== ""
        ? { text: item.tagText, color: (item.tagColor as "purple" | "green" | "yellow") ?? "purple" }
        : undefined,
  };
}

/** Detay sayfası için: Strapi duyurusunu blog post formatına çevirir */
export function mapStrapiDuyuruToBlogPost(item: StrapiDuyuru) {
  const heroUrl = getMediaUrl(item.heroImage) ?? getMediaUrl(item.image);
  const changes = Array.isArray(item.changes)
    ? item.changes
    : typeof item.changes === "object" && item.changes !== null
      ? Object.values(item.changes) as string[]
      : [];
  const platforms = Array.isArray(item.platforms)
    ? item.platforms
    : typeof item.platforms === "object" && item.platforms !== null
      ? Object.values(item.platforms) as string[]
      : [];

  return {
    slug: item.slug,
    title: item.title,
    titleHighlight: item.subtitle ?? "",
    category: item.category ?? "Duyuru",
    date: item.date ?? "",
    author: item.author ?? "Admin",
    version: item.version ?? "",
    readTime: item.readTime ?? "",
    platforms,
    heroImage: heroUrl ?? "/assets/blogicsayfahero.png",
    content: item.content ?? "",
    changes,
    videoThumbnail: item.videoThumbnail ?? "",
    screenshots: getMediaUrls(item.screenshots),
    note: item.note ?? "",
  };
}

function normalizeStrapiItem<T>(item: { id?: number; documentId?: string; attributes?: T } & T): T & { id: number } {
  if (item.attributes && typeof item.attributes === "object") {
    return { ...item.attributes, id: item.id ?? 0 } as T & { id: number };
  }
  return { ...item, id: (item as { id?: number }).id ?? 0 } as T & { id: number };
}

/** Tüm yayınlanmış duyuruları getirir */
export async function fetchDuyurular(): Promise<StrapiDuyuru[]> {
  const res = await fetch(
    `${STRAPI_URL}/api/duyurular?publicationState=live&populate=image,heroImage,screenshots`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) {
    throw new Error("Duyurular yüklenemedi");
  }
  const json = await res.json();
  const data = json.data ?? json;
  const list = Array.isArray(data) ? data : [];
  return list.map((item: unknown) => normalizeStrapiItem(item as { id?: number; attributes?: StrapiDuyuru } & StrapiDuyuru));
}

/** Slug ile tek duyuru getirir */
export async function fetchDuyuruBySlug(slug: string): Promise<StrapiDuyuru | null> {
  const res = await fetch(
    `${STRAPI_URL}/api/duyurular?filters[slug][$eq]=${encodeURIComponent(slug)}&publicationState=live&populate=image,heroImage,screenshots`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return null;
  const json = await res.json();
  const data = json.data ?? json;
  const list = Array.isArray(data) ? data : data?.length != null ? data : [data];
  const raw = list[0];
  return raw ? normalizeStrapiItem(raw as { id?: number; attributes?: StrapiDuyuru } & StrapiDuyuru) : null;
}

// ─── Editörün Seçimi (Single Type) ───

export interface StrapiEditorPick {
  id: number;
  label?: string;
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink: string;
  backgroundImage?: { data?: { attributes?: { url: string } } };
}

export async function fetchEditorPick(): Promise<StrapiEditorPick | null> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/editor-pick?publicationState=live&populate=backgroundImage`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const data = json.data;
    if (!data) return null;
    const item = normalizeStrapiItem(data as { id?: number; attributes?: StrapiEditorPick } & StrapiEditorPick);
    if (item.backgroundImage?.data?.attributes?.url) {
      const url = item.backgroundImage.data.attributes.url;
      if (!url.startsWith("http")) {
        item.backgroundImage = {
          data: { attributes: { url: `${STRAPI_URL}${url}` } },
        };
      }
    }
    return item;
  } catch {
    return null;
  }
}

// ─── FAQ (Sıkça Sorulan Sorular) ───

export interface StrapiFaq {
  id: number;
  question: string;
  answer: string;
  category: string;
  order?: number;
}

/** Tüm FAQ kayıtlarını getirir (sıralı) */
export async function fetchFaqs(): Promise<StrapiFaq[]> {
  const res = await fetch(
    `${STRAPI_URL}/api/faqs?sort=order:asc&pagination[pageSize]=100`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) {
    throw new Error("SSS yüklenemedi");
  }
  const json = await res.json();
  const data = json.data ?? json;
  const list = Array.isArray(data) ? data : [];
  return list.map((item: unknown) => normalizeStrapiItem(item as { id?: number; attributes?: StrapiFaq } & StrapiFaq));
}
