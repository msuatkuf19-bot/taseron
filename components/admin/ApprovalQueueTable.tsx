"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate, getCategoryLabel } from "@/lib/utils";
import { Eye, CheckCircle2, XCircle } from "lucide-react";
import { ApprovalReviewDrawer } from "./ApprovalReviewDrawer";

interface Job {
  id: string;
  title: string;
  category: string;
  city: string;
  createdAt: Date;
  description: string;
  budgetMin: number | null;
  budgetMax: number | null;
  durationText: string | null;
  createdBy: {
    email: string;
    contractorProfile: {
      displayName: string;
      city: string;
      phone: string | null;
    } | null;
  };
}

interface ApprovalQueueTableProps {
  jobs: Job[];
}

export function ApprovalQueueTable({ jobs }: ApprovalQueueTableProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleReview = (job: Job) => {
    setSelectedJob(job);
    setDrawerOpen(true);
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <CheckCircle2 className="h-12 w-12 text-success-green mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Tebrikler! Onay Bekleyen İlan Yok
        </h3>
        <p className="text-text-secondary">
          Şu anda incelenmesi gereken ilan bulunmuyor.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">İlan Başlığı</TableHead>
              <TableHead className="font-semibold">Kategori</TableHead>
              <TableHead className="font-semibold">Şehir</TableHead>
              <TableHead className="font-semibold">Oluşturan</TableHead>
              <TableHead className="font-semibold">Tarih</TableHead>
              <TableHead className="font-semibold text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-text-primary max-w-xs">
                  <div className="truncate">{job.title}</div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className="bg-primary-orange/10 text-primary-orange"
                  >
                    {getCategoryLabel(job.category)}
                  </Badge>
                </TableCell>
                <TableCell className="text-text-secondary">{job.city}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium text-text-primary">
                      {job.createdBy.contractorProfile?.displayName || "Bilinmiyor"}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {job.createdBy.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-text-secondary text-sm">
                  {formatDate(job.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReview(job)}
                    className="gap-2 border-primary-orange text-primary-orange hover:bg-primary-orange hover:text-white"
                  >
                    <Eye className="h-4 w-4" />
                    İncele
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedJob && (
        <ApprovalReviewDrawer
          job={selectedJob}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
        />
      )}
    </>
  );
}
