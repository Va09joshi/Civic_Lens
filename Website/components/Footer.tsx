"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaTwitter, FaInstagram, FaLinkedinIn, FaGithub, FaYoutube, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaHeart, FaArrowUp } from "react-icons/fa";

const socialLinks = [
  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter", color: "hover:bg-sky-500" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram", color: "hover:bg-pink-500" },
  { icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn", color: "hover:bg-blue-600" },
  { icon: FaGithub, href: "https://github.com", label: "GitHub", color: "hover:bg-slate-800" },
  { icon: FaYoutube, href: "https://youtube.com", label: "YouTube", color: "hover:bg-red-600" },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="mt-12 border-t border-slate-200 bg-white relative">
      {/* CTA Banner */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 pt-8 md:pt-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 px-5 md:px-8 py-7 md:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5 relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Citizen Powered Platform</p>
            <h3 className="mt-1 text-xl md:text-2xl font-bold text-slate-900">Build stronger neighborhoods with verified local reporting.</h3>
            <p className="mt-2 text-sm text-slate-500">Join thousands of citizens making their communities better every day.</p>
          </div>
          <div className="flex gap-3 relative z-10 flex-shrink-0">
            <Link href="/create" className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
              Create a Civic Post
            </Link>
            <Link href="/explore" className="inline-flex h-11 items-center justify-center rounded-xl bg-white border border-slate-200 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              Explore Feed
            </Link>
          </div>
        </motion.div>

        {/* Main Footer Grid */}
        <div className="py-10 md:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* Brand + Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05, duration: 0.45 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <img src="/logo.png" alt="CivicLens" className="h-10 w-10 object-contain" />
              <h4 className="text-lg font-bold text-slate-900">CivicLens</h4>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 max-w-xs">
              Local civic intelligence for citizens, journalists, and city teams. Empowering transparent public action across India.
            </p>
            
            {/* Social Buttons */}
            <div className="mt-5 flex items-center gap-2">
              {socialLinks.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 ${s.color} hover:text-white transition-all duration-300 border border-slate-200 hover:border-transparent hover:shadow-md`}
                >
                  <s.icon size={15} />
                </motion.a>
              ))}
            </div>

            {/* Contact Info */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <FaEnvelope size={12} className="text-blue-500 flex-shrink-0" />
                <span>support@civiclens.in</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <FaPhoneAlt size={12} className="text-blue-500 flex-shrink-0" />
                <span>1800-CIVIC-LENS</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <FaMapMarkerAlt size={12} className="text-blue-500 flex-shrink-0" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </motion.div>

          {/* Platform Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.45 }}
          >
            <p className="text-sm font-bold text-slate-900 mb-4">Platform</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="text-slate-500 hover:text-blue-600 transition-colors">Home</Link></li>
              <li><Link href="/explore" className="text-slate-500 hover:text-blue-600 transition-colors">Explore Feed</Link></li>
              <li><Link href="/create" className="text-slate-500 hover:text-blue-600 transition-colors">Create Post</Link></li>
              <li><span className="text-slate-500">AI Credibility</span></li>
              <li><span className="text-slate-500">Hotspot Map</span></li>
            </ul>
          </motion.div>

          {/* Account Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.45 }}
          >
            <p className="text-sm font-bold text-slate-900 mb-4">Account</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/login" className="text-slate-500 hover:text-blue-600 transition-colors">Login</Link></li>
              <li><Link href="/signup" className="text-slate-500 hover:text-blue-600 transition-colors">Sign Up</Link></li>
              <li><Link href="/profile" className="text-slate-500 hover:text-blue-600 transition-colors">Profile</Link></li>
              <li><span className="text-slate-500">Settings</span></li>
              <li><span className="text-slate-500">Notifications</span></li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.45 }}
          >
            <p className="text-sm font-bold text-slate-900 mb-4">Resources</p>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li>Helpline Directory</li>
              <li>Civic Sense Videos</li>
              <li>Response Tracking</li>
              <li>Community Guidelines</li>
              <li>Privacy Policy</li>
            </ul>
          </motion.div>
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-t border-slate-100 py-8 flex flex-col md:flex-row items-center justify-between gap-5"
        >
          <div>
            <h4 className="text-sm font-bold text-slate-900">Stay Updated</h4>
            <p className="text-xs text-slate-500 mt-0.5">Get weekly civic insights and platform updates.</p>
          </div>
          <form className="flex items-center gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 md:w-64 h-10 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm flex-shrink-0"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-200 bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} CivicLens. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-slate-600 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-slate-600 cursor-pointer transition-colors">Cookies</span>
            <span className="flex items-center gap-1">
              Made with <FaHeart size={10} className="text-red-400" /> in India
            </span>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ y: -2, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors border border-blue-500"
        aria-label="Scroll to top"
      >
        <FaArrowUp size={14} />
      </motion.button>
    </footer>
  );
}
