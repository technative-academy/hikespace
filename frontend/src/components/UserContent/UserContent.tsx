import useSWR from 'swr';
import FeedPost from '../FeedPost/FeedPost'
import { Grid } from '../Grid/Grid'
import type { Post } from '@/features/post';
import { Loading } from '../Loading/Loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export default function UserContent() {

  const { data, error, isLoading } = useSWR<Post[]>("/api/posts");

  if (error) return <div>Error: {error.message}</div>;



  return <div>
    <div className='relative aspect-32/9 mb-10'>
      <img
        src="https://avatar.vercel.sh/bar"
        alt="Event cover"
        className="rounded-t-xl  z-20 aspect-32/9 w-full object-cover brightness-60 grayscale dark:brightness-40"
      />

      <div className='rounded-full absolute z-20 aspect-square w-24 left-8 -bottom-12  border-[var(--card)] border-4'>
        <img
          src="https://avatar.vercel.sh/foo"
          alt="Event cover"
          className="rounded-full z-20 aspect-square  object-cover brightness-60 dark:brightness-40"
        />
      </div>
    </div>
    <div className='p-4'>
      <p className='text-2xl font-bold mb-4'>User name</p>

        <Tabs defaultValue="feed" style={{ alignSelf: "stretch" }}>
          <TabsList variant="line">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="other">Other stuff</TabsTrigger>
          </TabsList>
          <TabsContent value="feed">
                  { (!isLoading) ? <Grid minWidth="12rem">
        {data!.map((post) => <FeedPost key={post.id} post={post} />)}
      </Grid> : <Loading thing="posts" /> }

          </TabsContent>
          <TabsContent value="other">
            To do...
          </TabsContent>
        </Tabs>

      
    </div>
  </div>
}
