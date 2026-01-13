import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminListPendingJobs } from "@/actions/jobs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Eye } from "lucide-react";
import Link from "next/link";
import { ApprovalStatusBadge } from "@/components/jobs/approval-status-badge";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export default async function AdminIlanOnayPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">İlan Onay Kuyruğu</h1>
        <p className="text-gray-600 mt-1">
          Taşeronlar tarafından gönderilen ilanları inceleyin ve onaylayın
        </p>
      </div>

      <Suspense fallback={<JobListSkeleton />}>
        <PendingJobsList />
      </Suspense>
    </div>
  );
}

async function PendingJobsList() {
  const result = await adminListPendingJobs();

  if (result.error) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-red-500">{result.error}</p>
        </CardContent>
      </Card>
    );
  }

  const jobs = result.jobs || [];

  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Clock className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Onay bekleyen ilan bulunmuyor</p>
          <p className="text-gray-400 text-sm mt-2">
            Yeni ilanlar geldiğinde burada görünecektir
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {jobs.map((job: any) => (
        <Card key={job.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <ApprovalStatusBadge approvalStatus={job.approvalStatus} />
                </div>
                <CardDescription className="space-y-1">
                  <div>
                    {job.city} • {getCategoryLabel(job.category)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Gönderen:</span>
                    {job.createdBy?.contractorProfile?.displayName ||
                      job.createdBy?.email}
                    {job.createdBy?.contractorProfile?.city && (
                      <span className="text-gray-400">
                        ({job.createdBy.contractorProfile.city})
                      </span>
                    )}
                  </div>
                  <div className="text-gray-500">
                    {formatDistanceToNow(new Date(job.createdAt), {
                      addSuffix: true,
                      locale: tr,
                    })}
                  </div>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>

            <div className="flex gap-3">
              {job.budgetMin || job.budgetMax ? (
                <div className="flex-1 bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-600 mb-1">Bütçe</p>
                  <p className="font-semibold text-gray-900">
                    {job.budgetMin && job.budgetMax
                      ? `${job.budgetMin.toLocaleString()} - ${job.budgetMax.toLocaleString()} ₺`
                      : job.budgetMin
                      ? `${job.budgetMin.toLocaleString()} ₺+`
                      : `${job.budgetMax.toLocaleString()} ₺'ye kadar`}
                  </p>
                </div>
              ) : null}

              {job.durationText && (
                <div className="flex-1 bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-600 mb-1">Süre</p>
                  <p className="font-semibold text-gray-900">
                    {job.durationText}
                  </p>
                </div>
              )}
            </div>

            <Button
              asChild
              className="w-full mt-4 bg-[#F37021] hover:bg-[#D85F17]"
            >
              <Link href={`/admin/ilan-onay/${job.id}`}>
                <Eye className="w-4 h-4 mr-2" />
                İncele ve Karar Ver
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function getCategoryLabel(category: string): string {
  const categories: Record<string, string> = {
    KABA_INSAAT: "Kaba İnşaat",
    INCE_INSAAT: "İnce İnşaat",
    ELEKTRIK: "Elektrik",
    TESISAT: "Tesisat",
    BOYA_BADANA: "Boya Badana",
    DEKORASYON: "Dekorasyon",
    IZOLASYON: "İzolasyon",
    CELIK_YAPI: "Çelik Yapı",
    PEYZAJ: "Peyzaj",
    RESTORASYON: "Restorasyon",
  };
  return categories[category] || category;
}

function JobListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse mt-2" />
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-2" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-4" />
            <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
