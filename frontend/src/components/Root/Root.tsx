import SiteHeader from "../SiteHeader/SiteHeader";
import SiteNav from "../SiteNav/SiteNav";
import MainContent from "../MainContent/MainContent";
import styles from "./Root.module.css";
import SiteFooter from "../SiteFooter/SiteFooter";

export default function Root() {
	return (
		<div className={styles.wrapper}>
			<SiteHeader />
			<SiteNav />
			<MainContent />
			<SiteFooter />
		</div>
	);
}
