"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-8 pt-8 md:pt-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="rounded-3xl border border-blue-100 bg-blue-50/70 px-5 md:px-7 py-6 md:py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Citizen Powered Platform</p>
            <h3 className="mt-1 text-xl md:text-2xl font-bold text-slate-900">Build stronger neighborhoods with verified local reporting.</h3>
          </div>
          <Link href="/create" className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
            Create a Civic Post
          </Link>
        </motion.div>

        <div className="py-8 md:py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05, duration: 0.45 }}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <img src="/logo.png" alt="CivicLens" className="h-10 w-10 object-contain" />
              <h4 className="text-lg font-bold text-slate-900">CivicLens</h4>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Local civic intelligence for citizens, journalists, and city teams.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.45 }}
          >
            <p className="text-sm font-semibold text-slate-900">Platform</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/" className="text-slate-600 hover:text-blue-700 transition-colors">Home</Link></li>
              <li><Link href="/explore" className="text-slate-600 hover:text-blue-700 transition-colors">Explore Feed</Link></li>
              <li><Link href="/create" className="text-slate-600 hover:text-blue-700 transition-colors">Create Post</Link></li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.45 }}
          >
            <p className="text-sm font-semibold text-slate-900">Account</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/login" className="text-slate-600 hover:text-blue-700 transition-colors">Login</Link></li>
              <li><Link href="/signup" className="text-slate-600 hover:text-blue-700 transition-colors">Sign Up</Link></li>
              <li><Link href="/profile" className="text-slate-600 hover:text-blue-700 transition-colors">Profile</Link></li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.45 }}
          >
            <p className="text-sm font-semibold text-slate-900">Support</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>Response tracking and visibility</li>
              <li>AI-assisted credibility indicators</li>
              <li>Clear escalation workflows</li>
            </ul>
          </motion.div>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-4 text-xs text-slate-500 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CivicLens. All rights reserved.</p>
          <p>Built for transparent civic action.</p>
        </div>
      </div>
    </footer>
  );
}
