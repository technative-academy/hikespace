export default function PostNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <h2 className="text-2xl font-semibold mb-2">Post Not Found</h2>
      <p className="text-muted-foreground">
        The post you're looking for doesn't exist or has been removed.
      </p>
    </div>
  );
}
