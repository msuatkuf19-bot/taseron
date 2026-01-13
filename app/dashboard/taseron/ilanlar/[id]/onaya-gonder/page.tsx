import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getMyJobById } from "@/actions/jobs";
import OnayaGonderClient from "./client";

export default async function OnayaGonderPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "TASERON") {
    redirect("/login");
  }

  const result = await getMyJobById(params.id);

  if (result.error || !result.job) {
    redirect("/dashboard/taseron/ilanlar");
  }

  const job = result.job;

  // Sadece DRAFT ve REJECTED ilanlar onaya gönderilebilir
  if (job.approvalStatus !== "DRAFT" && job.approvalStatus !== "REJECTED") {
    redirect("/dashboard/taseron/ilanlar");
  }

  return <OnayaGonderClient job={job} />;
}
