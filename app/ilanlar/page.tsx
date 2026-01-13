import Link from "next/link";
import { listApprovedJobs } from "@/actions/jobs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Briefcase, Users } from "lucide-react";
import { formatDate, getCategoryLabel } from "@/lib/utils";
import { JobFilters } from "@/components/jobs/job-filters";

interface PageProps {
  searchParams: Promise<{
    city?: string;
    category?: string;
    search?: string;
  }>;
}

export default async function JobsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { jobs, error } = await listApprovedJobs({
    city: params.city,
    category: params.category,
    search: params.search,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Açık İlanlar</h1>
          <p className="text-muted">
            {jobs?.length || 0} ilan bulundu
          </p>
        </div>
      </div>

      {/* Filters */}
      <JobFilters />

      {/* Job List */}
      {error ? (
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
        </div>
      ) : jobs && jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Link key={job.id} href={`/ilan/${job.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">
                      {job.title}
                    </CardTitle>
                    <Badge variant="default">
                      {getCategoryLabel(job.category)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted text-sm line-clamp-3">
                    {job.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted">
                      <MapPin className="h-4 w-4" />
                      <span>{job.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted">
                      <Briefcase className="h-4 w-4" />
                      <span>{job.company.companyName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(job.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted">
                      <Users className="h-4 w-4" />
                      <span>{job._count.bids} teklif</span>
                    </div>
                  </div>

                  {(job.budgetMin || job.budgetMax) && (
                    <div className="pt-2 border-t">
                      <span className="text-sm font-medium">Bütçe: </span>
                      <span className="text-primary font-semibold">
                        {job.budgetMin && job.budgetMax
                          ? `${job.budgetMin.toLocaleString("tr-TR")} - ${job.budgetMax.toLocaleString("tr-TR")} ₺`
                          : job.budgetMin
                          ? `${job.budgetMin.toLocaleString("tr-TR")} ₺+`
                          : `${job.budgetMax?.toLocaleString("tr-TR")} ₺'ye kadar`}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Henüz ilan yok</h3>
          <p className="text-muted mb-4">
            Aradığınız kriterlere uygun ilan bulunamadı.
          </p>
          <Link href="/register?role=FIRMA">
            <Button>İlk İlanı Siz Açın</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
