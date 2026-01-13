import { ApprovalStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  approvalStatus: ApprovalStatus;
  className?: string;
}

export function ApprovalStatusBadge({
  approvalStatus,
  className,
}: StatusBadgeProps) {
  const statusConfig = {
    DRAFT: {
      label: "Taslak",
      variant: "secondary" as const,
    },
    PENDING_APPROVAL: {
      label: "Onay Bekliyor",
      variant: "default" as const,
    },
    APPROVED: {
      label: "Onaylandı",
      variant: "default" as const,
      className: "bg-green-500 hover:bg-green-600",
    },
    REJECTED: {
      label: "Reddedildi",
      variant: "destructive" as const,
    },
  };

  const config = statusConfig[approvalStatus];

  return (
    <Badge
      variant={config.variant}
      className={`${config.className || ""} ${className || ""}`}
    >
      {config.label}
    </Badge>
  );
}
