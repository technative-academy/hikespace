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
}

export function usePost(id: number | undefined) {
  const { data, error, isLoading } = useSWR<Post>(
    id ? `/api/posts/${id}` : null,
  );

  return { post: data as Post | undefined, isLoading, error: error };
}
