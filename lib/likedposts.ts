// Liked posts storage utility
const LIKED_POSTS_KEY = 'blog_liked_posts';

export interface LikedPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  authorAvatar?: string;
  coverImage: string;
  category: string;
  readTime: string;
  likedAt: string;
  publishedAt: string;
}

export const getLikedPosts = (): LikedPost[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(LIKED_POSTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addLikedPost = (post: Omit<LikedPost, 'likedAt'>): void => {
  const likedPosts = getLikedPosts();
  const exists = likedPosts.some(p => p.id === post.id);
  
  if (!exists) {
    const newLikedPost: LikedPost = {
      ...post,
      likedAt: new Date().toISOString(),
    };
    localStorage.setItem(LIKED_POSTS_KEY, JSON.stringify([newLikedPost, ...likedPosts]));
  }
};

export const removeLikedPost = (postId: string): void => {
  const likedPosts = getLikedPosts();
  const filtered = likedPosts.filter(p => p.id !== postId);
  localStorage.setItem(LIKED_POSTS_KEY, JSON.stringify(filtered));
};

export const isPostLiked = (postId: string): boolean => {
  const likedPosts = getLikedPosts();
  return likedPosts.some(p => p.id === postId);
};

export const toggleLikePost = (post: Omit<LikedPost, 'likedAt'>): boolean => {
  if (isPostLiked(post.id)) {
    removeLikedPost(post.id);
    return false;
  } else {
    addLikedPost(post);
    return true;
  }
};
