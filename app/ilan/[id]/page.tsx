import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getJobById } from "@/actions/jobs";
import { checkExistingBid } from "@/actions/bids";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Calendar,
  Briefcase,
  Clock,
  Phone,
  Mail,
  Building2,
} from "lucide-react";
import { formatDate, getCategoryLabel, formatCurrency } from "@/lib/utils";
import { BidForm } from "@/components/jobs/bid-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { job, error } = await getJobById(id);
  const session = await getServerSession(authOptions);

  if (error || !job) {
    notFound();
  }

  const isTaseron = session?.user?.role === "TASERON";
  const existingBidData = isTaseron ? await checkExistingBid(id) : { hasBid: false };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">
                      {getCategoryLabel(job.category)}
                    </Badge>
                    <Badge variant={job.status === "OPEN" ? "success" : "secondary"}>
                      {job.status === "OPEN" ? "Açık" : "Kapalı"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted">
                  <MapPin className="h-4 w-4" />
                  <span>{job.city}</span>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(job.createdAt)}</span>
                </div>
                {job.durationText && (
                  <div className="flex items-center gap-2 text-muted">
                    <Clock className="h-4 w-4" />
                    <span>{job.durationText}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted">
                  <Briefcase className="h-4 w-4" />
                  <span>{job._count.bids} teklif</span>
                </div>
              </div>

              {(job.budgetMin || job.budgetMax) && (
                <div className="p-4 bg-background rounded-lg">
                  <span className="text-sm text-muted">Bütçe Aralığı: </span>
                  <span className="text-lg font-semibold text-primary">
                    {job.budgetMin && job.budgetMax
                      ? `${formatCurrency(job.budgetMin)} - ${formatCurrency(job.budgetMax)}`
                      : job.budgetMin
                      ? `${formatCurrency(job.budgetMin)}+`
                      : `${formatCurrency(job.budgetMax!)} kadar`}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>İlan Detayı</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{job.description}</p>
            </CardContent>
          </Card>

          {/* Bid Form for Taşeron */}
          {isTaseron && job.status === "OPEN" && (
            <Card>
              <CardHeader>
                <CardTitle>Teklif Ver</CardTitle>
              </CardHeader>
              <CardContent>
                {existingBidData.hasBid ? (
                  <div className="text-center py-4">
                    <p className="text-muted mb-2">
                      Bu ilana zaten teklif vermişsiniz.
                    </p>
                    <Badge
                      variant={
                        existingBidData.bid?.status === "ACCEPTED"
                          ? "success"
                          : existingBidData.bid?.status === "REJECTED"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {existingBidData.bid?.status === "ACCEPTED"
                        ? "Kabul Edildi"
                        : existingBidData.bid?.status === "REJECTED"
                        ? "Reddedildi"
                        : "Beklemede"}
                    </Badge>
                  </div>
                ) : (
                  <BidForm jobId={id} />
                )}
              </CardContent>
            </Card>
          )}

          {job.status === "CLOSED" && (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted">Bu ilan kapatılmış. Teklif verilemez.</p>
              </CardContent>
            </Card>
          )}

          {!session && job.status === "OPEN" && (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted mb-4">
                  Teklif vermek için taşeron olarak giriş yapmalısınız.
                </p>
                <Link href="/login" className="text-primary hover:underline">
                  Giriş Yap
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Firma Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link
                href={`/firma/${job.company.id}`}
                className="text-lg font-semibold text-primary hover:underline"
              >
                {job.company.companyName}
              </Link>
              <div className="flex items-center gap-2 text-muted text-sm">
                <MapPin className="h-4 w-4" />
                <span>{job.company.city}</span>
              </div>
              {job.company.about && (
                <p className="text-sm text-muted line-clamp-3">
                  {job.company.about}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          {(job.contactPhone || job.contactEmail) && (
            <Card>
              <CardHeader>
                <CardTitle>İletişim</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {job.contactPhone && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted">Telefon</p>
                      <a
                        href={`tel:${job.contactPhone}`}
                        className="font-medium hover:text-primary"
                      >
                        {job.contactPhone}
                      </a>
                    </div>
                  </div>
                )}
                {job.contactEmail && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted">E-posta</p>
                      <a
                        href={`mailto:${job.contactEmail}`}
                        className="font-medium hover:text-primary"
                      >
                        {job.contactEmail}
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
