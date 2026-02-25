import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import FeedPost from "../FeedPost/FeedPost";
import { Grid } from "../Grid/Grid";
import { VStack } from "../Stack/Stack";
import { Button } from "../ui/button";
import styles from "./Home.module.css";

function Home() {
  return (
    <div className={styles.wrapper}>
      <VStack align="start" style={{ margin: "2rem" }}>
        <Button variant="outline">Create post</Button>

        <Tabs defaultValue="feed" style={{ alignSelf: "stretch" }}>
          <TabsList variant="line">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="feed">
            <Grid minWidth="12rem">
              <FeedPost title="A Title" caption="Tab 1 caption" />
              <FeedPost title="A Title" caption="Tab 1 caption" />
              <FeedPost title="A Title" caption="Tab 1 caption" />
              <FeedPost title="A Title" caption="Tab 1 caption" />
            </Grid>
          </TabsContent>
          <TabsContent value="following">
            <Grid minWidth="12rem">
              <FeedPost title="Another title" caption="Tab 2 caption" />
              <FeedPost title="Another title" caption="Tab 2 caption" />
              <FeedPost title="Another title" caption="Tab 2 caption" />
              <FeedPost title="Another title" caption="Tab 2 caption" />
            </Grid>
          </TabsContent>
        </Tabs>
      </VStack>
    </div>
  );
}

export default Home;
