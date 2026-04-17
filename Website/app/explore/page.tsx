"use client";
import { useEffect, useState } from "react";
import { getPosts, getCategories } from "../../services/posts";
import PostCard from "../../components/PostCard";
import SkeletonPostCard from "../../components/SkeletonPostCard";
import { Post, Category } from "../../types";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [city, setCity] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const nextSearch = searchParams.get("search") || "";
    setSearch(nextSearch);
  }, [searchParams]);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    const [postsResult, categoriesResult] = await Promise.allSettled([
      getPosts({
        category: selectedCategory === "all" ? undefined : selectedCategory,
        city: city || undefined,
        search: search || undefined,
        page: 1,
        limit: 10
      }),
      getCategories()
    ]);

    if (postsResult.status === "fulfilled") {
      setPosts(postsResult.value);
    } else {
      setPosts([]);
      setError("No response from server. Please try again.");
    }

    if (categoriesResult.status === "fulfilled") {
      setCategories(categoriesResult.value);
    } else {
      setCategories([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, city, search]);

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <input
          className="border rounded px-4 py-2 w-full md:w-1/3"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-4 py-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          className="border rounded px-4 py-2"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => <SkeletonPostCard key={`skeleton-${idx}`} />)
          : posts.map((post, index) => (
              <motion.div
                key={post.id || `fallback-post-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
      </div>

      {!loading && error && (
        <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-blue-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-sm font-medium">{error}</p>
          <button
            type="button"
            onClick={fetchData}
            className="rounded-xl border border-blue-300 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-8 text-center shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">No posts found</h3>
          <p className="mt-2 text-sm text-slate-600">Try adjusting search, category, or city filters.</p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCity("");
              setSelectedCategory("all");
            }}
            className="mt-4 rounded-xl border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
