import api from "../lib/api";
import { User, Post } from "../types";

const AUTH_TOKEN_KEY = "token";
const AUTH_USER_KEY = "user";
const AUTH_COOKIE_KEY = "cl_token";

function unwrap<T>(payload: any): T {
  return (payload?.data ?? payload) as T;
}

function notifyAuthChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-changed"));
  }
}

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const parts = document.cookie.split(";").map((part) => part.trim());
  const row = parts.find((part) => part.startsWith(`${name}=`));
  return row ? decodeURIComponent(row.split("=").slice(1).join("=")) : "";
}

function writeTokenCookie(token: string): void {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${AUTH_COOKIE_KEY}=${encodeURIComponent(token)}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax${secure}`;
}

function clearTokenCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function getStoredToken(): string {
  if (typeof window === "undefined") return "";
  const fromStorage = window.localStorage.getItem(AUTH_TOKEN_KEY) || "";
  if (fromStorage) return fromStorage;
  return readCookie(AUTH_COOKIE_KEY) || "";
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function clearStoredSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
  clearTokenCookie();
  notifyAuthChange();
}

function persistSession(token: string, user?: User): void {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    writeTokenCookie(token);
  }
  if (user) {
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
  notifyAuthChange();
}

function normalizeUser(raw: any): User {
  const aboutText = raw?.about || raw?.bio || "";
  return {
    id: raw?.id || raw?._id || "",
    name: raw?.name || "",
    email: raw?.email || "",
    bio: aboutText,
    about: aboutText,
    role: raw?.role || undefined,
    isVerified: typeof raw?.isVerified === "boolean" ? raw.isVerified : undefined,
    isBanned: typeof raw?.isBanned === "boolean" ? raw.isBanned : undefined,
    isDeleted: typeof raw?.isDeleted === "boolean" ? raw.isDeleted : undefined,
    createdAt: raw?.createdAt || undefined,
    updatedAt: raw?.updatedAt || undefined,
    avatarUrl: raw?.avatarUrl || raw?.avatar || undefined
  };
}

function toCategoryName(value: string): string {
  if (!value) return "General";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function mapCredibility(raw: any): "high" | "medium" | "low" {
  const direct = (raw?.credibility || "").toString().toLowerCase();
  if (direct === "high" || direct === "medium" || direct === "low") return direct;

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
  return Math.round(Math.max(0, Math.min(100, normalized)));
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

  return {
    id: raw?.id || raw?._id || "",
    title: raw?.title || "Untitled",
    description: raw?.description || "",
    imageUrl: raw?.imageUrl || raw?.image || firstImageUrl || "/post-placeholder.svg",
    category,
    categoryName: raw?.categoryName || toCategoryName(category),
    credibility: mapCredibility(raw),
    score: mapScore(raw),
    city: location.city,
    lat: location.lat,
    lng: location.lng,
    createdAt: raw?.createdAt || "",
    userId: raw?.userId || raw?.user?._id || raw?.createdBy?._id || "",
    userName: raw?.userName || raw?.user?.name || raw?.createdBy?.name || "Unknown"
  };
}

function extractPostsArray(payload: any): any[] {
  const levelOne = payload?.data ?? payload ?? {};
  const levelTwo = levelOne?.data ?? levelOne;
  if (Array.isArray(levelTwo)) return levelTwo;
  if (Array.isArray(levelTwo?.posts)) return levelTwo.posts;
  if (Array.isArray(levelOne?.posts)) return levelOne.posts;
  return [];
}

function extractAuthPayload(payload: any): { token: string; user: any; message: string } {
  const levelOne = payload?.data ?? payload ?? {};
  const levelTwo = levelOne?.data ?? levelOne;

  const token = levelTwo?.token || levelOne?.token || "";
  const user = levelTwo?.user || levelOne?.user || levelTwo;
  const message = levelOne?.message || payload?.message || "";

  return { token, user, message };
}

function extractUserPayload(payload: any): any {
  const levelOne = payload?.data ?? payload ?? {};
  const levelTwo = levelOne?.data ?? levelOne;
  return levelTwo?.user || levelOne?.user || levelTwo;
}

// Auth endpoints
export async function login({ email, password }: { email: string; password: string }): Promise<{ token: string; user: User; message: string }> {
  const res = await api.post("/auth/login", { email, password });
  const parsed = extractAuthPayload(res.data);
  const result = {
    token: parsed.token,
    user: normalizeUser(parsed.user),
    message: parsed.message || "Login successful"
  };
  if (result.token) {
    persistSession(result.token, result.user);

    // Immediately hydrate user from /users/me when available so profile renders reliably.
    try {
      const freshProfile = await getMyProfile();
      persistSession(result.token, freshProfile);
      result.user = freshProfile;
    } catch {
      // Keep login successful even if profile refresh fails transiently.
    }
  }
  return result;
}

export async function signup({ name, email, password }: { name: string; email: string; password: string }): Promise<{ token: string; user: User; message: string }> {
  const res = await api.post("/auth/signup", { name, email, password });
  const parsed = extractAuthPayload(res.data);
  const result = {
    token: parsed.token,
    user: normalizeUser(parsed.user),
    message: parsed.message || "Signup successful"
  };
  if (result.token) {
    persistSession(result.token, result.user);
  }
  return result;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
  clearStoredSession();
}

export async function refreshToken(): Promise<{ token: string }> {
  const res = await api.post("/auth/refresh-token");
  const data = unwrap<any>(res.data);
  const token = data?.token || "";
  if (token) {
    persistSession(token);
  }
  return { token };
}

// User profile endpoints
export async function getMyProfile(): Promise<User> {
  const res = await api.get("/users/me");
  const user = normalizeUser(extractUserPayload(res.data));
  if (typeof window !== "undefined") {
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
  return user;
}

// Backward-compatible alias used by existing pages
export async function getUserInfo(): Promise<User> {
  return getMyProfile();
}

export async function updateMyProfile(data: Partial<User>): Promise<User> {
  const aboutValue = data.about ?? data.bio;
  const payload: Partial<User> = {
    ...data,
    ...(typeof aboutValue === "string" ? { about: aboutValue, bio: aboutValue } : {})
  };

  const res = await api.patch("/users/me", payload);
  let user = normalizeUser(extractUserPayload(res.data));

  // Some backend variants return partial payloads; refresh authoritative profile.
  try {
    const fresh = await getMyProfile();
    user = {
      ...fresh,
      // Keep explicit edits if backend propagates asynchronously.
      name: data.name ?? fresh.name,
      email: data.email ?? fresh.email,
      bio: aboutValue ?? fresh.bio,
      about: aboutValue ?? fresh.about ?? fresh.bio
    };
  } catch {
    user = {
      ...getStoredUser(),
      ...user,
      name: data.name ?? user.name,
      email: data.email ?? user.email,
      bio: aboutValue ?? user.bio,
      about: aboutValue ?? user.about ?? user.bio
    } as User;
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    notifyAuthChange();
  }
  return user;
}

export async function deleteMyAccount(): Promise<void> {
  await api.delete("/users/me");
}

export async function getUserById(userId: string): Promise<User> {
  const res = await api.get(`/users/${userId}`);
  return normalizeUser(extractUserPayload(res.data));
}

// Get posts by current user
export async function getUserPosts(userId?: string): Promise<Post[]> {
  if (userId) {
    const res = await api.get(`/posts`, { params: { page: 1, limit: 50, sortBy: "latest", userId } });
    const data = extractPostsArray(res.data);
    return Array.isArray(data) ? data.map(normalizePost) : [];
  }

  try {
    // Prefer backend endpoint that returns authenticated user's posts.
    const res = await api.get(`/users/me/posts`, { params: { page: 1, limit: 20 } });
    const data = extractPostsArray(res.data);
    return Array.isArray(data) ? data.map(normalizePost) : [];
  } catch {
    // Fallback for environments where /users/me/posts is unavailable.
    const resolvedUserId = getStoredUser()?.id || (await getMyProfile().then((u) => u.id).catch(() => ""));
    const res = await api.get(`/posts`, { params: { page: 1, limit: 50, sortBy: "latest" } });
    const data = extractPostsArray(res.data);
    const normalized = Array.isArray(data) ? data.map(normalizePost) : [];
    if (!resolvedUserId) return normalized;
    return normalized.filter((post) => post.userId === resolvedUserId);
  }
}
