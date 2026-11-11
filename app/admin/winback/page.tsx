import { redirect } from "next/navigation";

export default function AdminWinbackRedirect() {
  redirect("/admin/winback-results");
}