import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Start with base URL (first element)
    let url = queryKey[0] as string;
    const pathSegments: string[] = [];
    const queryParams: Record<string, string> = {};

    // Process remaining elements
    for (let i = 1; i < queryKey.length; i++) {
      const element = queryKey[i];
      
      // If it's a string, add to path segments
      if (typeof element === 'string') {
        pathSegments.push(element);
      }
      // If it's an object, merge into query params
      else if (typeof element === 'object' && element !== null && !Array.isArray(element)) {
        Object.entries(element as Record<string, any>).forEach(([key, value]) => {
          // Skip undefined, null, and empty string values
          if (value !== undefined && value !== null && value !== '') {
            queryParams[key] = String(value);
          }
        });
      }
    }

    // Add path segments to URL
    if (pathSegments.length > 0) {
      url = `${url}/${pathSegments.join('/')}`;
    }

    // Add query params to URL (only if there are valid params)
    const paramEntries = Object.entries(queryParams);
    if (paramEntries.length > 0) {
      const params = new URLSearchParams(queryParams);
      url = `${url}?${params.toString()}`;
    }

    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
    mutations: {
      retry: false,
    },
  },
});
