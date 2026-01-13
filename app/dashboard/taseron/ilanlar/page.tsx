import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { listMyJobsByApprovalStatus } from "@/actions/jobs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Clock, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { ApprovalStatusBadge } from "@/components/jobs/approval-status-badge";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export default async function TaseronIlanlarPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "TASERON") {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">İlanlarım</h1>
          <p className="text-gray-600 mt-1">
            İlanlarınızı yönetin, onaya gönderin ve durumlarını takip edin
          </p>
        </div>
        <Button asChild className="bg-[#F37021] hover:bg-[#D85F17]">
          <Link href="/dashboard/taseron/ilanlar/yeni">
            <Plus className="w-4 h-4 mr-2" />
            Yeni İlan
          </Link>
        </Button>
      </div>

      <Suspense fallback={<JobListSkeleton />}>
        <JobTabs />
      </Suspense>
    </div>
  );
}

async function JobTabs() {
  const [draftResult, pendingResult, approvedResult, rejectedResult] =
    await Promise.all([
      listMyJobsByApprovalStatus("DRAFT"),
      listMyJobsByApprovalStatus("PENDING_APPROVAL"),
      listMyJobsByApprovalStatus("APPROVED"),
      listMyJobsByApprovalStatus("REJECTED"),
    ]);

  const drafts = draftResult.jobs || [];
  const pending = pendingResult.jobs || [];
  const approved = approvedResult.jobs || [];
  const rejected = rejectedResult.jobs || [];

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="all">
          Tümü ({drafts.length + pending.length + approved.length + rejected.length})
        </TabsTrigger>
        <TabsTrigger value="draft">
          <FileText className="w-4 h-4 mr-2" />
          Taslak ({drafts.length})
        </TabsTrigger>
        <TabsTrigger value="pending">
          <Clock className="w-4 h-4 mr-2" />
          Onay Bekliyor ({pending.length})
        </TabsTrigger>
        <TabsTrigger value="approved">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Onaylanan ({approved.length})
        </TabsTrigger>
        <TabsTrigger value="rejected">
          <XCircle className="w-4 h-4 mr-2" />
          Reddedilen ({rejected.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-6">
        <JobList
          jobs={[...drafts, ...pending, ...approved, ...rejected]}
          emptyMessage="Henüz hiç ilan oluşturmadınız"
        />
      </TabsContent>

      <TabsContent value="draft" className="mt-6">
        <JobList jobs={drafts} emptyMessage="Taslak ilan bulunmuyor" />
      </TabsContent>

      <TabsContent value="pending" className="mt-6">
        <JobList
          jobs={pending}
          emptyMessage="Onay bekleyen ilan bulunmuyor"
        />
      </TabsContent>

      <TabsContent value="approved" className="mt-6">
        <JobList jobs={approved} emptyMessage="Onaylanmış ilan bulunmuyor" />
      </TabsContent>

      <TabsContent value="rejected" className="mt-6">
        <JobList
          jobs={rejected}
          emptyMessage="Reddedilmiş ilan bulunmuyor"
          showRejectionReason
        />
      </TabsContent>
    </Tabs>
  );
}

function JobList({
  jobs,
  emptyMessage,
  showRejectionReason,
}: {
  jobs: any[];
  emptyMessage: string;
  showRejectionReason?: boolean;
}) {
  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          showRejectionReason={showRejectionReason}
        />
      ))}
    </div>
  );
}

function JobCard({
  job,
  showRejectionReason,
}: {
  job: any;
  showRejectionReason?: boolean;
}) {
  const canEdit = job.approvalStatus === "DRAFT" || job.approvalStatus === "REJECTED";
  const canSubmit = job.approvalStatus === "DRAFT" || job.approvalStatus === "REJECTED";
  const isViewing = job.approvalStatus === "PENDING_APPROVAL" || job.approvalStatus === "APPROVED";

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-xl">{job.title}</CardTitle>
              <ApprovalStatusBadge approvalStatus={job.approvalStatus} />
            </div>
            <CardDescription>
              {job.city} • {getCategoryLabel(job.category)} •{" "}
              {formatDistanceToNow(new Date(job.createdAt), {
                addSuffix: true,
                locale: tr,
              })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

        {showRejectionReason && job.rejectionReason && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm font-semibold text-red-800 mb-1">
              Red Sebebi:
            </p>
            <p className="text-sm text-red-700">{job.rejectionReason}</p>
          </div>
        )}

        <div className="flex gap-2">
          {canEdit && (
            <Button variant="outline" asChild className="flex-1">
              <Link href={`/dashboard/taseron/ilanlar/${job.id}/duzenle`}>
                Düzenle
              </Link>
            </Button>
          )}
          {canSubmit && job.approvalStatus === "DRAFT" && (
            <Button asChild className="flex-1 bg-[#F37021] hover:bg-[#D85F17]">
              <Link href={`/dashboard/taseron/ilanlar/${job.id}/onaya-gonder`}>
                Onaya Gönder
              </Link>
            </Button>
          )}
          {canSubmit && job.approvalStatus === "REJECTED" && (
            <Button asChild className="flex-1 bg-[#F37021] hover:bg-[#D85F17]">
              <Link href={`/dashboard/taseron/ilanlar/${job.id}/onaya-gonder`}>
                Tekrar Gönder
              </Link>
            </Button>
          )}
          {isViewing && (
            <Button variant="outline" asChild className="flex-1">
              <Link href={`/ilan/${job.id}`}>Görüntüle</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
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
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
