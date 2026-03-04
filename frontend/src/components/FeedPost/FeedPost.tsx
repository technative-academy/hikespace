import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Post } from "@/features/post";
import { Link } from "react-router-dom";

interface FeedPostProps {
  post: Post;
}

function FeedPost({ post }: FeedPostProps) {
  return (
    <Card className="pt-0">
      <Link to={`/post/${post.id}`}>
      <img
            src="https://avatar.vercel.sh/shadcn1"
            alt="Event cover"
            className="rounded-t-xl relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
          />
        <CardHeader className="pt-6">
          <CardTitle>{post.location_name}</CardTitle>
          <CardDescription>{post.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{post.caption}</p>
        </CardContent>
      </Link>
    </Card>
  );
}

export default FeedPost;
