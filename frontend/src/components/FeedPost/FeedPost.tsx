import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FeedPostProps {
  title: string;
  caption: string;
}

function FeedPost({ title, caption }: FeedPostProps) {
  return (
    <Card>
      <CardHeader>
        <img
          src="https://avatar.vercel.sh/shadcn1"
          alt="Event cover"
          className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
        />
        <CardTitle>{title}</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{caption}</p>
      </CardContent>
    </Card>
  );
}

export default FeedPost;
