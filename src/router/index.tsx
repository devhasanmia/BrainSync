import { createBrowserRouter } from "react-router";
import Dashboard from "../pages/Dashboard";
import AdminLayout from "../components/layouts/AdminLayout";
import NotFound from "../pages/NotFound";
import { User } from "lucide-react";

const router = createBrowserRouter([
  {
    Component: AdminLayout,
    path: "/",
    children: [
      {
        Component: Dashboard,
        path: "dashboard",
      },
      {
        Component: User,
        path: "users",
      }
    ]
  },
  {
    path: "*",
    Component: NotFound
  }
]);


export default router