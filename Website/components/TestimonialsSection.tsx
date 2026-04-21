"use client";
import { motion } from "framer-motion";
import TestimonialCard from "./TestimonialCard";

const testimonials = [
  {
    text: "The credibility indicators help us quickly verify local reports before publishing neighborhood updates.",
    name: "Raghav Menon",
    role: "Community Journalist",
    initials: "RM",
  },
  {
    text: "The platform makes citizen input structured, visual, and easier to prioritize for civic teams.",
    name: "N. Kapoor",
    role: "City Operations Lead",
    initials: "NK",
  },
  {
    text: "We used the platform to gather feedback from our area. With its easy interface, we saw a 40% increase in participation.",
    name: "A. Sharma",
    role: "Resident Representative",
    initials: "AS",
  },
  {
    text: "A fantastic way to collaborate openly on municipal tasks. Finally, transparency is built into the workflow!",
    name: "M. Singh",
    role: "Action Committee",
    initials: "MS",
  },
];

export default function TestimonialsSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className="py-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">What People Say</p>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Trusted By Communities</h2>
      </motion.div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: i * 0.12, duration: 0.55, ease: "easeOut" }}
            className="h-full"
          >
            <TestimonialCard
              text={t.text}
              name={t.name}
              role={t.role}
              initials={t.initials}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
