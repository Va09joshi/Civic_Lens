export type Post = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  categoryName: string;
  credibility: "high" | "medium" | "low";
  score?: number;
  city?: string;
  lat?: number;
  lng?: number;
  likeCount?: number;
  commentsCount?: number;
  liked?: boolean;
  createdAt: string;
  userId: string;
  userName: string;
};

export type Category = {
  id: string;
  name: string;
};

export type Comment = {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  bio?: string;
  about?: string;
  role?: string;
  isVerified?: boolean;
  isBanned?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  avatarUrl?: string;
};

export type PostReport = {
  id: string;
  postId: string;
  reportedById: string;
  reportedByName: string;
  reason: string;
  status: string;
  createdAt: string;
};
