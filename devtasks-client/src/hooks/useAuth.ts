import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/auth";

export const useAuth = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });
};
