import Home from "./components/Home/Home";
import PostContent from "./components/PostContent/PostContent";
import Root from "./components/Root/Root";

const routes = [
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "postContent",
        element: <PostContent />,
      },
    ],
  },
];

export { routes };
