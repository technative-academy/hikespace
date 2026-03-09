import FeedPost from "@/components/FeedPost/FeedPost";
import { Grid } from "@/components/Grid/Grid";
import { VStack } from "@/components/Stack/Stack";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { type Post } from "@/features/post";
import useSWR from "swr";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import { Loading } from "../Loading/Loading";

function Home() {
  const navigate = useNavigate();
  const { data, error, isLoading } = useSWR<Post[]>("/api/posts");

  if (isLoading) return <Loading thing="home page" />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={styles.wrapper}>
      <VStack align="start" style={{ margin: "2rem" }}>
        <Button variant="outline" onClick={() => navigate("/createpost")}>Create post</Button>

        <Tabs defaultValue="feed" style={{ alignSelf: "stretch" }}>
          <TabsList variant="line">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="feed">
            <Grid minWidth="12rem">
              {data!.map((post) => <FeedPost key={post.id} post={post} />)}
            </Grid>
          </TabsContent>
          <TabsContent value="following">
            <Grid minWidth="12rem">
              {data!.map((post) => <FeedPost key={post.id} post={post} />)}
            </Grid>
          </TabsContent>
        </Tabs>
      </VStack>
    </div>
  );
}

export default Home;
