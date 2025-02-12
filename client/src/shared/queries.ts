import { QueryClient } from "@tanstack/react-query";

/**
 * If you don't want to work with the real API, run this
 *
 *    DEMO_MODE=true pnpm dev
 *
 */
import { getPatient, getNewPatient, getConditions } from "./service";

/** ------------------ React Query Stuff ------------------ */

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
    },
  },
});

export const knownPatientQuery = (id: string) => ({
  queryKey: ["patient", "known", id],
  queryFn: async () => {
    const response = await getPatient(id, __DEMO_MODE__);
    return response;
  },
});

export const newPatientQuery = (conditions: string[]) => ({
  queryKey: ["patient", "new", conditions.join("")],
  queryFn: async () => {
    const response = await getNewPatient(conditions, __DEMO_MODE__);
    return response;
  },
});

export const conditionQuery = (code: string) => ({
  queryKey: ["condition", code],
  queryFn: async () => {
    const response = await getConditions(code, __DEMO_MODE__);
    return response;
  },
});
