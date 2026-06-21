import { redirect } from "next/navigation";
import { buildProgressHubRoute } from "@/lib/routes";

export default function Page() {
  redirect(buildProgressHubRoute("history"));
}
