import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_LOCALES = ["ar", "en", "fr", "es"];

function normalizeApiBaseUrl(value?: string) {
  if (!value) {
    return "";
  }

  return value.startsWith("http://") || value.startsWith("https://") ? value : `http://${value}`;
}

function getApiBaseUrl() {
  return normalizeApiBaseUrl(
    process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
  );
}

export async function POST(request: NextRequest) {
  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl) {
    return NextResponse.json({ detail: "API base URL is not configured." }, { status: 500 });
  }

  const authorization = request.headers.get("authorization");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (authorization) {
    headers.Authorization = authorization;
  }

  let upstreamResponse: Response;

  try {
    upstreamResponse = await fetch(`${apiBaseUrl}/api/v1/admin/fixtures-cache/refresh`, {
      method: "POST",
      headers,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ detail: "Unable to reach API server." }, { status: 502 });
  }

  const responseText = await upstreamResponse.text();

  if (upstreamResponse.ok) {
    for (const locale of PUBLIC_LOCALES) {
      revalidatePath(`/${locale}`);
      revalidatePath(`/${locale}/matches`);
    }
  }

  return new NextResponse(responseText, {
    status: upstreamResponse.status,
    headers: {
      "Content-Type": upstreamResponse.headers.get("content-type") || "application/json",
    },
  });
}
