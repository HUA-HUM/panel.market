import { NextRequest, NextResponse } from 'next/server';

function getProductsApiUrl(): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_PRODUCTS_API_URL ?? process.env.PRODUCTS_API_URL;

  if (!baseUrl) {
    throw new Error('Products API base URL is not configured.');
  }

  return baseUrl.replace(/\/$/, '');
}

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
  method: 'GET' | 'POST'
) {
  const { path } = await context.params;
  const upstreamUrl = new URL(
    `${getProductsApiUrl()}/${path.join('/')}`
  );

  upstreamUrl.search = request.nextUrl.search;

  const response = await fetch(upstreamUrl.toString(), {
    method,
    headers: {
      Accept: request.headers.get('accept') ?? '*/*',
      ...(method !== 'GET' && request.headers.get('content-type')
        ? { 'Content-Type': request.headers.get('content-type') as string }
        : {}),
    },
    body: method === 'GET' ? undefined : await request.text(),
    cache: 'no-store',
  });

  const contentType = response.headers.get('content-type') ?? 'application/json';
  const body = await response.text();

  return new NextResponse(body, {
    status: response.status,
    headers: {
      'Content-Type': contentType,
    },
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, context, 'GET');
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, context, 'POST');
}
