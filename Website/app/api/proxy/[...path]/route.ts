import { NextRequest, NextResponse } from "next/server";

function getTargetBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || "";
  return raw.replace(/\/$/, "");
}

function buildTargetUrl(pathParts: string[], search: string): string {
  const base = getTargetBaseUrl();
  if (!base) {
    throw new Error("Missing NEXT_PUBLIC_API_URL");
  }

  const path = pathParts.map(encodeURIComponent).join("/");
  return `${base}/${path}${search || ""}`;
}

async function forward(request: NextRequest, pathParts: string[]): Promise<NextResponse> {
  const targetUrl = buildTargetUrl(pathParts, request.nextUrl.search);

  const incomingType = request.headers.get("content-type") || "";
  const headers = new Headers();

  // Forward auth and content headers required by backend.
  const auth = request.headers.get("authorization");
  if (auth) headers.set("authorization", auth);
  if (incomingType) headers.set("content-type", incomingType);

  const method = request.method.toUpperCase();
  const withBody = !(method === "GET" || method === "HEAD");

  const init: RequestInit = {
    method,
    headers,
    // Cookies are already same-origin in this request. We forward only authorization explicitly.
    cache: "no-store"
  };

  if (withBody) {
    const body = await request.arrayBuffer();
    init.body = body;
  }

  const upstream = await fetch(targetUrl, init);
  const contentType = upstream.headers.get("content-type") || "application/json";
  const responseHeaders = new Headers({ "content-type": contentType });

  const responseBody = await upstream.arrayBuffer();
  return new NextResponse(responseBody, {
    status: upstream.status,
    headers: responseHeaders
  });
}

export async function GET(request: NextRequest, context: { params: { path: string[] } }) {
  return forward(request, context.params.path || []);
}

export async function POST(request: NextRequest, context: { params: { path: string[] } }) {
  return forward(request, context.params.path || []);
}

export async function PATCH(request: NextRequest, context: { params: { path: string[] } }) {
  return forward(request, context.params.path || []);
}

export async function PUT(request: NextRequest, context: { params: { path: string[] } }) {
  return forward(request, context.params.path || []);
}

export async function DELETE(request: NextRequest, context: { params: { path: string[] } }) {
  return forward(request, context.params.path || []);
}

export async function OPTIONS(request: NextRequest, context: { params: { path: string[] } }) {
  return forward(request, context.params.path || []);
}
