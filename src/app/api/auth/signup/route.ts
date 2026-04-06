import { NextResponse } from "next/server";
import { createAuthSession, ensureAuthAccount, removeAuthAccount } from "@/lib/auth-store";
import { addUser, getUserByEmail, removeUser, type UserRole } from "@/lib/portal-data";
import { SESSION_COOKIE } from "@/lib/auth";

function getField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = getField(formData, "name");
  const email = getField(formData, "email");
  const password = getField(formData, "password");
  const role = getField(formData, "role") as UserRole;

  if (!name || !email || !password) {
    return NextResponse.redirect(new URL("/login?error=missing", request.url), 303);
  }

  if (!["owner", "secretary", "teacher", "student"].includes(role)) {
    return NextResponse.redirect(new URL("/login?error=role", request.url), 303);
  }

  if (getUserByEmail(email)) {
    return NextResponse.redirect(new URL("/login?error=exists", request.url), 303);
  }

  const user = addUser({
    name,
    email,
    role,
    title:
      role === "owner"
        ? "Campus owner"
        : role === "teacher"
          ? "Teacher"
          : role === "secretary"
            ? "Finance secretary"
            : "Student",
  });

  try {
    await ensureAuthAccount({
      userId: user.id,
      email: user.email,
      password,
    });
  } catch {
    await removeAuthAccount(user.id);
    removeUser(user.id);
    return NextResponse.redirect(new URL("/login?error=signup", request.url), 303);
  }

  const session = await createAuthSession(user.id);
  const destination = user.role === "student" ? "/payment" : user.role === "secretary" ? "/dashboard/finance" : "/dashboard";
  const response = NextResponse.redirect(new URL(destination, request.url), 303);

  response.cookies.set(SESSION_COOKIE, session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}
