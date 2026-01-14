import { HeroSection } from "@/components/landing/hero-section";
import { listApprovedJobs } from "@/actions/jobs";
import { JobsGrid } from "@/components/jobs/JobsGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  // Fetch first 6 jobs for homepage preview
  const { jobs, pagination } = await listApprovedJobs({ page: 1, pageSize: 6 });

  // Map pagination format
  const gridPagination = {
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalCount: pagination.total,
    totalPages: pagination.totalPages,
  };

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Featured Jobs Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-text-primary mb-2">
              Yayınlanan İlanlar
            </h2>
            <p className="text-text-secondary">
              Güncel ve onaylanmış iş ilanlarını inceleyin
            </p>
          </div>
          <Link href="/ilanlar">
            <Button 
              variant="outline" 
              className="gap-2 border-primary-orange text-primary-orange hover:bg-primary-orange hover:text-white"
            >
              Tüm İlanlar
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <JobsGrid jobs={jobs || []} pagination={gridPagination} />

        {jobs && jobs.length > 0 && (
          <div className="text-center mt-8">
            <Link href="/ilanlar">
              <Button 
                size="lg" 
                className="bg-primary-orange hover:bg-primary-orange-dark gap-2"
              >
                Tüm İlanları Görüntüle
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}


