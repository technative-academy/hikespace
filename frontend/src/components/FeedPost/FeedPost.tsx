import styles from "./FeedPost.module.css";

interface FeedPostProps {
  title: string;
  caption: string;
}

function FeedPost({ title, caption }: FeedPostProps) {
  return (
    <div className={styles.wrapper}>
      <strong>{title}</strong>
      <br />
      {caption}
    </div>
  );
}

export default FeedPost;
