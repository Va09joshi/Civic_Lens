"use client";
import { useEffect, useState } from "react";
import { getPostById, getComments, addComment, deleteComment, likePost, createPostReport, getPostReports } from "../../../services/posts";
import { getStoredUser } from "../../../services/auth";
import { useParams } from "next/navigation";
import Loader from "../../../components/Loader";
import CommentBox from "../../../components/CommentBox";
import Button from "../../../components/Button";
import CredibilityBadge from "../../../components/CredibilityBadge";
import ReportDialog from "../../../components/ReportDialog";
import { Post, Comment, PostReport } from "../../../types";
import { motion } from "framer-motion";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState("");
  const [reports, setReports] = useState<PostReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState("");
  const [liking, setLiking] = useState(false);
  const [likeBump, setLikeBump] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const currentUserId = getStoredUser()?.id || "";

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setCommentsLoading(true);
    setCommentsError("");

    getPostById(id as string)
      .then((data) => {
        if (cancelled) return;
        setPost(data);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    getComments(id as string)
      .then((data) => {
        if (cancelled) return;
        setComments(data);
      })
      .catch((err: any) => {
        if (cancelled) return;
        setCommentsError(err?.message || "Failed to load comments.");
        setComments([]);
      })
      .finally(() => {
        if (cancelled) return;
        setCommentsLoading(false);
      });

    getPostReports(id as string)
      .then((data) => {
        if (cancelled) return;
        setReports(data);
      })
      .catch((err: any) => {
        if (cancelled) return;
        setReportsError(err?.message || "Failed to load reports.");
        setReports([]);
      })
      .finally(() => {
        if (cancelled) return;
        setReportsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleComment = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await addComment(id as string, comment);
      setComment("");
      setCommentsError("");
      const nextComments = await getComments(id as string);
      setComments(nextComments);
    } catch (err: any) {
      setCommentsError(err?.message || "Failed to post comment.");
    }
    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    const ok = window.confirm("Delete this comment?");
    if (!ok) return;
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((entry) => entry.id !== commentId));
    } catch (err: any) {
      setCommentsError(err?.message || "Failed to delete comment.");
    }
  };

  const handleToggleLike = async () => {
    if (!post || liking) return;

    const previous = post;
    const nextLiked = !Boolean(post.liked);
    const nextLikeCount = Math.max(0, (post.likeCount || 0) + (nextLiked ? 1 : -1));

    setPost({ ...post, liked: nextLiked, likeCount: nextLikeCount });
    setLikeBump((v) => v + 1);
    setLiking(true);
    try {
      const result = await likePost(post.id);
      setPost((current) => {
        if (!current) return result.post;
        return {
          ...current,
          ...result.post,
          liked: result.liked,
          likeCount:
            typeof result.post.likeCount === "number"
              ? result.post.likeCount
              : Math.max(0, (current.likeCount || 0) + (result.liked ? 1 : -1))
        };
      });
      setActionMessage(result.liked ? "You liked this post." : "You removed your like.");
    } catch (err: any) {
      setPost(previous);
      setActionMessage(err?.message || "Like update failed.");
    } finally {
      setLiking(false);
    }
  };

  const handleReportPost = async (reason: string) => {
    if (!post) return;
    setReporting(true);
    try {
      await createPostReport(post.id, reason);
      const nextReports = await getPostReports(post.id);
      setReports(nextReports);
      setReportsError("");
      setActionMessage("Report submitted successfully.");
      setReportOpen(false);
    } catch (err: any) {
      setReportsError(err?.message || "Failed to submit report.");
      setActionMessage(err?.message || "Failed to submit report.");
    }
    setReporting(false);
  };

  if (loading || !post) return <Loader />;

  const trustScore = typeof post.score === "number" ? Math.max(0, Math.min(100, post.score)) : undefined;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="rounded-card shadow-card bg-white p-6 mb-6">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-64 object-cover rounded-card mb-4"
        />
        <div className="flex items-center gap-2 mb-2">
          <CredibilityBadge credibility={post.credibility} />
          <span className="text-sm text-gray-500">{post.categoryName}</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <p className="mb-4">{post.description}</p>
        {typeof trustScore === "number" && (
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between text-xs font-semibold text-pink-700">
              <span>Trust Score</span>
              <span>{trustScore}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-pink-100 overflow-hidden">
              <div className="h-full rounded-full bg-pink-500" style={{ width: `${trustScore}%` }} />
            </div>
          </div>
        )}
        {actionMessage && <p className="mb-3 text-sm font-medium text-pink-700">{actionMessage}</p>}
        <div className="flex gap-4 mb-4">
          <motion.div
            key={`like-${likeBump}`}
            initial={{ scale: 1 }}
            animate={{ scale: post.liked ? [1, 1.08, 1] : [1, 1.03, 1] }}
            transition={{ duration: 0.24 }}
          >
            <Button
              variant="ghost"
              icon="like"
              onClick={handleToggleLike}
              disabled={liking}
              className={`border px-4 ${
                post.liked
                  ? "border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {liking ? "Updating..." : `${post.liked ? "Liked" : "Like"} (${post.likeCount || 0})`}
            </Button>
          </motion.div>
          <Button variant="ghost" icon="share" />
          <Button variant="outline" onClick={() => setReportOpen(true)} className="border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100">
            Report
          </Button>
        </div>
        <p className="text-xs text-slate-500">Comments: {post.commentsCount || 0}</p>
      </div>
      <div className="rounded-card shadow-card bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">Comments</h2>
        {commentsError && (
          <div className="mb-3 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
            {commentsError}
          </div>
        )}
        <div className="flex gap-2 mb-4">
          <CommentBox
            value={comment}
            onChange={setComment}
            disabled={submitting}
            placeholder="Add a comment..."
          />
          <Button onClick={handleComment} disabled={submitting || !comment.trim()}>
            {submitting ? "Posting..." : "Post"}
          </Button>
        </div>
        <div className="space-y-4">
          {commentsLoading && <p className="text-sm text-slate-500">Loading comments...</p>}
          {!commentsLoading && comments.length === 0 && (
            <p className="text-sm text-slate-500">No comments yet. Be the first to comment.</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-start gap-3 mb-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {(c.userName || "U").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{c.userName}</span>
                    <span className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{c.text}</p>
                </div>
                {currentUserId && c.userId === currentUserId && (
                  <button
                    onClick={() => handleDeleteComment(c.id)}
                    className="rounded-lg border border-red-100 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-card shadow-card bg-white p-6 mt-6">
        <h2 className="text-lg font-semibold mb-3">Reports</h2>
        {reportsError && (
          <div className="mb-3 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
            {reportsError}
          </div>
        )}
        {reportsLoading ? (
          <p className="text-sm text-slate-500">Loading reports...</p>
        ) : reports.length === 0 ? (
          <p className="text-sm text-slate-500">No reports yet.</p>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span>By: {report.reportedByName}</span>
                  <span>Status: {report.status}</span>
                </div>
                <p className="mt-1 text-sm text-slate-700">{report.reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <ReportDialog
        open={reportOpen}
        submitting={reporting}
        onClose={() => setReportOpen(false)}
        onSubmit={handleReportPost}
      />
    </motion.div>
  );
}
