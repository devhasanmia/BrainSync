import { Navigate } from "react-router";
import { useProfileQuery } from "../../redux/features/auth/authApi";
import type { ComponentType } from "react";
import { useEffect, useState } from "react";

interface RouteProps {
  Component: ComponentType;
}

export const ProtecctedRoute = ({ Component }: RouteProps) => {
  const { data, isLoading } = useProfileQuery("");
  const [showLoading, setShowLoading] = useState(true);
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Brain Sync";
    const timer = setTimeout(() => setShowLoading(false), 250);
    return () => {
      clearTimeout(timer);
      document.title = prevTitle;
    };
  }, []);

  if (isLoading || showLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white tracking-tight">
            Brain <span className="text-indigo-500">Sync</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Preparing your experience...
          </p>
          {/* Spinner */}
          <div className="mt-6 w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!data?.data?.email) {
    return <Navigate to="/login" replace />;
  }

  return <Component />;
};
