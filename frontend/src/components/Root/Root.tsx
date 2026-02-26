import MainContent from "../MainContent/MainContent";
import SiteFooter from "../SiteFooter/SiteFooter";
import SiteHeader from "../SiteHeader/SiteHeader";
import styles from "./Root.module.css";

export default function Root() {
  return (
    <div className={styles.wrapper}>
      <SiteHeader />
      <MainContent />
      <SiteFooter />
    </div>
  );
}
