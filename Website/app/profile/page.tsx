"use client";
import { useEffect, useState } from "react";
import { clearStoredSession, getStoredToken, getStoredUser, getUserInfo, getUserPosts, logout, updateMyProfile } from "../../services/auth";
import { deletePost } from "../../services/posts";
import PostCard from "../../components/PostCard";
import Loader from "../../components/Loader";
import Button from "../../components/Button";
import { Post, User } from "../../types";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editAbout, setEditAbout] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [snackbar, setSnackbar] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showSnackbar = (type: "success" | "error", message: string) => {
    setSnackbar({ type, message });
  };

  useEffect(() => {
    if (!snackbar) return;
    const timer = setTimeout(() => setSnackbar(null), 2800);
    return () => clearTimeout(timer);
  }, [snackbar]);

  useEffect(() => {
    const token = getStoredToken();
    const cachedUser = getStoredUser();

    if (!token) {
      if (cachedUser) {
        setUser(cachedUser);
        setLoading(false);
      } else {
        router.replace("/login");
      }
      return;
    }

    if (cachedUser) {
      setUser(cachedUser);
    }

    Promise.allSettled([getUserInfo(), getUserPosts()])
      .then(([userResult, postsResult]) => {
        if (userResult.status === "fulfilled") {
          setUser(userResult.value);
          setEditName(userResult.value.name || "");
          setEditEmail(userResult.value.email || "");
          setEditAbout(userResult.value.about || userResult.value.bio || "");
        } else if (cachedUser) {
          setUser(cachedUser);
          setEditName(cachedUser.name || "");
          setEditEmail(cachedUser.email || "");
          setEditAbout(cachedUser.about || cachedUser.bio || "");
          showSnackbar("error", "Profile details could not refresh. Showing stored info.");
        } else {
          setError("Please login to view your profile.");
          clearStoredSession();
          router.replace("/login");
          return;
        }

        if (postsResult.status === "fulfilled") {
          setPosts(postsResult.value);
        } else {
          setPosts([]);
          showSnackbar("error", "Could not load your posts right now.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const showWelcome = searchParams.get("welcome") === "1";
  const showPublished = searchParams.get("published") === "1";

  useEffect(() => {
    if (showWelcome) showSnackbar("success", "Login successful.");
    if (showPublished) showSnackbar("success", "Post published successfully.");
  }, [showPublished, showWelcome]);

  if (loading) return <Loader />;
  if (!user) {
    return (
      <div className="max-w-md mx-auto rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
        {error || "Profile unavailable. Please login again."}
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      clearStoredSession();
    }
    router.push("/login");
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedName = editName.trim();
    const cleanedEmail = editEmail.trim();
    const cleanedAbout = editAbout.trim();

    if (!cleanedName) {
      showSnackbar("error", "Name is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanedEmail)) {
      showSnackbar("error", "Please enter a valid email address.");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateMyProfile({
        name: cleanedName,
        email: cleanedEmail,
        about: cleanedAbout,
        bio: cleanedAbout
      });
      setUser(updated);
      setEditName(updated.name || "");
      setEditEmail(updated.email || "");
      setEditAbout(updated.about || updated.bio || "");
      showSnackbar("success", "Profile updated successfully.");
    } catch (updateErr: any) {
      showSnackbar("error", updateErr?.message || "Failed to update profile.");
    }
    setSaving(false);
  };

  const handleDeletePost = async (postId: string) => {
    const ok = window.confirm("Delete this post?");
    if (!ok) return;

    setDeletingId(postId);
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      showSnackbar("success", "Post deleted successfully.");
    } catch (err: any) {
      showSnackbar("error", err?.message || "Failed to delete post.");
    }
    setDeletingId("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      {snackbar && (
        <div
          className={`fixed right-4 top-20 z-[60] rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg ${
            snackbar.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-blue-200 bg-blue-50 text-blue-700"
          }`}
        >
          {snackbar.message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
          {error}
        </div>
      )}

      <div className="rounded-card shadow-card bg-white p-6 mb-6 flex items-center gap-6">
        <img
          src={user.avatarUrl || "/logo.png"}
          alt={user.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
          <p className="mt-1 text-sm text-slate-600">{user.about || user.bio || "No about added yet."}</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <form onSubmit={handleProfileUpdate} className="rounded-card shadow-card bg-white p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">Update Profile</h2>
        <div className="grid grid-cols-1 gap-4">
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-slate-700">Name</span>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="John Joshi"
              required
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-slate-700">Email</span>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              placeholder="name@domain.com"
              type="email"
              required
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-slate-700">About</span>
            <textarea
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              value={editAbout}
              onChange={(e) => setEditAbout(e.target.value)}
              placeholder="Civic volunteer focused on sanitation and road safety updates."
              rows={3}
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </form>

      <div>
        <h2 className="text-lg font-semibold mb-4">Your Posts</h2>
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">No posts available yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post, index) => (
              <div key={post.id || `profile-post-${index}`} className="space-y-2">
                <PostCard
                  post={post}
                  onDelete={() => handleDeletePost(post.id)}
                  deleting={deletingId === post.id}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
