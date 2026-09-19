import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { api, type ListIncidentsParams } from "@/lib/api"

const KEYS = {
  all: ["incidents"] as const,
  list: (params: ListIncidentsParams) => [...KEYS.all, "list", params] as const,
  detail: (id: string) => [...KEYS.all, "detail", id] as const,
  analytics: ["analytics", "summary"] as const,
}

export function useIncidents(params: ListIncidentsParams = {}) {
  return useQuery({
    queryKey: KEYS.list(params),
    queryFn: () => api.listIncidents(params),
  })
}

export function useIncident(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => api.getIncident(id),
    enabled: Boolean(id),
    retry: false,
  })
}

export function useAnalytics() {
  return useQuery({
    queryKey: KEYS.analytics,
    queryFn: () => api.analyticsSummary(),
  })
}

export function useAnalyzeReport() {
  return useMutation({
    mutationFn: (text: string) => api.analyze(text),
  })
}

export function useSubmitReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ text, department }: { text: string; department: string }) =>
      api.submit(text, department),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all })
      qc.invalidateQueries({ queryKey: KEYS.analytics })
    },
  })
}