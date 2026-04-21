"use client";
import React from "react";
import { motion } from "framer-motion";

interface TestimonialCardProps {
  text: string;
  name: string;
  role: string;
  avatarUrl?: string;
  initials: string;
  rating?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  text,
  name,
  role,
  avatarUrl,
  initials,
  rating = 5,
}) => (
  <motion.div
    whileHover={{ y: -6, boxShadow: "0 20px 50px -10px rgba(37,99,235,0.15)" }}
    transition={{ type: "spring", stiffness: 300, damping: 22 }}
    className="bg-white rounded-3xl shadow-xl flex flex-col w-full h-full mx-auto border border-slate-100"
  >
    {/* Gradient header with avatar */}
    <div className="h-24 relative flex items-end justify-center z-10">
      <div className="absolute inset-0 rounded-t-3xl bg-gradient-to-tr from-[#e0e7ff] via-[#f3e8ff] to-[#f0fdfa] overflow-hidden pointer-events-none">
        {/* Subtle shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_infinite]" />
      </div>
      <div className="absolute left-1/2 -bottom-10 -translate-x-1/2 z-20">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
          />
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
            className="w-20 h-20 rounded-full border-4 border-white shadow-lg bg-blue-200 flex items-center justify-center text-3xl font-bold text-blue-700"
          >
            {initials}
          </motion.div>
        )}
      </div>
    </div>
    <div className="flex-1 flex flex-col pt-14 pb-8 px-8 xl:px-10">
      {/* Quote icon */}
      <span className="text-purple-300 text-2xl font-black italic mb-3">//</span>
      {/* Testimonial text */}
      <p className="text-gray-700 text-lg mb-8 leading-relaxed font-medium">{text}</p>
      {/* Name, role, stars */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-auto gap-3 sm:gap-0">
        <div>
          <div className="font-extrabold text-gray-900 text-lg">{name}</div>
          <div className="text-gray-400 text-sm md:text-base">{role}</div>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: rating }).map((_, i) => (
            <motion.svg
              key={i}
              initial={{ opacity: 0, scale: 0, rotate: -30 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.35, type: "spring" }}
              className="w-5 h-5 md:w-6 md:h-6 text-amber-400 drop-shadow"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <polygon points="10,1 12,7 18,7 13,11 15,17 10,13 5,17 7,11 2,7 8,7" />
            </motion.svg>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

export default TestimonialCard;
