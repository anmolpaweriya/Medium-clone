import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createArticle,
  getMyArticles,
  updateArticle,
  getFeed,
  getFollowingFeed,
  getTopicsFeed,
  type CreateArticlePayload,
  getArticleDetails,
  getArticleComments,
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

export function useUpdateArticle(id: string) {
  return useMutation({
    mutationFn: (data: Partial<CreateArticlePayload>) =>
      updateArticle(id, data),

    onSuccess: () => {
      toast.success("Draft saved");
    },

    onError: () => {
      toast.error("Failed to save draft");
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
