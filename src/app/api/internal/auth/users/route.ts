import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';

type AuthMeResponse = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'operator' | 'viewer';
};

function getMadreApiBaseUrl(): string {
  const baseUrl = process.env.MADRE_API_URL ?? process.env.NEXT_PUBLIC_MADRE_API_URL;

  if (!baseUrl) {
    throw new Error('MADRE_API_URL is not configured.');
  }

  const normalizedBaseUrl = baseUrl.replace(/\/$/, '');

  return normalizedBaseUrl.endsWith('/api')
    ? normalizedBaseUrl.slice(0, -4)
    : normalizedBaseUrl;
}

function getAuthApiBaseUrl(): string {
  const baseUrl = process.env.AUTH_API_BASE_URL;

  if (!baseUrl) {
    throw new Error('AUTH_API_BASE_URL is not configured.');
  }

  return baseUrl.replace(/\/$/, '');
}

function getInternalApiKey(): string {
  const key = process.env.INTERNAL_API_KEY;

  if (!key) {
    throw new Error('INTERNAL_API_KEY is not configured.');
  }

  return key;
}

export async function POST(request: NextRequest) {
  const authorization = request.headers.get('authorization');

  if (!authorization) {
    return NextResponse.json(
      { message: 'Missing Authorization header.' },
      { status: 401 },
    );
  }

  const currentUserResponse = await fetch(`${getAuthApiBaseUrl()}/auth/me`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: authorization,
    },
    cache: 'no-store',
  });

  if (!currentUserResponse.ok) {
    const body = await currentUserResponse.text();
    return new NextResponse(body, {
      status: currentUserResponse.status,
      headers: {
        'Content-Type': currentUserResponse.headers.get('content-type') ?? 'application/json',
      },
    });
  }

  const currentUser = (await currentUserResponse.json()) as AuthMeResponse;

  if (currentUser.role !== 'admin') {
    return NextResponse.json(
      { message: 'Only admin users can create new accounts.' },
      { status: 403 },
    );
  }

  const payload = (await request.json()) as {
    email?: string;
    name?: string;
    password?: string;
    role?: 'admin' | 'operator' | 'viewer';
    isActive?: boolean;
  };

  if (!payload.email || !payload.name || !payload.password || !payload.role) {
    return NextResponse.json(
      { message: 'Missing required user fields.' },
      { status: 400 },
    );
  }

  const passwordHash = await hash(payload.password, 10);

  const response = await fetch(`${getMadreApiBaseUrl()}/api/internal/auth/users`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-internal-api-key': getInternalApiKey(),
    },
    body: JSON.stringify({
      email: payload.email,
      passwordHash,
      name: payload.name,
      role: payload.role,
      isActive: payload.isActive ?? true,
    }),
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
