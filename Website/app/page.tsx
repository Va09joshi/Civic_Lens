"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getTrendingPosts } from "../services/posts";
import PostCard from "../components/PostCard";
import SkeletonPostCard from "../components/SkeletonPostCard";
import { motion, Variants } from "framer-motion";
import Button from "../components/Button";
import { Post } from "../types";
import { FaBrain, FaMapMarkedAlt, FaPlayCircle, FaQuoteLeft, FaStar, FaTasks } from "react-icons/fa";

const heroContainerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      staggerChildren: 0.08
    }
  }
};

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const headlineContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.12
    }
  }
};

const headlineWordVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.42, ease: "easeOut" }
  }
};

const heroHeadlineWords = ["Better", "cities", "start", "with", "visible", "truth."];

const impactStats = [
  { label: "Active Citizens", value: "48,300+" },
  { label: "Issues Reported", value: "92,000+" },
  { label: "Verified Posts", value: "74%" },
  { label: "Avg. First Response", value: "3h 12m" }
];

const featureCards = [
  {
    icon: FaBrain,
    tag: "Trust AI",
    title: "AI Credibility Layer",
    text: "Every civic update receives a confidence signal so readers can quickly understand trust level before sharing."
  },
  {
    icon: FaMapMarkedAlt,
    tag: "Geo Insight",
    title: "Hyperlocal Mapping",
    text: "Location-aware reports reveal hotspots in roads, sanitation, water, electricity, and neighborhood safety."
  },
  {
    icon: FaTasks,
    tag: "Response Flow",
    title: "Action Timeline",
    text: "Track reports from first upload to closure with comments, updates, and engagement metrics in one flow."
  }
];

const testimonials = [
  {
    quote:
      "We used CivicLens to map repeated drainage failures in our area. Within days, the issue was escalated with evidence.",
    author: "Aditi Sharma",
    role: "Resident Volunteer"
  },
  {
    quote:
      "The credibility indicators help us quickly verify local reports before publishing neighborhood updates.",
    author: "Raghav Menon",
    role: "Community Journalist"
  },
  {
    quote:
      "The platform makes citizen input structured, visual, and easier to prioritize for civic teams.",
    author: "N. Kapoor",
    role: "City Operations Lead"
  }
];

const movingTestimonials = [...testimonials, ...testimonials];

