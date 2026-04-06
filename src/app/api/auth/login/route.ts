import { NextResponse } from "next/server";
import { authenticateAuthAccount, createAuthSession } from "@/lib/auth-store";
import { getPaymentByStudentId, getUserById } from "@/lib/portal-data";
import { getPaymentOverrideCookieName, SESSION_COOKIE } from "@/lib/auth";

function getField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = getField(formData, "email");
  const password = getField(formData, "password");
  const account = await authenticateAuthAccount({ email, password });
  const user = account ? getUserById(account.userId) : null;

  if (!user) {
    return NextResponse.redirect(new URL("/login?error=invalid", request.url), 303);
  }

  const session = await createAuthSession(user.id);
  const response = NextResponse.redirect(
    new URL(user.role === "secretary" ? "/dashboard/finance" : "/dashboard", request.url),
    303,
  );

  response.cookies.set(SESSION_COOKIE, session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  if (user.role === "student") {
    const payment = getPaymentByStudentId(user.id);
    const paidOverride = request.headers.get("cookie")?.includes(
      `${getPaymentOverrideCookieName(user.id)}=paid`,
    );

    if (payment?.status === "unpaid" && !paidOverride) {
      const paymentResponse = NextResponse.redirect(
        new URL(`/payment?userId=${encodeURIComponent(user.id)}`, request.url),
        303,
      );

      paymentResponse.cookies.set(SESSION_COOKIE, session.token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });

      return paymentResponse;
    }
  }

  return response;
}
