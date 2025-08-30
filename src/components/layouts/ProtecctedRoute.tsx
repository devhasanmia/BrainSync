import { Navigate } from "react-router";
import { useProfileQuery } from "../../redux/features/auth/authApi";
import type { ComponentType } from "react";

export const ProtecctedRoute = (Component: ComponentType) => {
  return function AuthWrapper() {
    const { data, isLoading } = useProfileQuery(undefined);
    if (!isLoading && !data?.data?.email) {
      return <Navigate to="/login" />;
    }
    return <Component />;
  };
};
