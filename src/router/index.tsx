import { createBrowserRouter } from "react-router";
import Dashboard from "../pages/Dashboard";
import AdminLayout from "../components/layouts/AdminLayout";
import NotFound from "../pages/NotFound";
import { BudgetTracker } from "../pages/BudgetTracker";
import { ScheduleTracker } from "../pages/ScheduleTracker";
import { StudyPlanner } from "../pages/StudyPlanner";
import { StudyAssistant } from "../pages/StudyAssistant";

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
      },
      {
        Component: StudyPlanner,
        path: "study-planner",
      },
      {
        Component: StudyAssistant,
        path: "study-assistant",
      }
    ]
  },
  {
    path: "*",
    Component: NotFound
  }
]);


export default router