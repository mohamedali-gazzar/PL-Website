import { redirect } from "next/navigation";

// This project hosts only the analytics dashboard — send the root there.
export default function Home() {
  redirect("/admin/analytics");
}
