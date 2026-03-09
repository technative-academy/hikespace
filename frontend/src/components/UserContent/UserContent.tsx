import type { Post } from "@/features/post";
import { useUser } from "@/features/user";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import FeedPost from "../FeedPost/FeedPost";
import { Grid } from "../Grid/Grid";
import { Loading } from "../Loading/Loading";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Empty, EmptyContent, EmptyTitle } from "../ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function UserContent() {
  const { id } = useParams<{ id: string }>();

  const { user, error: userError, isLoading: userIsLoading } = useUser(id);
  const { data: posts, error, isLoading } = useSWR<Post[]>("/api/posts");

  if (userIsLoading) return <Loading thing="user" />;
  if (!user) {
    return (
      <Empty>
        <EmptyTitle>User not found</EmptyTitle>
        <EmptyContent>
          Could not find a user with the specified ID.
          <Button asChild>
            <a href="/">Go Home</a>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  if (userError) throw userError;
  if (error) throw error;

  const initials = user.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div>
      <div className="relative aspect-32/9 mb-10">
        <img
          src="https://avatar.vercel.sh/bar"
          alt="Event cover"
          className="rounded-t-xl  z-20 aspect-32/9 w-full object-cover brightness-60 grayscale dark:brightness-40"
        />

        <div className="rounded-full absolute z-20 aspect-square w-24 left-8 -bottom-12  border-[var(--card)] border-4">
          <Avatar className="h-full w-full">
            <AvatarFallback className="text-[3rem]">{initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="p-4">
        <p className="text-2xl font-bold mb-4">{user.name}</p>

        <Tabs defaultValue="feed" style={{ alignSelf: "stretch" }}>
          <TabsList variant="line">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="other">Other stuff</TabsTrigger>
          </TabsList>
          <TabsContent value="feed">
            {(!isLoading)
              ? (
                <Grid minWidth="12rem">
                  {posts!.map((post) => <FeedPost key={post.id} post={post} />)}
                </Grid>
              )
              : <Loading thing="posts" />}
          </TabsContent>
          <TabsContent value="other">
            To do...
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
