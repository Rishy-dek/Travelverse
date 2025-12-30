import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";

export function useSignup() {
  return useMutation({
    mutationFn: async (data: { email: string; password: string; country: string }) => {
      const res = await apiRequest("POST", api.auth.signup.path, data);
      return (await res.json()) as { id: number; email: string };
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await apiRequest("POST", api.auth.login.path, data);
      return (await res.json()) as { id: number; email: string; country: string };
    },
  });
}
