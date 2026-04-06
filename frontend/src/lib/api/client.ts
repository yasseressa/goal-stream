import { getApiBaseUrl } from "@/lib/auth";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

interface RequestOptions extends RequestInit {
  token?: string | null;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      cache: rest.cache ?? "no-store",
    });
  } catch {
    throw new ApiError("Unable to reach API server", 0);
  }

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const payload = (await response.json()) as { detail?: string };
      detail = payload.detail || detail;
    } catch {
      // Ignore JSON parsing failure for non-JSON errors.
    }
    throw new ApiError(detail, response.status);
  }

  return response.json() as Promise<T>;
}
