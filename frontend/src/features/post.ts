import { useEffect, useState } from 'react';
import useSWR from 'swr';

export type Point = [number, number];

interface RouteData {
  type: string;
  coordinates: Point[];
}

export interface PostImage {
  id: number;
  post_id: number;
  image_url: string;
  position: number;
}
export interface Post {
  id: number;
  owner_id: number;
  description: string;
  route: RouteData;
  location_name: string;
  caption: string;
  likes: number;
  like_id: number | null;
  images: PostImage[];
  participations: { id: string; name: string; image: string | null }[];
}

export function usePost(id: number | undefined) {
  const { data, error, isLoading } = useSWR<Post>(
    id ? `/api/posts/${id}` : null,
  );

  return { post: data as Post | undefined, isLoading, error: error };
}

export function useLike(postId: number | undefined, likedId: number | null | undefined, initialCount = 0) {
  const [likeId, setLikeId] = useState<number | null>(likedId ?? null);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [pending, setPending] = useState(false);

  const isLiked = likeId !== null;

  useEffect(() => {
    setLikeId(likedId ?? null);
    setLikeCount(initialCount);
  }, [likedId, initialCount]);

  async function toggle() {
    if (!postId || pending) return;
    setPending(true);
    try {
      if (!isLiked) {
        const res = await fetch(`/api/likes/${postId}`, {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setLikeId(data.id);
        setLikeCount(c => c + 1);
      } else {
        const res = await fetch(`/api/likes/${likeId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error();
        setLikeId(null);
        setLikeCount(c => c - 1);
      }
    } finally {
      setPending(false);
    }
  }

  return { isLiked, likeCount, pending, toggle };
}
