import useSWR from 'swr';

export type Point = [number, number];

export interface ApiUser {
  id: string;
  name: string;
  image: string | null;
}

export function useUser(id: string | undefined) {
  const { data, error, isLoading } = useSWR<ApiUser>(
    id ? `/api/users/${id}` : null,
  );

    console.log(JSON.stringify(data));


  return { user: data as ApiUser | undefined, isLoading, error: error };
}
