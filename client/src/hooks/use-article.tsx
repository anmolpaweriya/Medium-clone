import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createArticle,
  getMyArticles,
  updateArticle,
  getFeed,
  getFollowingFeed,
  getTopicsFeed,
  getTrendingFeed,
  type CreateArticlePayload,
  getArticleDetails,
  getArticleComments,
  likeArticle,
  postComment,
  deleteComment,
} from "@/lib/article";
import api from "@/lib/api";

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateArticlePayload) =>
      createArticle(data),

    onSuccess: () => {
      toast.success("Article created");
      queryClient.invalidateQueries({
        queryKey: ["my-articles"],
      });
    },

    onError: (err: any) => {
      toast.error(
        err.response?.data?.message ??
          "Failed to create article"
      );
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateArticlePayload> }) =>
      updateArticle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-articles"] });
      queryClient.invalidateQueries({ queryKey: ["article"] });
      toast.success("Article saved");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to save article");
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteArticle(id),
    onSuccess: () => {
      toast.success("Article deleted");
      queryClient.invalidateQueries({ queryKey: ["my-articles"] });
    },
    onError: () => {
      toast.error("Failed to delete article");
    },
  });
}


export function useMyArticles() {
  return useQuery({
    queryKey: ["my-articles"],
    queryFn: async () => {
      const { data } = await getMyArticles();
      return data;
    },
  });
}




export function useFeed() {
  return useQuery({
    queryKey: ["feed"],
    queryFn: async () => {
      const { data } = await getFeed();
      return data;
    },
  });
}

export function useFollowingFeed() {
  return useQuery({
    queryKey: ["following-feed"],
    queryFn: async () => {
      const { data } = await getFollowingFeed();
      return data;
    },
  });
}

export function useTopicsFeed() {
  return useQuery({
    queryKey: ["topics-feed"],
    queryFn: async () => {
      const { data } = await getTopicsFeed();
      return data;
    },
  });
}

export function useTrendingFeed() {
  return useQuery({
    queryKey: ["trending-feed"],
    queryFn: async () => {
      const { data } = await getTrendingFeed();
      return data;
    },
  });
}



export function useArticle(slug: string) {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data } = await getArticleDetails(slug);
      return data;
    },
    enabled: !!slug,
  });
}


export function useComments(articleId: string) {
  return useQuery({
    queryKey: ["comments", articleId],
    queryFn: async () => {
      const { data } = await getArticleComments(articleId);
      return data;
    },
    enabled: !!articleId,
  });
}

export function useRelatedArticles(tags: string[], currentSlug: string) {
    return useQuery({
        queryKey: ["related", currentSlug],
        queryFn: async () => {
            const { data } = await api.get("/articles", {
                params: {
                    tags: tags.join(","),
                    exclude: currentSlug,
                },
            });

            return data;
        },
        enabled: tags.length > 0,
    });
}

export function useToggleLike(articleId: string, slug?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => likeArticle(articleId),
    onSuccess: () => {
      if (slug) {
        queryClient.invalidateQueries({ queryKey: ["article", slug] });
      }
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["home"] });
      queryClient.invalidateQueries({ queryKey: ["my-articles"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to toggle like");
    },
  });
}

export function useCreateComment(articleId: string, slug?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => postComment({ articleId, content }),
    onSuccess: () => {
      toast.success("Response posted");
      queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
      if (slug) {
        queryClient.invalidateQueries({ queryKey: ["article", slug] });
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to post comment");
    },
  });
}

export function useDeleteComment(articleId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      toast.success("Comment deleted");
      queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
    },
    onError: () => {
      toast.error("Failed to delete comment");
    },
  });
}
