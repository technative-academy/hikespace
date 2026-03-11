import type { Post } from "@/features/post";
import { useUser } from "@/features/user";
import { UserMinusIcon, UserPlusIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import FeedPost from "../FeedPost/FeedPost";
import { Grid } from "../Grid/Grid";
import { Loading } from "../Loading/Loading";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Empty, EmptyContent, EmptyTitle } from "../ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import EditProfileModal from "./EditProfileModal";

const COVER_IMAGES = [
  "https://images.unsplash.com/photo-1475359524104-d101d02a042b?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop",
];

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

  const coverImage = COVER_IMAGES[
    // Hash the user ID as a number, then picks a random cover image based on that
    (id ?? "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % COVER_IMAGES.length
  ];

  const initials = user.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div>
      <div className="relative aspect-32/9">
        <img
          className="rounded-t-xl  z-20 aspect-32/9 w-full object-cover"
          width="5736"
          height="3350"
          alt="aerial photography of forest"
          src={coverImage}
        />
        <div className="rounded-full absolute z-20 aspect-square w-24 left-8 -bottom-12  border-[var(--card)] border-4">
          <Avatar className="h-full w-full">
            <AvatarFallback className="text-[3rem]">{initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-end">
          <EditProfileModal user={user} />
          <div className="flex items-center gap-2 ml-2">
            <span className="text-sm text-muted-foreground">124</span>
            <Button variant="outline" size="icon" className="rounded-full">
              <UserPlusIcon className="size-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <span className="text-sm text-muted-foreground">125</span>
            <Button variant="outline" size="icon" className="rounded-full">
              <UserMinusIcon className="size-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <p className="text-2xl font-bold">{user.name}</p>
        </div>

        <Tabs defaultValue="feed" style={{ alignSelf: "stretch" }}>
          <TabsList variant="line">
            <TabsTrigger value="feed">Latest posts</TabsTrigger>
            <TabsTrigger value="likes">Liked posts</TabsTrigger>
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
          <TabsContent value="likes">
            {(!isLoading)
              ? (
                <Grid minWidth="12rem">
                  {posts!.map((post) => <FeedPost key={post.id} post={post} />)}
                </Grid>
              )
              : <Loading thing="posts" />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
