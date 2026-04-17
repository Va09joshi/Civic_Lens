"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Post } from "../types";
import CredibilityBadge from "./CredibilityBadge";
import { FaTrashAlt } from "react-icons/fa";

export default function PostCard({
  post,
  compact = false,
  onDelete,
  deleting = false
}: {
  post: Post;
  compact?: boolean;
  onDelete?: () => void;
  deleting?: boolean;
}) {
  const fallbackImage = "/post-placeholder.svg";
  const score = typeof post.score === "number" ? Math.max(0, Math.min(100, post.score)) : undefined;
  const scoreLabel =
    typeof score === "number" ? (score >= 75 ? "High" : score >= 45 ? "Moderate" : "Low") : "";

  return (
    <motion.div
      whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(37,99,235,0.14)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 350 }}
      className={`relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-200 ${compact ? "w-64 min-w-[16rem]" : ""}`}
    >
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-white text-red-600 shadow-sm hover:bg-red-50 disabled:opacity-60"
          aria-label="Delete post"
          title={deleting ? "Deleting..." : "Delete post"}
        >
          <FaTrashAlt size={14} />
        </button>
      )}
      <Link href={`/post/${post.id}`} className="block group">
        <img
          src={post.imageUrl}
          alt={post.title}
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src.includes(fallbackImage)) return;
            target.src = fallbackImage;
          }}
          className={`w-full ${compact ? "h-32" : "h-48"} object-cover group-hover:scale-105 transition-transform duration-300`}
        />
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <CredibilityBadge credibility={post.credibility} />
            {typeof score === "number" && (
              <span className="inline-block px-2 py-1 text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded">
                Trust Score: {score}/100 ({scoreLabel})
              </span>
            )}
            <span className="text-xs text-gray-400 font-medium">{post.categoryName}</span>
          </div>
          {typeof score === "number" && (
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${score}%` }} />
            </div>
          )}
          <h3 className="font-bold text-lg mb-1 line-clamp-2 text-secondary group-hover:text-primary transition-colors">{post.title}</h3>
          <p className="text-gray-500 text-sm line-clamp-2">{post.description}</p>
          {(post.city || (typeof post.lat === "number" && typeof post.lng === "number")) && (
            <p className="text-xs text-slate-500 mt-1">
              {post.city ? `${post.city} • ` : ""}
              {typeof post.lat === "number" && typeof post.lng === "number"
                ? `Lat ${post.lat.toFixed(4)}, Lng ${post.lng.toFixed(4)}`
                : ""}
            </p>
          )}
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>Likes: {post.likeCount || 0}</span>
            <span>Comments: {post.commentsCount || 0}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
