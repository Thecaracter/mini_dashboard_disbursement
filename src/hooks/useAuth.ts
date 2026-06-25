"use client";

import { useRouter } from "next/navigation";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { SignJWT, jwtVerify } from "jose";
import type { Role, User } from "@/models/transaction";

const CREDENTIALS: Record<string, { password: string; role: Role }> = {
  admin: { password: "admin123", role: "admin" },
  operator: { password: "operator123", role: "operator" },
};

const JWT_SECRET = new TextEncoder().encode("lintaspay-secret-key-2024");
const COOKIE_NAME = "token";

export async function generateToken(user: Omit<User, "exp">): Promise<string> {
  return new SignJWT({ username: user.username, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      username: payload.username as string,
      role: payload.role as Role,
      exp: payload.exp as number,
    };
  } catch {
    return null;
  }
}

// Ambil user dari cookie token
export async function getCurrentUser(): Promise<User | null> {
  const token = getCookie(COOKIE_NAME) as string | undefined;
  if (!token) return null;
  return verifyToken(token);
}

export function useAuth() {
  const router = useRouter();

  const login = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const cred = CREDENTIALS[trimmedUsername];

    if (!cred || cred.password !== trimmedPassword) {
      return { success: false, error: "Username atau password salah." };
    }

    const token = await generateToken({ username: trimmedUsername, role: cred.role });

    setCookie(COOKIE_NAME, token, {
      maxAge: 60 * 60, // 1 jam
      path: "/",
    });

    router.push("/");
    router.refresh();

    return { success: true };
  };

  const logout = () => {
    deleteCookie(COOKIE_NAME);
    router.push("/login");
    router.refresh();
  };

  return { login, logout };
}
