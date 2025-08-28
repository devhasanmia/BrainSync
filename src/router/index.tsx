import { createBrowserRouter } from "react-router";
import Dashboard from "../pages/Dashboard";
import AdminLayout from "../components/layouts/AdminLayout";
import NotFound from "../pages/NotFound";
import { BudgetTracker } from "../pages/BudgetTracker";
import { ScheduleTracker } from "../pages/ScheduleTracker";

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
        Component: BudgetTracker,
        path: "budget-tracker",
      },
      {
        Component: ScheduleTracker,
        path: "schedule-tracker",
      }
    ]
  },
  {
    path: "*",
    Component: NotFound
  }
]);


export default router