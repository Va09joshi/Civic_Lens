"use client";
import { useMemo, useState } from "react";
import { createPost, getCategories } from "../../services/posts";
import { getStoredToken } from "../../services/auth";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { Category } from "../../types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaCloudUploadAlt, FaImage, FaInfoCircle, FaMapMarkerAlt, FaRegLightbulb } from "react-icons/fa";
import dynamic from "next/dynamic";

const LocationMapPicker = dynamic(() => import("../../components/LocationMapPicker"), {
  ssr: false
});

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"ISSUE" | "NEWS">("ISSUE");
  const [city, setCity] = useState("Mumbai");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const selectedCategoryName = useMemo(
    () => categories.find((cat) => cat.id === category)?.name || "",
    [categories, category]
  );

  const mapLat = lat.trim() ? Number(lat) : 19.076;
  const mapLng = lng.trim() ? Number(lng) : 72.8777;

  const imagePreviewUrl = useMemo(() => {
    if (!image) return "";
    return URL.createObjectURL(image);
  }, [image]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  useEffect(() => {
    if (!snackbar) return;
    const timer = setTimeout(() => setSnackbar(null), 2800);
    return () => clearTimeout(timer);
  }, [snackbar]);

  const showSnackbar = (type: "success" | "error", message: string) => {
    setSnackbar({ type, message });
  };

  const validateImageFile = (file: File): string | null => {
    const maxSizeBytes = 10 * 1024 * 1024;
    if (!file.type.startsWith("image/")) {
      return "Please upload a valid image file.";
    }
    if (file.size > maxSizeBytes) {
      return "Image size must be 10MB or less.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanedTitle = title.trim();
    const cleanedDescription = description.trim();
    const cleanedCity = city.trim();

    if (!cleanedTitle || !cleanedDescription || !category || !cleanedCity) {
      const message = "Title, description, category, and city are required.";
      setError(message);
      showSnackbar("error", message);
      return;
    }

    if (cleanedTitle.length < 6) {
      const message = "Title must be at least 6 characters.";
      setError(message);
      showSnackbar("error", message);
      return;
    }

    if (cleanedDescription.length < 20) {
      const message = "Description must be at least 20 characters.";
      setError(message);
      showSnackbar("error", message);
      return;
    }

    const parsedLat = lat.trim() ? Number(lat) : 0;
    const parsedLng = lng.trim() ? Number(lng) : 0;

    if ((lat.trim() && !lng.trim()) || (!lat.trim() && lng.trim())) {
      const message = "Please provide both latitude and longitude together.";
      setError(message);
      showSnackbar("error", message);
      return;
    }

    if ((lat.trim() && Number.isNaN(parsedLat)) || (lng.trim() && Number.isNaN(parsedLng))) {
      const message = "Latitude and longitude must be valid numbers.";
      setError(message);
      showSnackbar("error", message);
      return;
    }

    if (lat.trim() && (parsedLat < -90 || parsedLat > 90)) {
      const message = "Latitude must be between -90 and 90.";
      setError(message);
      showSnackbar("error", message);
      return;
    }

    if (lng.trim() && (parsedLng < -180 || parsedLng > 180)) {
      const message = "Longitude must be between -180 and 180.";
      setError(message);
      showSnackbar("error", message);
      return;
    }

    if (image) {
      const imageValidationError = validateImageFile(image);
      if (imageValidationError) {
        setError(imageValidationError);
        showSnackbar("error", imageValidationError);
        return;
      }
    }

    const token = getStoredToken();
    if (!token) {
      const message = "Session expired. Please login again to publish your post.";
      setError(message);
      showSnackbar("error", message);
      router.push("/login?reauth=1&next=/create");
      return;
    }

    setLoading(true);
    try {
      await createPost({
        title: cleanedTitle,
        description: cleanedDescription,
        category,
        type,
        image: image || undefined,
        location: {
          city: cleanedCity,
          lat: lat.trim() ? parsedLat : undefined,
          lng: lng.trim() ? parsedLng : undefined
        }
      });
      showSnackbar("success", "Post created successfully.");
      router.push("/profile?published=1");
    } catch (err: any) {
      const rawMessage = (typeof err === "string" ? err : err?.message) || "Failed to create post.";
      const lowered = rawMessage.toLowerCase();
      const requiresRelogin =
        lowered.includes("no authentication token provided") ||
        lowered.includes("authentication token") ||
        lowered.includes("unauthorized") ||
        lowered.includes("jwt") ||
        lowered.includes("token expired");

      const message = requiresRelogin
        ? "Session expired. Please login again and then publish your post."
        : rawMessage;

      setError(message);
      showSnackbar("error", message);

      if (requiresRelogin) {
        router.push("/login?reauth=1&next=/create");
      }
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-6xl"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.form
          onSubmit={handleSubmit}
          className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-float"
        >
          <div className="mb-7 border-b border-slate-200 pb-5">
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <FaRegLightbulb /> Citizen Submission
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">Create a New Civic Post</h1>
            <p className="mt-2 text-slate-600 max-w-2xl">
              Share a clear, evidence-backed update so your community and local authorities can act faster.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-blue-700 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:p-5">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-sm font-semibold text-slate-700">Title</span>
                <span className="text-xs text-slate-500">{title.length}/120</span>
              </div>
              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                placeholder="Ex: Large pothole near Main Street signal"
                value={title}
                maxLength={120}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:p-5">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-sm font-semibold text-slate-700">Description</span>
                <span className="text-xs text-slate-500">{description.length}/700</span>
              </div>
              <textarea
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                placeholder="Describe what happened, exact location details, and why this needs attention."
                value={description}
                maxLength={700}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:p-5">
              <span className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FaMapMarkerAlt className="text-blue-600" /> Category
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  value={type}
                  onChange={(e) => setType(e.target.value as "ISSUE" | "NEWS")}
                >
                  <option value="ISSUE">ISSUE</option>
                  <option value="NEWS">NEWS</option>
                </select>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:p-5">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Location</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  placeholder="City (required)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <input
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  placeholder="Latitude (optional)"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                />
                <input
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  placeholder="Longitude (optional)"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <LocationMapPicker
                  lat={Number.isFinite(mapLat) ? mapLat : 19.076}
                  lng={Number.isFinite(mapLng) ? mapLng : 72.8777}
                  onPick={(nextLat, nextLng) => {
                    setLat(nextLat.toFixed(6));
                    setLng(nextLng.toFixed(6));
                  }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:p-5">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Upload Image</span>
              <div className="rounded-2xl border border-dashed border-blue-300 bg-blue-50/40 p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                      <FaCloudUploadAlt size={20} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Add visual proof</p>
                      <p className="text-xs text-slate-500">JPG, PNG, WEBP up to 10MB</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full md:w-auto text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-white file:font-medium hover:file:bg-blue-700"
                    onChange={(e) => {
                      const nextFile = e.target.files?.[0] || null;
                      if (!nextFile) {
                        setImage(null);
                        return;
                      }

                      const imageValidationError = validateImageFile(nextFile);
                      if (imageValidationError) {
                        setImage(null);
                        setError(imageValidationError);
                        showSnackbar("error", imageValidationError);
                        e.currentTarget.value = "";
                        return;
                      }

                      setImage(nextFile);
                    }}
                  />
                </div>

                {image && (
                  <div className="mt-4 rounded-xl border border-blue-100 bg-white p-3">
                    <p className="text-xs font-medium text-slate-600 mb-2">Selected: {image.name}</p>
                    {imagePreviewUrl && (
                      <img
                        src={imagePreviewUrl}
                        alt="Selected preview"
                        className="h-44 w-full rounded-lg object-cover"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-200 pt-5">
            <p className="text-xs text-slate-500">By submitting, you confirm the information is accurate to the best of your knowledge.</p>
            <Button type="submit" disabled={loading} className="rounded-2xl px-6 py-3">
              {loading ? <Loader small /> : "Publish Post"}
            </Button>
          </div>
        </motion.form>

        <aside className="space-y-4 lg:sticky lg:top-24 h-fit">
          <motion.div
            whileHover={{ y: -3 }}
            className="rounded-3xl border border-slate-200 bg-slate-900 p-5 text-white shadow-float"
          >
            <h2 className="text-lg font-bold">Post Quality Checklist</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              <li>- Mention exact landmark or street name</li>
              <li>- Keep title specific and short</li>
              <li>- Add one clear supporting photo</li>
              <li>- Use category that best matches issue</li>
            </ul>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-float"
          >
            <div className="flex items-center gap-2 text-primary">
              <FaImage />
              <h3 className="font-bold">Preview Summary</h3>
            </div>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <p><span className="font-semibold">Title:</span> {title || "Not added yet"}</p>
              <p><span className="font-semibold">Category:</span> {selectedCategoryName || "Not selected"}</p>
              <p><span className="font-semibold">Description:</span> {description ? `${description.slice(0, 90)}${description.length > 90 ? "..." : ""}` : "Not added yet"}</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="rounded-3xl border border-blue-100 bg-blue-50 p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 text-blue-700">
              <FaInfoCircle />
              <h3 className="font-bold">Why this matters</h3>
            </div>
            <p className="mt-2 text-sm text-blue-800">
              Well-documented civic posts improve visibility and raise the chance of timely response from communities and city teams.
            </p>
          </motion.div>
        </aside>
      </div>
    </motion.div>
  );
}
