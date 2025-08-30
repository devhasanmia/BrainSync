import { createBrowserRouter } from "react-router";
import App from "../App";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminLayout from "../components/layouts/AdminLayout";
import { ProtecctedRoute } from "../components/layouts/ProtecctedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Login />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/dashboard",
    Component: ProtecctedRoute(AdminLayout),
  },
]);

export default router;
