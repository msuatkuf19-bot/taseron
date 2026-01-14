import { getPublicJobs } from "@/actions/jobs";
import { JobFilters } from "@/components/jobs/JobFilters";
import { JobsGrid } from "@/components/jobs/JobsGrid";

interface PageProps {
  searchParams: Promise<{
    city?: string;
    category?: string;
    search?: string;
    sortBy?: string;
    page?: string;
    pageSize?: string;
  }>;
}

export default async function JobsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  const { jobs, pagination, error } = await getPublicJobs({
    city: params.city,
    category: params.category,
    search: params.search,
    sortBy: (params.sortBy as any) || "newest",
    page: parseInt(params.page || "1"),
    pageSize: parseInt(params.pageSize || "12"),
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-3">
            Açık İş İlanları
          </h1>
          <p className="text-lg text-text-secondary">
            Onaylanmış ve yayında olan iş ilanlarını keşfedin
          </p>
        </div>

        <JobFilters />

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <JobsGrid jobs={jobs || []} pagination={pagination} />
      </div>
    </div>
  );
}
