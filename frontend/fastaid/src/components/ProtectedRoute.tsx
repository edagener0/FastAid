import { Navigate } from "react-router-dom";
import { type ReactNode, useContext } from 'react';
import { AuthContext } from "../auth/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}
