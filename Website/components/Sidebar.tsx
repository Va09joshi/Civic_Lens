"use client";
import { useEffect, useState } from "react";
import { getCategories } from "../services/posts";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Sidebar() {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <aside className="hidden md:block w-64 bg-white shadow-xl rounded-2xl m-6 p-6 h-fit sticky top-28 border border-gray-100">
      <h2 className="text-xl font-bold mb-5 text-secondary">Categories</h2>
      <ul className="space-y-2">
        {categories.map((cat) => (
          <motion.li
            key={cat.id}
            whileHover={{ x: 10 }}
            className="transition-colors"
          >
            <Link
              href={`/explore?category=${cat.id}`}
              className="block px-3 py-2 rounded-lg hover:bg-blue-50 text-secondary hover:text-primary font-medium transition-colors"
            >
              {cat.name}
            </Link>
          </motion.li>
        ))}
      </ul>
    </aside>
  );
}
