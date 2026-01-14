"use client";

import { PublicJobCard } from "./PublicJobCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Briefcase } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface JobsGridProps {
  jobs: any[];
  pagination?: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  } | null;
  loading?: boolean;
}

export function JobsGrid({ jobs, pagination, loading }: JobsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4 p-6 border rounded-lg">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-primary-orange/10 flex items-center justify-center">
            <Briefcase className="h-8 w-8 text-primary-orange" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          Henüz Yayınlanmış İlan Yok
        </h3>
        <p className="text-text-secondary mb-6">
          Aradığınız kriterlere uygun ilan bulunamadı.
        </p>
        <Link href="/login">
          <Button className="bg-primary-orange hover:bg-primary-orange-dark">
            Taşeron Paneline Git
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <PublicJobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => {
              const params = new URLSearchParams(window.location.search);
              params.set("page", String(pagination.page - 1));
              window.location.href = `?${params.toString()}`;
            }}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Önceki
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((page) => {
                return (
                  page === 1 ||
                  page === pagination.totalPages ||
                  Math.abs(page - pagination.page) <= 1
                );
              })
              .map((page, index, array) => {
                const showEllipsis = index > 0 && page - array[index - 1] > 1;
                return (
                  <div key={page} className="flex items-center gap-1">
                    {showEllipsis && (
                      <span className="px-2 text-text-secondary">...</span>
                    )}
                    <Button
                      variant={page === pagination.page ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const params = new URLSearchParams(window.location.search);
                        params.set("page", String(page));
                        window.location.href = `?${params.toString()}`;
                      }}
                      className={page === pagination.page ? "bg-primary-orange hover:bg-primary-orange-dark" : ""}
                    >
                      {page}
                    </Button>
                  </div>
                );
              })}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => {
              const params = new URLSearchParams(window.location.search);
              params.set("page", String(pagination.page + 1));
              window.location.href = `?${params.toString()}`;
            }}
            className="gap-1"
          >
            Sonraki
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Results Info */}
      {pagination && (
        <p className="text-center text-sm text-text-secondary">
          Toplam <span className="font-semibold text-primary-orange">{pagination.totalCount}</span> ilan bulundu
          {pagination.totalPages > 1 && (
            <> (Sayfa {pagination.page} / {pagination.totalPages})</>
          )}
        </p>
      )}
    </div>
  );
}
