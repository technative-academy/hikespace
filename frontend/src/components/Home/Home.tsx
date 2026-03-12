import FeedPost from "@/components/FeedPost/FeedPost";
import { Grid } from "@/components/Grid/Grid";
import { VStack } from "@/components/Stack/Stack";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { type Post } from "@/features/post";
import useSWR from "swr";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import { Loading } from "../Loading/Loading";
import { authClient } from "@/lib/auth-client";
import logo from "/src/assets/images/hike-space-logo.png";

function Home() {
  const navigate = useNavigate();
  const { data, error, isLoading } = useSWR<Post[]>("/api/posts");
  const { data: session } = authClient.useSession();
  const guest = !session;

  if (isLoading) return <Loading thing="home page" />;
  if (error) return <div>Error: {error.message}</div>;

  const handleAuthRedirect = (tab: "sign_in" | "sign_up") => {
    navigate("/auth", { state: { defaultTab: tab } });
  };

  return (
    <div className={styles.wrapper}>
      <img src={logo} alt="Hike Space logo" />
      <VStack align="start" style={{ margin: "2rem" }}>
        {!guest && (
          <Button variant="outline" onClick={() => navigate("/createpost")}>
            Create post
          </Button>
        )}

        <Tabs defaultValue="feed" style={{ alignSelf: "stretch" }}>
          <TabsList variant="line">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="following" disabled={guest}>
              Following {guest && "(Log in)"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed">
            {guest ? (
              <div className={styles.guestMessage}>
                <h3>Hello Guest user, Welcome to HikeSpace!</h3>
                <p>
                  This is a social app that lets you share your hiking
                  adventures with the world.
                </p>
                <p>
                  Sign up or log in to see the full feed and follow other
                  hikers.
                </p>
                <div
                  style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
                >
                  <Button onClick={() => handleAuthRedirect("sign_up")}>
                    Sign Up
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleAuthRedirect("sign_in")}
                  >
                    Log In
                  </Button>
                </div>
                <hr style={{ margin: "2rem 0" }} />
                <h4>Preview:</h4>
                <Grid minWidth="12rem">
                  {data!.slice(0, 3).map((post) => (
                    <FeedPost key={post.id} post={post} />
                  ))}
                </Grid>
              </div>
            ) : (
              <Grid minWidth="12rem">
                {data!.map((post) => (
                  <FeedPost key={post.id} post={post} />
                ))}
              </Grid>
            )}
          </TabsContent>

          <TabsContent value="following">
            {guest ? (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <h3>
                  Dear Guest user, Please kindly do log in to see your following
                  feed
                </h3>
                <Button
                  onClick={() => navigate("/auth")}
                  style={{ marginTop: "1rem" }}
                >
                  Go to Login
                </Button>
              </div>
            ) : (
              <Grid minWidth="12rem">
                {data!.map((post) => (
                  <FeedPost key={post.id} post={post} />
                ))}
              </Grid>
            )}
          </TabsContent>
        </Tabs>
      </VStack>
    </div>
  );
}

export default Home;
