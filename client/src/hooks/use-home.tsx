import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useHome() {
    return useQuery({
        queryKey: ["home"],
        queryFn: async () => {
            const { data } = await api.get("/articles/home");
            return data;
        },
    });
}
