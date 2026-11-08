export interface User {
  name: string;
  email: string;
  token: string;
  phone?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
