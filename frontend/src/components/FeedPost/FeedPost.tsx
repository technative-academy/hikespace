import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { UserAvatar } from "@/components/UserAvatar/UserAvatar";
import { type Post, useLike } from "@/features/post";
import { useUser } from "@/features/user";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { HeartIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

interface FeedPostProps {
  post: Post;
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1475359524104-d101d02a042b?w=1200&auto=format&fit=crop";

function FeedPost({ post }: FeedPostProps) {
  const [api, setApi] = useState<CarouselApi>();
  const autoplay = useRef<ReturnType<typeof Autoplay>>(null);
  const { user: owner } = useUser(String(post.owner_id));
  const { isLiked, likeCount } = useLike(post.id, post.liked_id, post.likes);
  if (!autoplay.current) {
    autoplay.current = Autoplay({ delay: 2000, stopOnInteraction: false, playOnInit: false });
  }

  return (
    <Card className="pt-0">
      <Link to={`/post/${post.id}`}>
        {(post.images?.length != null) && post.images?.length > 0
          ? (
            <Carousel
              opts={{ loop: true }}
              plugins={[autoplay.current]}
              setApi={setApi}
              onMouseEnter={() => autoplay.current?.play()}
              onMouseLeave={() => {
                autoplay.current?.stop();
                api?.scrollTo(0);
              }}
            >
              <CarouselContent>
                {post.images?.map((img) => (
                  <CarouselItem key={img.id}>
                    <img
                      src={img.image_url}
                      alt="Post image"
                      className="rounded-t-xl aspect-video w-full object-cover"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          )
          : (
            <img
              src={PLACEHOLDER_IMAGE}
              alt="Post cover"
              className="rounded-t-xl aspect-video w-full object-cover grayscale-50"
            />
          )}
        <CardHeader className="pt-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <UserAvatar user={owner ?? {}} className="size-6" />
              <span className="text-sm text-muted-foreground">{owner?.name ?? "…"}</span>
            </div>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <HeartIcon className={cn("size-4", isLiked && "fill-current text-red-500")} />
              {likeCount}
            </span>
          </div>
          <CardTitle>{post.location_name}</CardTitle>
          <CardDescription>{post.description}</CardDescription>
        </CardHeader>
      </Link>
    </Card>
  );
}

export default FeedPost;
