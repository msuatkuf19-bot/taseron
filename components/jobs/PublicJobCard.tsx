import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Briefcase, Eye, TrendingUp } from "lucide-react";
import { formatDate, getCategoryLabel } from "@/lib/utils";

interface PublicJobCardProps {
  job: {
    id: string;
    title: string;
    description: string;
    category: string;
    city: string;
    budgetMin: number | null;
    budgetMax: number | null;
    durationText: string | null;
    viewsCount: number;
    createdAt: Date;
    company: {
      companyName: string;
      city: string;
    };
    _count: {
      bids: number;
    };
  };
}

export function PublicJobCard({ job }: PublicJobCardProps) {
  return (
    <Link href={`/ilan/${job.id}`} className="group">
      <Card className="h-full hover:shadow-xl hover:border-primary-orange transition-all duration-300 cursor-pointer bg-white">
        <CardHeader>
          <div className="flex items-start justify-between gap-3 mb-2">
            <CardTitle className="text-lg font-semibold line-clamp-2 text-text-primary group-hover:text-primary-orange transition-colors">
              {job.title}
            </CardTitle>
            <Badge 
              variant="secondary" 
              className="shrink-0 bg-primary-orange/10 text-primary-orange hover:bg-primary-orange/20"
            >
              {getCategoryLabel(job.category)}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-text-secondary text-sm line-clamp-3 leading-relaxed">
            {job.description}
          </p>

          <div className="space-y-2.5 text-sm">
            <div className="flex items-center gap-2 text-text-secondary">
              <MapPin className="h-4 w-4 text-primary-orange" />
              <span>{job.city}</span>
            </div>
            
            <div className="flex items-center gap-2 text-text-secondary">
              <Briefcase className="h-4 w-4 text-primary-orange" />
              <span className="truncate">{job.company.companyName}</span>
            </div>
            
            <div className="flex items-center gap-2 text-text-secondary">
              <Calendar className="h-4 w-4 text-primary-orange" />
              <span>{formatDate(job.createdAt)}</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-text-secondary">
                <TrendingUp className="h-4 w-4 text-primary-orange" />
                <span className="font-medium text-primary-orange">{job._count.bids} teklif</span>
              </div>
              
              {job.viewsCount > 0 && (
                <div className="flex items-center gap-1.5 text-text-secondary text-xs">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{job.viewsCount}</span>
                </div>
              )}
            </div>
          </div>

          {(job.budgetMin || job.budgetMax) && (
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-text-secondary">Bütçe:</span>
                <span className="text-base font-bold text-primary-orange">
                  {job.budgetMin && job.budgetMax
                    ? `${job.budgetMin.toLocaleString("tr-TR")} - ${job.budgetMax.toLocaleString("tr-TR")} ₺`
                    : job.budgetMin
                    ? `${job.budgetMin.toLocaleString("tr-TR")} ₺+`
                    : `${job.budgetMax?.toLocaleString("tr-TR")} ₺'ye kadar`}
                </span>
              </div>
            </div>
          )}

          {job.durationText && (
            <div className="flex items-center gap-2 text-xs text-text-secondary pt-1">
              <span className="font-medium">Süre:</span>
              <span>{job.durationText}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
