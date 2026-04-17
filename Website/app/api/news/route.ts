import { NextResponse } from "next/server";

type Rss2JsonItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  description?: string;
  author?: string;
};

const GOOGLE_RSS_URL =
  "https://news.google.com/rss/search?q=(civic+issues+OR+city+governance+OR+public+infrastructure)&hl=en-IN&gl=IN&ceid=IN:en";

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export async function GET() {
  try {
    const endpoint = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(GOOGLE_RSS_URL)}&count=9`;
    const response = await fetch(endpoint, {
      next: { revalidate: 1800 }
    });

    if (!response.ok) {
      throw new Error(`News fetch failed with status ${response.status}`);
    }

    const payload = await response.json();
    const items: Rss2JsonItem[] = Array.isArray(payload?.items) ? payload.items : [];

    const normalized = items.slice(0, 6).map((item) => ({
      title: item.title || "Untitled headline",
      url: item.link || "#",
      publishedAt: item.pubDate || "",
      source: item.author || "Google News",
      summary: stripHtml(item.description || "").slice(0, 170)
    }));

    return NextResponse.json({ items: normalized, success: true });
  } catch (error) {
    return NextResponse.json(
      {
        items: [],
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch civic news"
      },
      { status: 200 }
    );
  }
}
