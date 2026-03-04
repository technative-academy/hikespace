import { Button } from "../ui/button";
import { Empty, EmptyContent, EmptyTitle } from "../ui/empty";

export function PageNotFound() {
  return (
    <Empty>
      <EmptyTitle>404: Page Not Found</EmptyTitle>
      <EmptyContent>
        <p>The page you were looking for does not exist or may have been deleted.</p>
        <Button asChild>
          <a href="/">Go Home</a>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
