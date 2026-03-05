import React, { Component } from "react";
import { Card } from "../ui/card";
import styles from "./MainContent.module.css";
import { Outlet } from "react-router-dom";
import { Empty, EmptyContent, EmptyTitle } from "../ui/empty";


class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, _info: React.ErrorInfo) {
    console.log("Captured error: " + error);
  }

  render() {
    if (this.state.hasError) {
      return (<Empty>
		
		<EmptyTitle>Something went wrong.</EmptyTitle>
		<EmptyContent>Try reloading the page or visiting the page later.</EmptyContent>
		</Empty>);
    }

    return this.props.children;
  }
}

function MainContent() {
	return (
		<div className={styles.wrapper}>
			<Card className="py-0 w-full max-w-[40rem] m-8">
				<ErrorBoundary>
					<Outlet />
				</ErrorBoundary>

			</Card>
		</div>
	);
}

export default MainContent;
