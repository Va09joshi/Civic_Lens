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
      whileHover={{ y: -6, boxShadow: "0 12px 36px -4px rgba(37,99,235,0.12), 0 4px 12px -2px rgba(37,99,235,0.06)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100 transition-all duration-300 ${compact ? "w-64 min-w-[16rem]" : ""}`}
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
        <div className="overflow-hidden bg-slate-100 rounded-t-2xl">
          <img
            src={post.imageUrl}
            alt={post.title}
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src.includes(fallbackImage)) return;
              target.src = fallbackImage;
            }}
            className={`w-full ${compact ? "h-32" : "h-48"} object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500 ease-out`}
          />
        </div>
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <CredibilityBadge credibility={post.credibility} />
            {typeof score === "number" && (
              <span className="inline-block px-2 py-1 text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded">
                Trust Score: {score}/100 ({scoreLabel})
              </span>
            )}
            <span className="text-xs text-slate-400 font-medium">{post.categoryName}</span>
          </div>
          {typeof score === "number" && (
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${score}%` }} />
            </div>
          )}
          <h3 className="font-bold text-lg mb-1 line-clamp-2 text-slate-800 group-hover:text-blue-700 transition-colors duration-300">{post.title}</h3>
          <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{post.description}</p>
          {(post.city || (typeof post.lat === "number" && typeof post.lng === "number")) && (
            <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-medium">
              {post.city ? `${post.city} • ` : ""}
              {typeof post.lat === "number" && typeof post.lng === "number"
                ? `Lat ${post.lat.toFixed(4)}, Lng ${post.lng.toFixed(4)}`
                : ""}
            </p>
          )}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-medium border-t border-slate-50 pt-3">
            <span>Likes: {post.likeCount || 0}</span>
            <span>Comments: {post.commentsCount || 0}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
