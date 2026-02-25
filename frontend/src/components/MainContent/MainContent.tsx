import styles from "./MainContent.module.css";
import { Outlet } from "react-router-dom";

function MainContent() {
	return (
		<div className={styles.wrapper}>
			<Outlet />
		</div>
	);
}

export default MainContent;
