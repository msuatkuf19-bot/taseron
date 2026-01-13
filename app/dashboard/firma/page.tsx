import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { getMyJobs } from "@/actions/jobs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Briefcase, MapPin, Calendar, Users } from "lucide-react";
import { formatDate, getCategoryLabel } from "@/lib/utils";
import { CreateJobDialog } from "@/components/dashboard/create-job-dialog";

export default async function FirmaDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "FIRMA") {
    redirect("/login");
  }

  const { jobs, error } = await getMyJobs();

  const openJobs = jobs?.filter((j) => j.status === "OPEN") || [];
  const closedJobs = jobs?.filter((j) => j.status === "CLOSED") || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Firma Dashboard</h1>
          <p className="text-muted">
            İlanlarınızı yönetin ve gelen teklifleri inceleyin
          </p>
        </div>
        <CreateJobDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">
              Toplam İlan
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">
              Açık İlanlar
            </CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{openJobs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">
              Toplam Teklif
            </CardTitle>
            <Users className="h-4 w-4 text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobs?.reduce((sum, j) => sum + j._count.bids, 0) || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Tabs */}
      <Tabs defaultValue="open" className="space-y-6">
        <TabsList>
          <TabsTrigger value="open">Açık İlanlar ({openJobs.length})</TabsTrigger>
          <TabsTrigger value="closed">
            Kapalı İlanlar ({closedJobs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open">
          {openJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {openJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </TabsContent>

        <TabsContent value="closed">
          {closedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {closedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted">Kapalı ilan bulunmuyor.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function JobCard({ job }: { job: any }) {
  return (
    <Link href={`/dashboard/firma/ilan/${job.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg line-clamp-2">{job.title}</CardTitle>
            <Badge variant={job.status === "OPEN" ? "success" : "secondary"}>
              {job.status === "OPEN" ? "Açık" : "Kapalı"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Badge variant="outline">{getCategoryLabel(job.category)}</Badge>
          <div className="space-y-2 text-sm text-muted">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{job.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(job.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="font-medium text-primary">
                {job._count.bids} teklif
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <Briefcase className="h-12 w-12 text-muted mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Henüz ilan yok</h3>
        <p className="text-muted mb-4">
          İlk ilanınızı oluşturarak taşeronlardan teklif almaya başlayın.
        </p>
        <CreateJobDialog />
      </CardContent>
    </Card>
  );
}
