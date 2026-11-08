import type { User, RegisterPayload } from './auth.types';

const STORAGE_KEY = 'shopboard_user_v1';

export type AuthListener = (user: User | null) => void;

export class AuthManager {
  private listeners: Set<AuthListener>;
  private currentUser: User | null;

  constructor() {
    this.listeners = new Set();
    this.currentUser = this.loadUser();
  }

  loadUser(): User | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  saveUser(user: User | null): void {
    this.currentUser = user;
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // storage unavailable
    }
    this.notify();
  }

  subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener);
    listener(this.currentUser);
    return () => this.listeners.delete(listener);
  }

  notify(): void {
    this.listeners.forEach((fn) => fn(this.currentUser));
  }

  login(email: string, _password?: string, remember: boolean = true): User {
    const user: User = {
      name: email.split('@')[0],
      email: email,
      token: 'demo_token_' + Date.now(),
    };
    if (remember) {
      this.saveUser(user);
    } else {
      this.currentUser = user;
      this.notify();
    }
    return user;
  }

  register({ name, email, phone }: RegisterPayload): User {
    const user: User = {
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : undefined,
      token: 'demo_token_' + Date.now(),
    };
    this.saveUser(user);
    return user;
  }

  logout(): void {
    this.saveUser(null);
  }

  getUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return Boolean(this.currentUser);
  }
}

export const auth = new AuthManager();
