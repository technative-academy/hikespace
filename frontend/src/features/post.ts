import { useState } from 'react';
import useSWR from 'swr';

export type Point = [number, number];

interface RouteData {
  type: string;
  coordinates: Point[];
}

export interface Post {
  id: number;
  owner_id: number;
  description: string;
  route: RouteData;
  location_name: string;
  caption: string;
  like_count?: number;
}

export function usePost(id: number | undefined) {
  const { data, error, isLoading } = useSWR<Post>(
    id ? `/api/posts/${id}` : null,
  );

  return { post: data as Post | undefined, isLoading, error: error };
}

export function useLike(postId: number | undefined) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeId, setLikeId] = useState<number | null>(null);
  const [pending, setPending] = useState(false);

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
        setIsLiked(true);
      } else {
        const res = await fetch(`/api/likes/${likeId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error();
        setLikeId(null);
        setIsLiked(false);
      }
    } finally {
      setPending(false);
    }
  }

  return { isLiked, pending, toggle };
}
