import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/auth";

export function useAuth() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await getMe();
      return data;
    },
    retry: false,
    enabled: !!localStorage.getItem("token"),
  });
}
