
import api from "../lib/api";
import { Post, Category, Comment, PostReport } from "../types";

const POST_PLACEHOLDER_IMAGE = "/post-placeholder.svg";
const FIXED_CATEGORIES = [
  "POTHOLE",
  "STREETLIGHT",
  "SANITATION",
  "WATER",
  "ELECTRICITY",
  "TRAFFIC",
  "POLLUTION",
  "CORRUPTION",
  "MUNICIPAL_SERVICES",
  "POLITICAL_GOVERNANCE",
  "PUBLIC_TRANSPORT",
  "ROAD_SAFETY",
  "DRAINAGE",
  "PARKS_PUBLIC_SPACES",
  "OTHER"
] as const;

function unwrap<T>(payload: any): T {
  return (payload?.data ?? payload) as T;
}

function mapCredibility(raw: any): "high" | "medium" | "low" {
  const direct = (raw?.credibility || "").toString().toLowerCase();
  if (direct === "high" || direct === "medium" || direct === "low") {
    return direct;
  }

  const aiLabel = (raw?.aiAnalysis?.label || "").toString().toLowerCase();
  if (aiLabel.includes("likely true")) return "high";
  if (aiLabel.includes("misleading")) return "low";

  return "medium";
}

function mapScore(raw: any): number | undefined {
  const direct = Number(raw?.score);
  const credibilityScore = Number(raw?.credibilityScore);
  const aiScore = Number(raw?.aiAnalysis?.score);

  const source = [direct, credibilityScore, aiScore].find((value) => Number.isFinite(value));
  if (!Number.isFinite(source as number)) return undefined;

  const parsed = source as number;
  const normalized = parsed <= 1 && parsed >= 0 ? parsed * 100 : parsed;
  const clamped = Math.max(0, Math.min(100, normalized));
  return Math.round(clamped);
}

