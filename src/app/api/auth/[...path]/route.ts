import { NextRequest, NextResponse } from 'next/server';

function getAuthApiBaseUrl(): string {
  const baseUrl = process.env.AUTH_API_BASE_URL;

  if (!baseUrl) {
    throw new Error('AUTH_API_BASE_URL is not configured.');
  }

  return baseUrl.replace(/\/$/, '');
}

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
  method: 'GET' | 'POST',
) {
  const { path } = await context.params;
  const upstreamUrl = new URL(`${getAuthApiBaseUrl()}/auth/${path.join('/')}`);
  const requestBody = method === 'GET' ? undefined : await request.text();

  upstreamUrl.search = request.nextUrl.search;

  const headers = {
    Accept: request.headers.get('accept') ?? 'application/json',
    ...(request.headers.get('content-type')
      ? { 'Content-Type': request.headers.get('content-type') as string }
      : {}),
    ...(request.headers.get('authorization')
      ? { Authorization: request.headers.get('authorization') as string }
      : {}),
  };

  let response = await fetch(upstreamUrl.toString(), {
    method,
    headers,
    body: requestBody,
    cache: 'no-store',
    redirect: 'manual',
  });

  if (
    response.status >= 300 &&
    response.status < 400 &&
    response.headers.get('location')
  ) {
    const redirectedUrl = new URL(
      response.headers.get('location') as string,
      upstreamUrl,
    );

    response = await fetch(redirectedUrl.toString(), {
      method,
      headers,
      body: requestBody,
      cache: 'no-store',
      redirect: 'manual',
    });
  }

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
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context, 'GET');
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context, 'POST');
}
