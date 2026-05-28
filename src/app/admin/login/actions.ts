"use server";

import { redirect } from "next/navigation";
import { authenticateAdmin, createAdminSession } from "@/lib/admin-auth";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/admin/login?error=missing");
  }

  const user = await authenticateAdmin(email, password);
  if (!user) {
    redirect("/admin/login?error=invalid");
  }

  await createAdminSession(user.id);
  redirect("/admin");
}