function toCategoryName(value: string): string {
  if (!value) return "General";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function extractPostsArray(payload: any): any[] {
  const unwrapped = unwrap<any>(payload);
  const nested = unwrapped?.data ?? unwrapped;

  if (Array.isArray(nested)) return nested;
  if (Array.isArray(nested?.posts)) return nested.posts;
  if (Array.isArray(unwrapped?.posts)) return unwrapped.posts;

  return [];
}

function extractSinglePost(payload: any): any {
  const unwrapped = unwrap<any>(payload);
  const nested = unwrapped?.data ?? unwrapped;
  return nested?.post || nested || unwrapped;
}

function extractSinglePostWithMeta(payload: any): { post: any; liked?: boolean } {
  const unwrapped = unwrap<any>(payload);
  const nested = unwrapped?.data ?? unwrapped;
  if (nested?.post) {
    return {
      post: nested.post,
      liked: typeof nested?.liked === "boolean" ? nested.liked : undefined
    };
  }
  return {
    post: nested,
    liked: typeof nested?.liked === "boolean" ? nested.liked : undefined
  };
}

function extractCommentsArray(payload: any): any[] {
  const unwrapped = unwrap<any>(payload);
  const nested = unwrapped?.data ?? unwrapped;

  if (Array.isArray(nested)) return nested;
  if (Array.isArray(nested?.comments)) return nested.comments;
  if (Array.isArray(unwrapped?.comments)) return unwrapped.comments;

  return [];
}

function extractReportsArray(payload: any): any[] {
  const unwrapped = unwrap<any>(payload);
  const nested = unwrapped?.data ?? unwrapped;
  if (Array.isArray(nested)) return nested;
  if (Array.isArray(nested?.reports)) return nested.reports;
  return [];
}

function extractLocation(raw: any): { city?: string; lat?: number; lng?: number } {
  const city = raw?.location?.city || raw?.city || undefined;
  const coords = raw?.location?.coordinates;

  let lat = Number(raw?.location?.lat);
  let lng = Number(raw?.location?.lng);

  if (Array.isArray(coords) && coords.length >= 2) {
    // GeoJSON Point coordinates are [lng, lat].
    const coordLng = Number(coords[0]);
    const coordLat = Number(coords[1]);
    if (Number.isFinite(coordLat)) lat = coordLat;
    if (Number.isFinite(coordLng)) lng = coordLng;
  }

  return {
    city,
    lat: Number.isFinite(lat) ? lat : undefined,
    lng: Number.isFinite(lng) ? lng : undefined
  };
}

function normalizePost(raw: any): Post {
  const category = raw?.category || "GENERAL";
  const location = extractLocation(raw);
  const firstImage = Array.isArray(raw?.images)
    ? raw.images.find((img: any) => {
        if (typeof img === "string") return img.trim().length > 0;
        return typeof img?.url === "string" && img.url.trim().length > 0;
      })
    : undefined;
  const firstImageUrl = typeof firstImage === "string" ? firstImage : firstImage?.url;

  const likes = Array.isArray(raw?.likes) ? raw.likes : [];

  return {
    id: raw?.id || raw?._id || "",
    title: raw?.title || "Untitled",
    description: raw?.description || "",
    imageUrl: raw?.imageUrl || raw?.image || firstImageUrl || POST_PLACEHOLDER_IMAGE,
    category,
    categoryName: raw?.categoryName || toCategoryName(category),
    credibility: mapCredibility(raw),
    score: mapScore(raw),
    city: location.city,
    lat: location.lat,
    lng: location.lng,
    likeCount: likes.length,
    commentsCount: Number.isFinite(Number(raw?.commentsCount)) ? Number(raw.commentsCount) : 0,
    liked: typeof raw?.liked === "boolean" ? raw.liked : undefined,
    createdAt: raw?.createdAt || "",
    userId: raw?.userId || raw?.user?._id || raw?.createdBy?._id || "",
    userName: raw?.userName || raw?.user?.name || raw?.createdBy?.name || "Unknown"
  };
}

function normalizeComment(raw: any): Comment {
  return {
    id: raw?.id || raw?._id || "",
    postId: raw?.postId || raw?.post?._id || "",
    userId: raw?.userId?._id || raw?.userId || raw?.user?._id || "",
    userName: raw?.userName || raw?.user?.name || raw?.userId?.name || "Unknown",
    text: raw?.text || "",
    createdAt: raw?.createdAt || ""
  };
}

function normalizeReport(raw: any): PostReport {
  return {
    id: raw?.id || raw?._id || "",
    postId: raw?.postId || "",
    reportedById: raw?.reportedBy?._id || raw?.reportedBy || "",
    reportedByName: raw?.reportedBy?.name || "Unknown",
    reason: raw?.reason || "",
    status: raw?.status || "PENDING",
    createdAt: raw?.createdAt || ""
  };
}

type GetPostsOptions = {
  category?: string;
  city?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  search?: string;
};

// Supports both getPosts({ ...options }) and legacy getPosts(category, city, search)
export async function getPosts(options?: GetPostsOptions): Promise<Post[]>;
export async function getPosts(category?: string, city?: string, search?: string): Promise<Post[]>;
export async function getPosts(
  optionsOrCategory?: GetPostsOptions | string,
  cityArg?: string,
  searchArg?: string
): Promise<Post[]> {
  const options: GetPostsOptions =
    typeof optionsOrCategory === "string"
      ? { category: optionsOrCategory, city: cityArg, search: searchArg }
      : optionsOrCategory || {};

  const { category, city, page = 1, limit = 10, sortBy, search } = options;
  const params: any = { page, limit };
  if (category) params.category = category;
  if (city) params.city = city;
  if (sortBy) params.sortBy = sortBy;
  if (search) params.search = search;
  const res = await api.get("/posts", { params });
  const data = extractPostsArray(res.data);
  return Array.isArray(data) ? data.map(normalizePost) : [];
}

// Get trending posts
export async function getTrendingPosts(): Promise<Post[]> {
  return getPosts({ sortBy: "trending", page: 1, limit: 10 });
}

// Get all categories (from posts)
export async function getCategories(): Promise<Category[]> {
  return FIXED_CATEGORIES.map((id) => ({ id, name: toCategoryName(id) }));
}

// Get single post
export async function getPostById(id: string): Promise<Post> {
  const res = await api.get(`/posts/${id}`);
  const parsed = extractSinglePostWithMeta(res.data);
  const normalized = normalizePost(parsed.post);
  if (typeof parsed.liked === "boolean") {
    normalized.liked = parsed.liked;
  }
  return normalized;
}

// Create post (without image)
export async function createPost({
  title,
  description,
  category,
  image,
  type,
  location
}: {
  title: string;
  description: string;
  category: string;
  image?: File;
  type?: string;
  location?: { city: string; lat?: number; lng?: number };
}): Promise<Post> {
  const normalizedLocation: { city: string; lat?: number; lng?: number } = {
    city: (location?.city || "Unknown").trim()
  };

  if (typeof location?.lat === "number" && Number.isFinite(location.lat)) {
    normalizedLocation.lat = location.lat;
  }
  if (typeof location?.lng === "number" && Number.isFinite(location.lng)) {
    normalizedLocation.lng = location.lng;
  }

  if (image) {
    const buildFormData = (imageField: "images" | "image") => {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("type", type || "ISSUE");
      formData.append("location", JSON.stringify(normalizedLocation));
      formData.append("location[city]", normalizedLocation.city);
      if (typeof normalizedLocation.lat === "number") {
        formData.append("location[lat]", String(normalizedLocation.lat));
      }
      if (typeof normalizedLocation.lng === "number") {
        formData.append("location[lng]", String(normalizedLocation.lng));
      }
      formData.append(imageField, image);
      return formData;
    };

    try {
      const formRes = await api.post("/posts", buildFormData("images"));
      return normalizePost(extractSinglePost(formRes.data));
    } catch (error: any) {
      const message = String(error || "").toLowerCase();
      const shouldRetryWithSingleImageField =
        message.includes("unexpected field") ||
        message.includes("images") ||
        message.includes("multipart") ||
        message.includes("invalid file field");

      if (!shouldRetryWithSingleImageField) {
        throw error;
      }

      const retryRes = await api.post("/posts", buildFormData("image"));
      return normalizePost(extractSinglePost(retryRes.data));
    }
  }

  const res = await api.post("/posts", {
    title,
    description,
    category,
    type: type || "ISSUE",
    location: normalizedLocation
  });
  return normalizePost(extractSinglePost(res.data));
}

// Update post
export async function updatePost(postId: string, data: Partial<Post>): Promise<Post> {
  const res = await api.patch(`/posts/${postId}`, data);
  return normalizePost(extractSinglePost(res.data));
}

// Delete post
export async function deletePost(postId: string): Promise<void> {
  await api.delete(`/posts/${postId}`);
}

// Like post
export async function likePost(postId: string): Promise<{ post: Post; liked: boolean }> {
  const res = await api.post(`/posts/${postId}/like`);
  const parsed = extractSinglePostWithMeta(res.data);
  const post = normalizePost(parsed.post);
  if (!Array.isArray(parsed.post?.likes)) {
    // Let UI fallback keep consistent count when backend omits likes array in like response.
    post.likeCount = undefined;
  }
  const liked = typeof parsed.liked === "boolean" ? parsed.liked : Boolean(post.liked);
  post.liked = liked;
  return { post, liked };
}

// Get comments for a post
export async function getComments(postId: string, page = 1, limit = 20): Promise<Comment[]> {
  const res = await api.get(`/comments/${postId}`, { params: { page, limit } });
  const data = extractCommentsArray(res.data);
  return Array.isArray(data) ? data.map(normalizeComment) : [];
}

// Create comment
export async function addComment(postId: string, text: string): Promise<Comment> {
  const res = await api.post("/comments", { postId, text });
  return normalizeComment(unwrap<any>(res.data));
}

// Delete comment
export async function deleteComment(commentId: string): Promise<void> {
  await api.delete(`/comments/${commentId}`);
}

export async function createPostReport(postId: string, reason: string): Promise<PostReport> {
  const res = await api.post("/reports", { postId, reason });
  const data = unwrap<any>(res.data);
  const nested = data?.data ?? data;
  return normalizeReport(nested);
}

export async function getPostReports(postId: string): Promise<PostReport[]> {
  const res = await api.get(`/reports/post/${postId}`);
  const data = extractReportsArray(res.data);
  return Array.isArray(data) ? data.map(normalizeReport) : [];
}
