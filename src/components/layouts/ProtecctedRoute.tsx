import { Navigate } from "react-router";
import { useProfileQuery } from "../../redux/features/auth/authApi";
import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import Loading from "../ui/Loading";

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
    return <Loading />;
  }

  if (!data?.data?.email) {
    return <Navigate to="/login" replace />;
  }

  return <Component />;
};
