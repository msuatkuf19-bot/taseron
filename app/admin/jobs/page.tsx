import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { getAdminJobs } from "@/actions/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { formatDate, getCategoryLabel } from "@/lib/utils";
import { AdminJobActions } from "@/components/admin/admin-job-actions";

export default async function AdminJobsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const { jobs, error } = await getAdminJobs();

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-muted hover:text-primary mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Admin Panel
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">İlan Yönetimi</h1>
        <p className="text-muted">{jobs?.length || 0} ilan bulundu</p>
      </div>

      {error ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-4 font-medium">Başlık</th>
                    <th className="text-left p-4 font-medium">Firma</th>
                    <th className="text-left p-4 font-medium">Kategori</th>
                    <th className="text-left p-4 font-medium">Şehir</th>
                    <th className="text-left p-4 font-medium">Durum</th>
                    <th className="text-left p-4 font-medium">Teklifler</th>
                    <th className="text-left p-4 font-medium">Tarih</th>
                    <th className="text-left p-4 font-medium">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs?.map((job) => (
                    <tr
                      key={job.id}
                      className={`border-b last:border-0 ${
                        job.isDeleted ? "opacity-50" : ""
                      }`}
                    >
                      <td className="p-4">
                        <Link
                          href={`/ilan/${job.id}`}
                          className="hover:text-primary"
                        >
                          {job.title}
                        </Link>
                        {job.isDeleted && (
                          <Badge variant="destructive" className="ml-2">
                            Silindi
                          </Badge>
                        )}
                      </td>
                      <td className="p-4">{job.company.companyName}</td>
                      <td className="p-4">
                        <Badge variant="outline">
                          {getCategoryLabel(job.category)}
                        </Badge>
                      </td>
                      <td className="p-4">{job.city}</td>
                      <td className="p-4">
                        <Badge
                          variant={job.status === "OPEN" ? "success" : "secondary"}
                        >
                          {job.status === "OPEN" ? "Açık" : "Kapalı"}
                        </Badge>
                      </td>
                      <td className="p-4">{job._count.bids}</td>
                      <td className="p-4 text-muted text-sm">
                        {formatDate(job.createdAt)}
                      </td>
                      <td className="p-4">
                        {!job.isDeleted && (
                          <AdminJobActions
                            jobId={job.id}
                            currentStatus={job.status}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
