import Home from "./components/Home/Home";
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
    ],
  },
];

export { routes };
