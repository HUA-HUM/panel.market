import { NextRequest, NextResponse } from 'next/server';

function getMadreApiUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_MADRE_API_URL ?? process.env.MADRE_API_URL;

  if (!baseUrl) {
    throw new Error('Madre API base URL is not configured.');
  }

  return baseUrl.replace(/\/$/, '');
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const upstreamUrl = new URL(
    `${getMadreApiUrl()}/api/${path.join('/')}`
  );

  upstreamUrl.search = request.nextUrl.search;

  const response = await fetch(upstreamUrl.toString(), {
    method: 'GET',
    headers: {
      Accept: request.headers.get('accept') ?? '*/*',
      ...(request.headers.get('authorization')
        ? { Authorization: request.headers.get('authorization') as string }
        : {}),
    },
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