const avatarPalette = [
  "bg-blue-100 text-blue-700",
  "bg-sky-100 text-sky-700",
  "bg-indigo-100 text-indigo-700"
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

const faqs = [
  {
    q: "How does AI credibility scoring work?",
    a: "CivicLens combines metadata checks, cross-post consistency, report signals, and community feedback to generate an initial confidence state."
  },
  {
    q: "Can I report issues with images from mobile?",
    a: "Yes. You can create posts with location context and photos directly from phone, making field reports quick and actionable."
  },
  {
    q: "Who can view or use submitted reports?",
    a: "Reports are visible to citizens and can be used by local volunteers, media groups, and civic departments for faster response workflows."
  }
];

const civicSenseVideos = [
  {
    title: "Civic Sense In Daily Life",
    channel: "YouTube Search",
    query: "civic sense in daily life india",
    href: "https://www.youtube.com/results?search_query=civic+sense+in+daily+life+india"
  },
  {
    title: "Swachh Bharat: Clean Streets, Better Cities",
    channel: "YouTube Search",
    query: "swachh bharat awareness video",
    href: "https://www.youtube.com/results?search_query=swachh+bharat+awareness+video"
  },
  {
    title: "Road Safety & Public Responsibility",
    channel: "YouTube Search",
    query: "india road safety public awareness video",
    href: "https://www.youtube.com/results?search_query=india+road+safety+public+awareness+video"
  }
];

function CivicVideoCard({
  title,
  channel,
  query,
  href,
  delay
}: {
  title: string;
  channel: string;
  query: string;
  href: string;
  delay: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const embedSrc = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white shadow-sm hover:shadow-md transition-all overflow-hidden"
    >
      <div className="relative h-44 w-full bg-slate-200">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200" />
        )}
        <iframe
          src={embedSrc}
          title={title}
          className={`h-full w-full border-0 transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <span className="absolute left-3 bottom-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-800">
          <FaPlayCircle className="text-pink-600" /> YouTube
        </span>
      </div>
      <div className="p-4">
        <p className="font-semibold text-slate-900 leading-snug">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{channel}</p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs font-semibold text-blue-700 hover:underline"
        >
          Open on YouTube
        </a>
      </div>
    </motion.article>
  );
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getTrendingPosts()
      .then((data) => {
        setPosts(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-7xl flex flex-col gap-12 md:gap-14 pb-12">
      <motion.section
        variants={heroContainerVariants}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 md:p-10 xl:p-12 shadow-float"
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.42] bg-[url('/world-map-backdrop.svg')] bg-cover bg-center" />
        <div className="pointer-events-none absolute inset-0 bg-white/45" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <motion.div variants={heroItemVariants} className="max-w-2xl">
            <p className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
              civic issue + local news intelligence
            </p>
            <motion.h1
              variants={headlineContainerVariants}
              className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight"
            >
              {heroHeadlineWords.map((word, index) => (
                <motion.span key={`${word}-${index}`} variants={headlineWordVariants} className="inline-block mr-2.5">
                  {word}
                </motion.span>
              ))}
            </motion.h1>
            <p className="mt-4 text-base md:text-lg text-slate-600 max-w-xl">
              CivicLens helps citizens, communities, and city teams identify urgent issues, verify public information, and accelerate local action through a single trusted platform.
            </p>

            <motion.div variants={heroItemVariants} className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/create">
                <Button>Report An Issue</Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline">Explore Feed</Button>
              </Link>
              <Link href="/signup">
                <Button variant="ghost">Join Community</Button>
              </Link>
            </motion.div>

            <motion.div variants={heroItemVariants} className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
              {impactStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * index }}
                  whileHover={{ y: -3 }}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 min-h-[86px] flex flex-col justify-center"
                >
                  <p className="text-lg md:text-xl font-bold text-blue-700">{stat.value}</p>
                  <p className="text-xs text-slate-600">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            variants={heroItemVariants}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-slate-200 bg-white p-3 shadow-float w-full"
          >
            <img
              src="/Front.png"
              alt="CivicLens front visual"
              className="w-full rounded-xl object-cover aspect-[16/10]"
            />
          </motion.div>
        </div>
      </motion.section>

      <section className="relative rounded-3xl border border-slate-900 bg-black p-6 md:p-10 shadow-float overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.22] bg-[url('/map-pattern.svg')] bg-cover bg-center" />
        <div className="mb-8 md:mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.2em] font-semibold text-blue-500">Core Values</p>
          <h2 className="mt-2 text-3xl md:text-6xl font-extrabold text-white tracking-tight">Built For Fast Civic Decisions</h2>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {featureCards.map((feature, index) => (
          <motion.article
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ y: -6 }}
            className="rounded-2xl border border-blue-900/70 bg-slate-950 p-6 md:p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.18),0_20px_44px_rgba(2,6,23,0.7)] h-full"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-950 text-blue-400 border border-blue-900">
                <feature.icon size={18} />
              </span>
              <span className="rounded-full border border-blue-900 bg-blue-950/50 px-2.5 py-1 text-[11px] font-semibold text-blue-300">
                {feature.tag}
              </span>
            </div>
            <h3 className="mt-6 text-3xl font-extrabold text-white leading-tight">{feature.title}</h3>
            <p className="mt-4 text-slate-300 leading-relaxed text-lg">{feature.text}</p>
          </motion.article>
        ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Featured Posts</h2>
          <Link href="/explore" className="text-blue-700 font-semibold hover:underline">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonPostCard key={i} />)
            : posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
        </div>
      </section>

      <section className="relative rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-float">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] bg-[url('/map-pattern.svg')] bg-cover bg-center" />
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Stories From The Ground</h2>
            <p className="mt-2 text-slate-600">People using CivicLens to drive real neighborhood outcomes.</p>
          </div>
          <p className="text-sm font-semibold text-blue-700">Verified citizen feedback</p>
        </div>

        <div className="relative z-10 mt-6 overflow-hidden">
          <motion.div
            animate={{ x: [0, -1500] }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            className="flex items-stretch gap-4 w-max"
          >
            {movingTestimonials.map((item, index) => (
              <motion.article
                key={`${item.author}-${index}`}
                whileHover={{ y: -6 }}
                className="w-[340px] md:w-[430px] lg:w-[500px] shrink-0 rounded-2xl bg-white border border-slate-200 p-5 shadow-inner"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center justify-center rounded-full bg-blue-50 text-blue-700 h-8 w-8">
                    <FaQuoteLeft size={14} />
                  </span>
                  <div className="flex items-center gap-1 text-blue-600">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar key={`${item.author}-${index}-${i}`} size={12} />
                    ))}
                  </div>
                </div>

                <p className="mt-4 text-slate-700 leading-relaxed min-h-[124px]">"{item.quote}"</p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-full font-semibold text-sm ${avatarPalette[index % avatarPalette.length]}`}
                    >
                      {getInitials(item.author)}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">{item.author}</p>
                      <p className="text-sm text-slate-500">{item.role}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1">
                    Verified
                  </span>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          className="rounded-2xl border border-slate-200 bg-white p-3 shadow-float"
        >
          <img
            src="/ai-response-dashboard.svg"
            alt="AI generated dashboard of civic response metrics"
            className="w-full rounded-xl"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-white shadow-2xl"
        >
          <h2 className="text-2xl md:text-3xl font-bold">Built For Citizens, Media, and City Teams</h2>
          <p className="mt-3 text-slate-300">
            Whether you are reporting a pothole, tracking flood updates, or monitoring misinformation, CivicLens gives you one place to publish, validate, and coordinate.
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-lg font-semibold">Trusted Signal</p>
              <p className="mt-1 text-sm text-slate-300">AI plus civic moderation improves confidence in local information.</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-lg font-semibold">Faster Escalation</p>
              <p className="mt-1 text-sm text-slate-300">Trending issue detection highlights urgent clusters quickly.</p>
            </div>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/create">
              <Button style={{ background: "#2563eb", color: "#ffffff" }}>Post Your First Report</Button>
            </Link>
            <Link href="/explore">
              <Button variant="ghost" style={{ color: "#ffffff", border: "1px solid rgba(255,255,255,0.35)" }}>
                Browse Civic Feed
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-float">
          <h2 className="text-2xl font-bold text-slate-900">Trusted By Civic Contributors</h2>
          <p className="mt-2 text-slate-600">Community groups, independent media, and local operations teams collaborate on one platform.</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">Metro Citizen Watch</div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">Ward Action Collective</div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">Civic Data Desk</div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">Local Response Unit</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-float">
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <div className="mt-4 space-y-3">
            {faqs.map((item) => (
              <details key={item.q} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <summary className="cursor-pointer font-semibold text-slate-800">{item.q}</summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-float">
        <div className="mb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Civic Sense Video Guide</h2>
            <p className="mt-2 text-slate-600">Watch and share practical videos on civic responsibility and better public behavior.</p>
          </div>
          <a
            href="https://www.youtube.com/results?search_query=civic+sense+india"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-blue-700 hover:underline"
          >
            Explore more videos
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {civicSenseVideos.map((video, index) => (
            <CivicVideoCard
              key={video.href}
              title={video.title}
              channel={video.channel}
              query={video.query}
              href={video.href}
              delay={0.06 * index}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
