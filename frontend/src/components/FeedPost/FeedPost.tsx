import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import type { Post } from "@/features/post";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

interface FeedPostProps {
  post: Post;
}

const COVER_IMAGES = [
  "https://images.unsplash.com/photo-1475359524104-d101d02a042b?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop",
];

function FeedPost({ post }: FeedPostProps) {
  const [api, setApi] = useState<CarouselApi>();
  const autoplay = useRef<ReturnType<typeof Autoplay>>(null);
  if (!autoplay.current) {
    autoplay.current = Autoplay({ delay: 2000, stopOnInteraction: false, playOnInit: false });
  }

  return (
    <Card className="pt-0">
      <Link to={`/post/${post.id}`}>
        <Carousel
          opts={{ loop: true }}
          plugins={[autoplay.current]}
          setApi={setApi}
          onMouseEnter={() => {
            autoplay.current?.play();
          }}
          onMouseLeave={() => {
            autoplay.current?.stop();
            api?.scrollTo(0);
          }}
        >
          <CarouselContent>
            {COVER_IMAGES.map((src) => (
              <CarouselItem key={src}>
                <img
                  src={src}
                  alt="Post cover"
                  className="rounded-t-xl relative z-20 aspect-video w-full object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
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
