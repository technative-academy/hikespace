import Home from "./components/Home/Home";
import PostContent from "./components/PostContent/PostContent";
import UserContent from "./components/UserContent/UserContent";
import Root from "./components/Root/Root";
import Auth from "./components/Auth/Auth.tsx";
import CreatePost from "./components/CreatePost/CreatePost.tsx";
import { PageNotFound } from "./components/PageNotFound/PageNotFound.tsx";

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
        path: "post/:id",
        element: <PostContent />,
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "user/:id",
        element: <UserContent />,
      },
      {
        path: "createpost",
        element: <CreatePost />,
      },
      {
        path: "*",
        element: <PageNotFound />,
      }
    ],
  },
];

export { routes };
