import { Card } from "../ui/card";
import styles from "./MainContent.module.css";
import { Outlet } from "react-router-dom";

function MainContent() {
	return (
		<div className={styles.wrapper}>
			<Card className="pt-0 w-full max-w-[40rem] m-8">
				<Outlet />
			</Card>
		</div>
	);
}

export default MainContent;
