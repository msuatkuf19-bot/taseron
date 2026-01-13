import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getMyJobById } from "@/actions/jobs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EditJobForm } from "./edit-form";

export default async function IlanDuzenlePage({
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

  // Sadece DRAFT ve REJECTED ilanlar düzenlenebilir
  if (job.approvalStatus !== "DRAFT" && job.approvalStatus !== "REJECTED") {
    redirect("/dashboard/taseron/ilanlar");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/dashboard/taseron/ilanlar">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri Dön
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">İlanı Düzenle</CardTitle>
          <CardDescription>
            {job.approvalStatus === "REJECTED" && job.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                <p className="text-sm font-semibold text-red-800 mb-1">
                  Red Sebebi:
                </p>
                <p className="text-sm text-red-700">{job.rejectionReason}</p>
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditJobForm job={job} />
        </CardContent>
      </Card>
    </div>
  );
}
