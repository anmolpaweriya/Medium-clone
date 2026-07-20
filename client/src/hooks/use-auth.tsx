import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getMe,
  toggleFollowUser,
  getFollowingUsers,
  toggleBookmarkArticle,
  getBookmarkedArticles,
  getNotifications,
  markNotificationsRead,
  updateProfile,
  type UpdateProfileData,
} from "@/lib/auth";

export function useAuth() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await getMe();
      return data;
    },
    retry: false,
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });
}

export function useToggleFollow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (targetId: string) => toggleFollowUser(targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
      toast.success("Updated follow status");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update follow");
    },
  });
}

export function useFollowing() {
  return useQuery({
    queryKey: ["following"],
    queryFn: async () => {
      const { data } = await getFollowingUsers();
      return data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (articleId: string) => toggleBookmarkArticle(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      toast.success("Bookmark updated");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update bookmark");
    },
  });
}

export function useBookmarks() {
  return useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const { data } = await getBookmarkedArticles();
      return data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await getNotifications();
      return data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileData) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Profile updated successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update profile");
    },
  });
}
