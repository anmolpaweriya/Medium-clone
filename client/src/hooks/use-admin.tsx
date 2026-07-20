import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  deleteAdminArticle,
  deleteAdminUser,
  getAdminArticles,
  getAdminStats,
  getAdminUsers,
  toggleUserRole,
} from "@/lib/admin";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await getAdminStats();
      return data;
    },
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data } = await getAdminUsers();
      return data;
    },
  });
}

export function useAdminArticles() {
  return useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const { data } = await getAdminArticles();
      return data;
    },
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminUser(id),
    onSuccess: () => {
      toast.success("User and their content deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete user.");
    },
  });
}

export function useDeleteAdminArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminArticle(id),
    onSuccess: () => {
      toast.success("Article deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete article.");
    },
  });
}

export function useToggleUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleUserRole(id),
    onSuccess: () => {
      toast.success("User role updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update user role.");
    },
  });
}
