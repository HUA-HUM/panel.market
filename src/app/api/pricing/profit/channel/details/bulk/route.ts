import { NextRequest, NextResponse } from 'next/server';

function getPriceApiBaseUrl() {
  const baseUrl = process.env.PRICE_API_URL;

  if (!baseUrl) {
    throw new Error('PRICE_API_URL is not configured.');
  }

  return baseUrl.replace(/\/$/, '');
}

function getPriceApiKey() {
  const apiKey = process.env.PRICE_API_KEY;

  if (!apiKey) {
    throw new Error('PRICE_API_KEY is not configured.');
  }

  return apiKey;
}

export async function POST(request: NextRequest) {
  const upstreamUrl = new URL(
    `${getPriceApiBaseUrl()}/internal/getProfit/channel/details/bulk`
  );

  upstreamUrl.search = request.nextUrl.search;

  const response = await fetch(upstreamUrl.toString(), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': getPriceApiKey(),
    },
    body: await request.text(),
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
