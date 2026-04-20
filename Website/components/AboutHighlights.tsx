"use client";
import { FaCheckCircle, FaMapMarkerAlt, FaEye, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";

const features = [
  {
    icon: <FaCheckCircle className="text-blue-600" size={32} />,
    title: "Accuracy",
    desc: "AI-powered credibility scoring for verified civic data",
    bg: "bg-blue-100"
  },
  {
    icon: <FaMapMarkerAlt className="text-sky-600" size={32} />,
    title: "Local Focus",
    desc: "Hyperlocal reporting for neighborhood-level change",
    bg: "bg-sky-100"
  },
  {
    icon: <FaEye className="text-indigo-600" size={32} />,
    title: "Transparency",
    desc: "Open and transparent progress tracking for everyone",
    bg: "bg-indigo-100"
  },
  {
    icon: <FaUsers className="text-cyan-600" size={32} />,
    title: "Community",
    desc: "A growing network of citizens taking local action",
    bg: "bg-cyan-100"
  }
];

const stats = [
  { value: "92K+", label: "Issues Reported" },
  { value: "48K+", label: "Active Citizens" },
  { value: "74%", label: "Verified Posts" },
  { value: "3h 12m", label: "Avg. Response" }
];

export default function AboutHighlights() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className="w-full my-12"
    >
      {/* Features Row */}
      <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch mb-10">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 35, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.12, duration: 0.55, ease: "easeOut" }}
            whileHover={{ y: -8, boxShadow: "0 16px 40px -8px rgba(37,99,235,0.12)" }}
            className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center py-8 px-6 min-w-[220px] transition-all duration-300"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 + 0.15, duration: 0.45, type: "spring", stiffness: 200 }}
              className={`rounded-xl p-3 mb-4 ${f.bg} flex items-center justify-center`}
            >
              {f.icon}
            </motion.div>
            <div className="font-extrabold text-lg text-slate-900 mb-1">{f.title}</div>
            <div className="text-slate-500 text-sm md:text-base text-center leading-relaxed">{f.desc}</div>
          </motion.div>
        ))}
      </div>
      {/* Stats Banner */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col md:flex-row justify-center items-center bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-3xl py-10 px-4 gap-10 md:gap-0 shadow-lg overflow-hidden relative"
      >
        {/* Decorative glow */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 + 0.2, duration: 0.5, ease: "easeOut" }}
            className="flex-1 flex flex-col items-center relative z-10"
          >
            <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{s.value}</div>
            <div className="text-blue-100 text-sm md:text-base font-medium font-sans uppercase tracking-wider">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
