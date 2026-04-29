import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

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

async function forwardRequest(request: NextRequest, method: "GET" | "POST") {
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
    upstreamResponse = await fetch(`${apiBaseUrl}/api/v1/admin/streams`, {
      method,
      headers,
      body: method === "POST" ? await request.text() : undefined,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ detail: "Unable to reach API server." }, { status: 502 });
  }

  const responseText = await upstreamResponse.text();

  if (upstreamResponse.ok && method === "POST") {
    try {
      const stream = JSON.parse(responseText) as { external_match_id?: string };
      if (stream.external_match_id) {
        revalidateStream(stream.external_match_id);
      }
    } catch {
      // Ignore malformed upstream response bodies; the response is still forwarded.
    }
  }

  return new NextResponse(responseText, {
    status: upstreamResponse.status,
    headers: {
      "Content-Type": upstreamResponse.headers.get("content-type") || "application/json",
    },
  });
}

export async function GET(request: NextRequest) {
  return forwardRequest(request, "GET");
}

export async function POST(request: NextRequest) {
  return forwardRequest(request, "POST");
}

function revalidateStream(externalMatchId: string) {
  for (const locale of PUBLIC_LOCALES) {
    revalidateTag(`match:${locale}:${externalMatchId}`);
  }
}
