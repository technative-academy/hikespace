// import useSWR from 'swr';

export type Point = [number, number];

export interface Post {
  post_id: number;
  owner_id: number;
  description: string;
  route: Point[];
  location_name: string;
  caption: string;
}

export function usePost(id: number | undefined) {
  // const { data, error, isLoading } = useSWR<Post>(
  //   id ? `/api/posts/${id}` : null,
  // );

  const isLoading = false;
  const error = null;
  const data =  {
    "post_id": id,
    "owner_id": 1,
    "description": "walking in Brighton!",
    "route": [
      [
        50.828873,
        -0.141176,
      ],
      [
        50.8293,
        -0.1422,
      ],
      [
        50.8302,
        -0.1431,
      ]
    ],
    "location_name": "Brighton",
    "caption": "hi, this is a post about walking in Brighton!"
  };

  return { post: data as Post, isLoading, error: error };
}
