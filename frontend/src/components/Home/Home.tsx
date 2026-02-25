import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import FeedPost from "../FeedPost/FeedPost";
import styles from "./Home.module.css";
import "react-tabs/style/react-tabs.css";

function Home() {
  return (
    <div className={styles.wrapper}>
      <button>Create post</button>

      <Tabs>
        <TabList>
          <Tab>Feed</Tab>
          <Tab>Following</Tab>
        </TabList>

        <TabPanel>
          <h2>Content for Tab 1</h2>
          <FeedPost title="A Title" caption="Tab 1 caption" />
          <FeedPost title="A Title" caption="Tab 1 caption" />
          <FeedPost title="A Title" caption="Tab 1 caption" />
          <FeedPost title="A Title" caption="Tab 1 caption" />
        </TabPanel>
        <TabPanel>
          <h2>Content for Tab 2</h2>
          <FeedPost title="Another title" caption="Tab 2 caption" />
          <FeedPost title="Another title" caption="Tab 2 caption" />
          <FeedPost title="Another title" caption="Tab 2 caption" />
          <FeedPost title="Another title" caption="Tab 2 caption" />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default Home;
