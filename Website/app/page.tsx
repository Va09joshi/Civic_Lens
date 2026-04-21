"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getTrendingPosts } from "../services/posts";
import PostCard from "../components/PostCard";
import SkeletonPostCard from "../components/SkeletonPostCard";
import TestimonialsSection from "../components/TestimonialsSection";
import AboutHighlights from "../components/AboutHighlights";
import CivicBot from "../components/CivicBot";
import CivicIssueMap from "../components/CivicIssueMap";
import { motion, Variants } from "framer-motion";
import Button from "../components/Button";
import { Post } from "../types";
import { FaBrain, FaMapMarkedAlt, FaPlayCircle, FaQuoteLeft, FaStar, FaTasks, FaLeaf } from "react-icons/fa";

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
    icon: "✨",
    q: "How does AI credibility scoring work?",
    a: "CivicLens combines metadata checks, cross-post consistency, report signals, and community feedback to generate an initial confidence state."
  },
  {
    icon: "📋",
    q: "Can I report issues with images from mobile?",
    a: "Yes. You can create posts with location context and photos directly from your phone, making field reports quick and actionable."
  },
  {
    icon: "📞",
    q: "What are the important numbers to call?",
    a: "For immediate assistance, dial 112 for Emergency, 100 for Police, 101 for Fire, and 108 for Ambulance. Civic municipal help is 1533."
  },
  {
    icon: "💡",
    q: "How can I find a solution to my neighborhood issue?",
    a: "Browse the 'Explore Feed' to look up verified solutions. You can track progress, engage with local operations, and follow successful public action templates."
  },
  {
    icon: "🔒",
    q: "Who can view or use submitted reports?",
    a: "Reports are visible to citizens and can be used by local volunteers, media groups, and civic departments for faster response workflows."
  }
];

const civicSenseVideos = [
  {
    title: "What is Civic Sense? | Understanding Daily Responsibilities",
    channel: "Civic Awareness",
    videoId: "5dDsAvhDXh0",
    href: "https://www.youtube.com/watch?v=5dDsAvhDXh0"
  },
  {
    title: "Swachh Bharat Abhiyan: Clean Streets, Better Cities",
    channel: "Swachh Bharat Mission",
    videoId: "HZ8L3h4jfe4",
    href: "https://www.youtube.com/watch?v=HZ8L3h4jfe4"
  },
  {
    title: "Road Safety in India - Public Responsibility",
    channel: "Road Safety Foundation",
    videoId: "BVjUabjx-00",
    href: "https://www.youtube.com/watch?v=BVjUabjx-00"
  }
];

