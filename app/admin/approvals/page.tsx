import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminListPendingJobs } from "@/actions/admin";
import { ApprovalQueueTable } from "@/components/admin/ApprovalQueueTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, FileCheck } from "lucide-react";

export const metadata = {
  title: "İlan Onay Kuyruğu | Admin Panel",
  description: "Onay bekleyen ilanları inceleyin ve onaylayın",
};

export default async function AdminApprovalsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  const { jobs, error } = await adminListPendingJobs();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2 flex items-center gap-3">
            <FileCheck className="h-10 w-10 text-primary-orange" />
            İlan Onay Kuyruğu
          </h1>
          <p className="text-lg text-text-secondary">
            Taşeronlar tarafından oluşturulan ve onay bekleyen ilanları inceleyin
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">
                Onay Bekleyen
              </CardTitle>
              <Clock className="h-4 w-4 text-primary-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary-orange">
                {jobs?.length || 0}
              </div>
              <p className="text-xs text-text-secondary mt-1">
                İnceleme bekliyor
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">
                Bugün Eklenen
              </CardTitle>
              <FileCheck className="h-4 w-4 text-success-green" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-text-primary">
                {jobs?.filter(j => {
                  const today = new Date();
                  const createdDate = new Date(j.createdAt);
                  return createdDate.toDateString() === today.toDateString();
                }).length || 0}
              </div>
              <p className="text-xs text-text-secondary mt-1">
                Son 24 saat
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">
                En Eski İlan
              </CardTitle>
              <Clock className="h-4 w-4 text-warning-yellow" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-text-primary">
                {jobs && jobs.length > 0 
                  ? Math.floor((Date.now() - new Date(jobs[jobs.length - 1].createdAt).getTime()) / (1000 * 60 * 60 * 24))
                  : 0}
              </div>
              <p className="text-xs text-text-secondary mt-1">
                gün önce oluşturuldu
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Jobs Table */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-xl text-text-primary">
              Onay Bekleyen İlanlar
            </CardTitle>
            <CardDescription>
              Her ilanı dikkatlice inceleyin ve onay kriterlerine göre karar verin
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ApprovalQueueTable jobs={jobs || []} />
          </CardContent>
        </Card>

        {/* Help Section */}
        {jobs && jobs.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">💡 İpucu</h3>
            <p className="text-sm text-blue-800">
              İlanları onaylarken açıklama kalitesini, bütçe uygunluğunu ve kategori doğruluğunu kontrol edin.
              Reddederken mutlaka detaylı bir sebep belirtin ki taşeronlar düzeltme yapabilsin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
