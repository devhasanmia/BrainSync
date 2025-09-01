import { createBrowserRouter } from "react-router";
import App from "../App";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { ProtecctedRoute } from "../components/layouts/ProtecctedRoute";
import { ScheduleTracker } from "../pages/ScheduleTracker";
import { StudyPlanner } from "../pages/StudyPlanner";
import { StudyAssistant } from "../pages/StudyAssistant";
import { BudgetTracker } from "../pages/BudgetTracker";
import { QuizGenerator } from "../pages/QuizGenerator";
import Dashboard from "../pages/Dashboard";
import AuthLayout from "../components/layouts/AuthLayout";
import AddSchedule from "@/pages/classSchedule/AddSchedule";
import EditSchedule from "@/pages/classSchedule/EditSchedule";
import AddBudget from "@/pages/budgetTracker/AddBudget";
import AddStudyTask from "@/pages/studyPlanner/addStudyTask";
import EditStudyTask from "@/pages/studyPlanner/EditStudyTask";

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
    element: <ProtecctedRoute Component={AuthLayout} />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "budget-tracker",
        element: <BudgetTracker />,
      },
      {
        path: "add-budget",
        element: <AddBudget />,
      },
      {
        path: "schedule-tracker",
        element: <ScheduleTracker />,
      },
      {
        path: "add-schedule",
        element: <AddSchedule />
      },
      {
        path: "edit-schedule/:id",
        element: <EditSchedule />
      },
      {
        path: "study-planner",
        element: <StudyPlanner />,
      },
      {
        path: "add-study-task",
        element: <AddStudyTask/>
      },
      {
        path: "edit-study-task/:id",
        element: <EditStudyTask/>
      },
      {
        path: "study-assistant",
        element: <StudyAssistant />,
      },
      {
        path: "quiz-generator",
        element: <QuizGenerator />,
      },
    ],
  },
]);

export default router;
