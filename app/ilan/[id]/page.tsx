import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getApprovedJobById, incrementJobView } from "@/actions/jobs";
import { getMyBidForJob } from "@/actions/bids";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  Building2,
  Eye,
  Share2,
  TrendingUp,
} from "lucide-react";
import { formatDate, getCategoryLabel, formatCurrency } from "@/lib/utils";
import { BidForm } from "@/components/jobs/bid-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { job, error } = await getApprovedJobById(id);
  const session = await getServerSession(authOptions);

  if (error || !job) {
    notFound();
  }

  // Increment view count (fire and forget)
  incrementJobView(id);

  const isFirma = session?.user?.role === "FIRMA";
  const existingBid = isFirma
    ? await getMyBidForJob(id)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card className="bg-white">
              <CardHeader>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-3xl font-bold text-text-primary mb-3">
                        {job.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge 
                          variant="secondary" 
                          className="bg-primary-orange/10 text-primary-orange hover:bg-primary-orange/20"
                        >
                          {getCategoryLabel(job.category)}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="hover:border-primary-orange hover:text-primary-orange"
                      title="Paylaş"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-4 border-t">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <MapPin className="h-5 w-5 text-primary-orange" />
                      <div>
                        <div className="text-xs text-text-secondary">Lokasyon</div>
                        <div className="font-medium text-text-primary">{job.city}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Calendar className="h-5 w-5 text-primary-orange" />
                      <div>
                        <div className="text-xs text-text-secondary">Yayın Tarihi</div>
                        <div className="font-medium text-text-primary">{formatDate(job.createdAt)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-text-secondary">
                      <TrendingUp className="h-5 w-5 text-primary-orange" />
                      <div>
                        <div className="text-xs text-text-secondary">Teklif Sayısı</div>
                        <div className="font-medium text-primary-orange">{job._count.bids} teklif</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-text-secondary">
                      <Eye className="h-5 w-5 text-primary-orange" />
                      <div>
                        <div className="text-xs text-text-secondary">Görüntüleme</div>
                        <div className="font-medium text-text-primary">{job.viewsCount}</div>
                      </div>
                    </div>
                  </div>

                  {(job.budgetMin || job.budgetMax) && (
                    <div className="p-4 bg-primary-orange/5 rounded-lg border-l-4 border-primary-orange">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-text-secondary font-medium">Bütçe Aralığı:</span>
                        <span className="text-2xl font-bold text-primary-orange">
                          {job.budgetMin && job.budgetMax
                            ? `${formatCurrency(job.budgetMin)} - ${formatCurrency(job.budgetMax)}`
                            : job.budgetMin
                            ? `${formatCurrency(job.budgetMin)}+`
                            : `${formatCurrency(job.budgetMax!)} kadar`}
                        </span>
                      </div>
                    </div>
                  )}

                  {job.durationText && (
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Clock className="h-5 w-5 text-primary-orange" />
                      <span className="font-medium">Süre:</span>
                      <span>{job.durationText}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Description */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl text-text-primary">İş Detayları</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-text-secondary leading-relaxed">
                  {job.description}
                </p>
              </CardContent>
            </Card>

            {/* Bid Form for Firma */}
            {isFirma && (
              <Card className="bg-white border-2 border-primary-orange/20">
                <CardHeader className="bg-primary-orange/5">
                  <CardTitle className="text-xl text-text-primary">Teklif Ver</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {existingBid?.bid ? (
                    <div className="text-center py-6">
                      <p className="text-text-secondary mb-3">
                        Bu ilana zaten teklif vermişsiniz.
                      </p>
                      <Badge
                        variant={
                          existingBid.bid.status === "ACCEPTED"
                            ? "default"
                            : existingBid.bid.status === "REJECTED"
                            ? "destructive"
                            : "secondary"
                        }
                        className={
                          existingBid.bid.status === "ACCEPTED"
                            ? "bg-success-green"
                            : ""
                        }
                      >
                        {existingBid.bid.status === "ACCEPTED"
                          ? "✓ Kabul Edildi"
                          : existingBid.bid.status === "REJECTED"
                          ? "✗ Reddedildi"
                          : "⏳ Beklemede"}
                      </Badge>
                    </div>
                  ) : (
                    <BidForm jobId={id} />
                  )}
                </CardContent>
              </Card>
            )}

            {!session && (
              <Card className="bg-white">
                <CardContent className="py-8 text-center">
                  <p className="text-text-secondary mb-4 text-lg">
                    Teklif vermek için firma olarak giriş yapmalısınız.
                  </p>
                  <Link href="/login">
                    <Button className="bg-primary-orange hover:bg-primary-orange-dark">
                      Giriş Yap
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <Card className="bg-white sticky top-4">
              <CardHeader className="bg-gradient-to-br from-primary-orange/10 to-primary-orange/5">
                <CardTitle className="flex items-center gap-2 text-text-primary">
                  <Building2 className="h-5 w-5 text-primary-orange" />
                  Firma Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <Link
                  href={`/firma/${job.company.id}`}
                  className="text-xl font-bold text-primary-orange hover:text-primary-orange-dark transition-colors block"
                >
                  {job.company.companyName}
                </Link>
                
                <div className="flex items-center gap-2 text-text-secondary">
                  <MapPin className="h-4 w-4 text-primary-orange" />
                  <span>{job.company.city}</span>
                </div>
                
                {job.company.about && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {job.company.about}
                      </p>
                    </div>
                  </>
                )}

                <Separator />

                <Link href={`/firma/${job.company.id}`}>
                  <Button 
                    variant="outline" 
                    className="w-full border-primary-orange text-primary-orange hover:bg-primary-orange hover:text-white"
                  >
                    Firma Profilini Görüntüle
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Contact Info */}
            {(job.contactPhone || job.contactEmail) && (
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-text-primary">İletişim Bilgileri</CardTitle>
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
    </div>
  );
}
