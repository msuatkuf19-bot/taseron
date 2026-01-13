"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toggleJobStatus } from "@/actions/jobs";

interface JobStatusToggleProps {
  jobId: string;
  currentStatus: string;
}

export function JobStatusToggle({ jobId, currentStatus }: JobStatusToggleProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await toggleJobStatus(jobId);
      router.refresh();
    } catch (error) {
      console.error("Toggle job status error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={currentStatus === "OPEN" ? "outline" : "default"}
      onClick={handleToggle}
      disabled={loading}
    >
      {loading
        ? "Değiştiriliyor..."
        : currentStatus === "OPEN"
        ? "İlanı Kapat"
        : "İlanı Aç"}
    </Button>
  );
}