function CivicVideoCard({
  title,
  channel,
  videoId,
  href,
  delay
}: {
  title: string;
  channel: string;
  videoId: string;
  href: string;
  delay: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const embedSrc = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -8, boxShadow: "0 20px 40px -8px rgba(37,99,235,0.12)" }}
      className="rounded-2xl border border-blue-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-blue-50 via-slate-50 to-blue-50" />
        )}
        <iframe
          src={embedSrc}
          title={title}
          className={`h-full w-full border-0 transition-all duration-500 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <span className="absolute left-3 bottom-3 inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-slate-800 shadow-md border border-white/50">
          <FaPlayCircle className="text-red-500" /> YouTube
        </span>
      </div>
      <div className="p-5">
        <p className="font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors duration-300 text-[15px]">{title}</p>
        <p className="mt-1.5 text-sm text-slate-400 font-medium">{channel}</p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors group/link"
        >
          Watch on YouTube
          <svg className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
        </a>
      </div>
    </motion.article>
  );
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

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
            animate={{ y: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_20px_50px_-12px_rgba(37,99,235,0.15)] w-full"
          >
            <img
              src="/Front.png"
              alt="CivicLens front visual"
              className="w-full rounded-xl object-cover aspect-[16/10]"
            />
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative rounded-3xl border border-slate-900 bg-black p-6 md:p-10 shadow-float overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.22] bg-[url('/map-pattern.svg')] bg-cover bg-center" />
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 md:mb-10 text-center"
        >
          <p className="text-sm uppercase tracking-[0.2em] font-semibold text-blue-500">Core Values</p>
          <h2 className="mt-2 text-3xl md:text-6xl font-extrabold text-white tracking-tight">Built For Fast Civic Decisions</h2>
        </motion.div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {featureCards.map((feature, index) => (
          <motion.article
            key={feature.title}
            initial={{ opacity: 0, y: 40, scale: 0.92, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
            whileHover={{ y: -6 }}
            className="rounded-2xl border border-blue-900/70 bg-slate-950 p-6 md:p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.18),0_20px_44px_rgba(2,6,23,0.7)] h-full"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-950 text-blue-400 border border-blue-900">
                <feature.icon size={18} />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-500">{feature.tag}</span>
            </div>
            <h3 className="mt-5 text-xl font-bold text-white">{feature.title}</h3>
            <p className="mt-3 text-slate-400 leading-relaxed">{feature.text}</p>
          </motion.article>
        ))}
        </div>
      </motion.section>

      {/* Civic Issue Hotspot Map */}
      <CivicIssueMap />

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-float"
      >
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Trending Local Reports</h2>
            <p className="mt-2 text-slate-600">Explore and verify what's happening in your city.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Link href="/explore" className="text-blue-700 font-semibold hover:underline bg-blue-50 px-4 py-2 rounded-xl">
              View Issue Feed
            </Link>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             Array.from({ length: 3 }).map((_, i) => <SkeletonPostCard key={i} />)
          ) : (
            posts.slice(0, 3).map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: 0.1 * posts.indexOf(post), duration: 0.55, ease: "easeOut" }}
              >
                <PostCard post={post} />
              </motion.div>
            ))
          )}
        </div>
      </motion.section>

          {/* Modern testimonial section */}
          <TestimonialsSection />

          {/* Features and stats section */}
          <AboutHighlights />

      {/* AI dashboard/metrics section removed as requested. */}

      {/* Civic Contributors - Centered or full-width now */}
      <section className="my-14 mx-auto max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="rounded-2xl border border-slate-200 border-b-[6px] border-b-green-500 bg-white p-7 md:p-10 shadow-lg transition-transform hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="absolute -bottom-6 -right-6 text-green-50 text-9xl opacity-30 select-none pointer-events-none">
            <FaLeaf /> 
          </div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl md:text-3xl font-bold text-slate-900 relative z-10 text-center"
          >
            Trusted By Civic Contributors
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-3 text-slate-600 relative z-10 text-center mx-auto max-w-xl"
          >
            Community groups, independent media, and local operations teams collaborate on one platform.
          </motion.p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {["Metro Citizen Watch", "Ward Action Collective", "Civic Data Desk", "Local Response Unit"].map((group, i) => (
              <motion.div 
                key={group}
                initial={{ opacity: 0, y: 20, rotate: -2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i + 0.25, duration: 0.45, ease: "easeOut" }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-semibold text-slate-700 hover:border-green-500 hover:bg-green-50 hover:text-green-800 transition-colors cursor-pointer"
              >
                {group}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="my-16 mx-auto max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
        </motion.div>
        
        <div className="space-y-4">
          {faqs.map((item, idx) => {
            const isOpen = openFaq === item.q;
            return (
            <motion.div 
              key={item.q} 
              initial={{ opacity: 0, x: 50, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.08, duration: 0.5, ease: "easeOut" }}
              className={`group rounded-2xl border ${isOpen ? 'border-green-400 bg-white shadow-md' : 'border-slate-100 bg-slate-50 shadow-sm'} px-5 py-2 hover:bg-white hover:shadow-md transition-all duration-300`}
            >
              <button 
                onClick={() => setOpenFaq(isOpen ? null : item.q)}
                className="w-full py-2 cursor-pointer list-none flex justify-between items-center outline-none text-left"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl">{item.icon}</span>
                  <span className={`font-bold transition-colors ${isOpen ? 'text-green-700' : 'text-slate-900 group-hover:text-green-700'}`}>{item.q}</span>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-slate-200 text-slate-700 rotate-180' : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300 group-hover:text-slate-700'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <motion.div 
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pl-10 pr-12 pt-2 pb-4 text-slate-600 leading-relaxed">
                  {item.a}
                </div>
              </motion.div>
            </motion.div>
          )})}
        </div>
      </section>

      {/* CivicBot Interactive Helpline Directory */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="my-16 mx-auto w-full max-w-5xl px-4 xl:px-0"
      >
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-6 text-center max-w-2xl mx-auto"
        >
          <p className="text-sm font-bold text-[#8b5cf6] uppercase tracking-widest mb-2">Interactive Support</p>
          <h2 className="text-3xl font-extrabold text-slate-900">National Emergency & Civic Directory</h2>
          <p className="mt-3 text-slate-600 leading-relaxed">Search for immediate assistance, helplines, or ask our AI guide for verified contact numbers to escalate local matters.</p>
        </motion.div>
        <CivicBot />
      </motion.section>

      {/* Civic Sense Video Guide */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-blue-100 bg-white p-8 md:p-10 shadow-sm hover:shadow-lg transition-shadow duration-300"
      >
        <div className="mb-7 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">Learn & Share</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Civic Sense Video Guide</h2>
            <p className="mt-2 text-slate-500 max-w-lg">Watch and share practical videos on civic responsibility and better public behavior across India.</p>
          </motion.div>
          <motion.a
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            href="https://www.youtube.com/results?search_query=civic+sense+india"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-5 py-2.5 rounded-full hover:bg-blue-100 border border-blue-100"
          >
            Explore more
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </motion.a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {civicSenseVideos.map((video, index) => (
            <CivicVideoCard
              key={video.href}
              title={video.title}
              channel={video.channel}
              videoId={video.videoId}
              href={video.href}
              delay={0.1 * index}
            />
          ))}
        </div>
      </motion.section>

      {/* Keeping You a Step Ahead — Civic Banner */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl bg-blue-50 border border-blue-100 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 overflow-hidden relative"
      >
        {/* Decorative background elements */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl" />
        
        <div className="flex-1 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight"
          >
            Keeping Citizens a Step Ahead
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15  }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-slate-600 leading-relaxed max-w-xl text-[15px]"
          >
            With transparent civic reporting, AI-powered credibility scoring, and community-driven accountability,
            CivicLens empowers every citizen to make their neighborhood safer, cleaner, and more responsive — 
            one report at a time.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex flex-wrap gap-3"
          >
            <Link href="/create">
              <Button>Report an Issue</Button>
            </Link>
            <Link href="/explore" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-blue-700 font-bold text-sm border border-blue-200 hover:bg-blue-50 transition-colors shadow-sm">
              Explore Reports
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </motion.div>
        </div>
        
        {/* Illustration */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          animate={{ y: [-10, 10, -10] }}
          viewport={{ once: true }}
          transition={{ 
            opacity: { delay: 0.3, duration: 0.5 },
            scale: { delay: 0.3, duration: 0.5, type: "spring" },
            rotate: { delay: 0.3, duration: 0.5 },
            y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
          }}
          className="relative z-10 flex-shrink-0"
        >
          <img 
            src="/ill.jpg" 
            alt="Civic tracking illustration" 
            className="w-56 h-56 md:w-64 md:h-64 object-cover rounded-3xl shadow-2xl" 
          />
        </motion.div>
      </motion.section>
    </div>
  );
}
