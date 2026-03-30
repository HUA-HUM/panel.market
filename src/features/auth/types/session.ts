export type UserRole = 'admin' | 'operator' | 'viewer';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export type Session = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LogoutPayload = {
  accessToken: string;
  refreshToken: string;
};
