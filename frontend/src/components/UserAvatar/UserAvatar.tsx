import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps extends React.ComponentProps<typeof Avatar> {
  user: { name?: string | null; image?: string | null };
  fallbackClassName?: string;
}

export function UserAvatar({ user, fallbackClassName, className, ...props }: UserAvatarProps) {
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar className={cn(className)} {...props}>
      {user.image
        ? <AvatarImage src={user.image} />
        : ""}
      <AvatarFallback className={fallbackClassName}>{initials}</AvatarFallback>
    </Avatar>
  );
}
