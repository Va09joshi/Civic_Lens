import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { FaThumbsUp, FaShare } from "react-icons/fa";

type Props = Omit<HTMLMotionProps<"button">, "children" | "ref"> & {
  children?: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  icon?: "like" | "share";
};

export default function Button({
  children,
  variant = "primary",
  icon,
  className,
  ...props
}: Props) {
  let classes =
    "px-5 py-2.5 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed";
  if (variant === "primary")
    classes += " bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800";
  else if (variant === "outline")
    classes += " border border-blue-500 text-blue-700 bg-white hover:bg-blue-50 active:bg-blue-100";
  else if (variant === "ghost")
    classes += " text-blue-700 bg-transparent hover:bg-blue-50 active:bg-blue-100";

  return (
    <motion.button
      whileHover={{ scale: 1.045 }}
      whileTap={{ scale: 0.97 }}
      className={`${classes} ${className || ""}`.trim()}
      {...props}
    >
      {icon === "like" && <FaThumbsUp className="inline mr-2" />}
      {icon === "share" && <FaShare className="inline mr-2" />}
      {children}
    </motion.button>
  );
}
