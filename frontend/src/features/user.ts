import { useState, useEffect } from 'react';
import useSWR from 'swr';

export type Point = [number, number];

export interface ApiUser {
  id: string;
  name: string;
  image: string | null;
  followersCount: number;
  followingCount: number;
  isFollowed: boolean;
}

export interface SessionUser {
  id: string;
  name: string | null;
  email: string | null;
  imageKey: string | null;
  image_url: string | null;
}

export function useSessionUser() {
  const { data, error, isLoading } = useSWR<SessionUser>("/api/users/me");
  const user = data ? { ...data, image: data.image_url } : undefined;
  return { user, isLoading, error };
}

export function useUser(id: string | undefined) {
  const { data, error, isLoading } = useSWR<ApiUser>(
    id ? `/api/users/${id}` : null,
  );

    console.log(JSON.stringify(data));


  return { user: data as ApiUser | undefined, isLoading, error: error };
}

export interface PublicUser { id: string; name: string; image: string | null; }

export function useUsers() {
  const { data, error, isLoading } = useSWR<PublicUser[]>("/api/users");
  return { users: data ?? [], isLoading, error };
}

export function useFollow(targetUserId: string | undefined, initialFollowing = false) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setIsFollowing(initialFollowing);
  }, [initialFollowing]);

  async function toggle() {
    if (!targetUserId || pending) return;
    setPending(true);
    try {
      if (!isFollowing) {
        const res = await fetch(`/api/follows/${targetUserId}`, {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) throw new Error();
        setIsFollowing(true);
      } else {
        const res = await fetch(`/api/follows/${targetUserId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error();
        setIsFollowing(false);
      }
    } finally {
      setPending(false);
    }
  }

  return { isFollowing, pending, toggle };
}
