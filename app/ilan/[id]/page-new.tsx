import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
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
  DollarSign,
} from "lucide-react";
import { formatDate, getCategoryLabel, formatCurrency } from "@/lib/utils";
import { BidForm } from "@/components/bids/BidForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { job } = await getApprovedJobById(id);

  if (!job) {
    return {
      title: "İlan Bulunamadı",
    };
  }

  return {
    title: `${job.title} - ${job.city} | Taşeroncum`,
    description: job.description.slice(0, 160),
    openGraph: {
      title: job.title,
      description: job.description.slice(0, 160),
    },
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { job, error } = await getApprovedJobById(id);
  
  if (error || !job) {
    notFound();
  }

  // Increment view count
  await incrementJobView(id);

  const user = await getSessionUser();
  
  // Firma ise kendi teklifini kontrol et
  let myBid = null;
  if (user?.role === "FIRMA") {
    const { bid } = await getMyBidForJob(id);
    myBid = bid;
  }

  const isJobOwner = user?.id === job.createdById;
  const canBid = user?.role === "FIRMA" && !isJobOwner && !myBid;
  const isTaseron = user?.role === "TASERON";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        {job.title}
                      </h1>
                      <div className="flex flex-wrap gap-2">
                        <Badge 
                          variant="secondary" 
                          className="bg-orange-100 text-orange-700 hover:bg-orange-200"
                        >
                          {getCategoryLabel(job.category)}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="hover:border-orange-500 hover:text-orange-600"
                      title="Paylaş"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-orange-600" />
                      <div>
                        <div className="text-xs text-gray-500">Lokasyon</div>
                        <div className="font-medium text-gray-900">{job.city}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-orange-600" />
                      <div>
                        <div className="text-xs text-gray-500">Yayın Tarihi</div>
                        <div className="font-medium text-gray-900">
                          {formatDate(job.publishedAt || job.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      <div>
                        <div className="text-xs text-gray-500">Teklif</div>
                        <div className="font-medium text-gray-900">
                          {job._count.bids} teklif
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-orange-600" />
                      <div>
                        <div className="text-xs text-gray-500">Görüntüleme</div>
                        <div className="font-medium text-gray-900">
                          {job.viewsCount} kez
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>İlan Detayları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Açıklama</h3>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {job.budgetMin && job.budgetMax && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-500">Bütçe</div>
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(job.budgetMin)} - {formatCurrency(job.budgetMax)}
                        </div>
                      </div>
                    </div>
                  )}

                  {job.durationText && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-500">Tahmini Süre</div>
                        <div className="font-semibold text-gray-900">{job.durationText}</div>
                      </div>
                    </div>
                  )}
                </div>

                {(job.contactPhone || job.contactEmail) && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">İletişim Bilgileri</h3>
                      <div className="space-y-2">
                        {job.contactPhone && (
                          <a 
                            href={`tel:${job.contactPhone}`}
                            className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
                          >
                            <Phone className="h-4 w-4" />
                            <span>{job.contactPhone}</span>
                          </a>
                        )}
                        {job.contactEmail && (
                          <a 
                            href={`mailto:${job.contactEmail}`}
                            className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
                          >
                            <Mail className="h-4 w-4" />
                            <span>{job.contactEmail}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Owner Info - Taşeron bilgileri */}
            {job.createdBy?.contractorProfile && (
              <Card>
                <CardHeader>
                  <CardTitle>İlan Sahibi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/taseron/${job.createdBy.id}`}
                        className="font-semibold text-lg text-gray-900 hover:text-orange-600"
                      >
                        {job.createdBy.contractorProfile.displayName}
                      </Link>
                      <div className="text-sm text-gray-600 mt-1">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {job.createdBy.contractorProfile.city}
                      </div>
                      {job.createdBy.contractorProfile.experienceYears && (
                        <div className="text-sm text-gray-600 mt-1">
                          {job.createdBy.contractorProfile.experienceYears} yıl deneyim
                        </div>
                      )}
                    </div>
                    <Button variant="outline" asChild>
                      <Link href={`/taseron/${job.createdBy.id}`}>
                        Profili Gör
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Teklif Verme */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              {/* Kullanıcı giriş yapmamışsa */}
              {!user && (
                <Card className="border-orange-200">
                  <CardHeader>
                    <CardTitle>Teklif Vermek İçin</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Bu ilana teklif vermek için giriş yapmanız gerekiyor.
                    </p>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700" asChild>
                      <Link href="/login">Giriş Yap</Link>
                    </Button>
                    <p className="text-xs text-center text-gray-500">
                      Hesabınız yok mu?{" "}
                      <Link href="/register" className="text-orange-600 hover:underline">
                        Kayıt Olun
                      </Link>
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Taşeron uyarısı */}
              {isTaseron && (
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle>Bilgilendirme</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Taşeron hesabı ile ilanlara teklif veremezsiniz. Sadece firma hesapları teklif verebilir.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Kendi ilanı uyarısı */}
              {isJobOwner && (
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle>Kendi İlanınız</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Bu ilanı siz oluşturdunuz. Gelen teklifleri dashboard'tan görüntüleyebilirsiniz.
                    </p>
                    <Button className="w-full" variant="outline" asChild>
                      <Link href="/dashboard/taseron/teklifler">
                        Teklifleri Gör
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Firma - zaten teklif vermişse */}
              {myBid && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle>Teklifiniz</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600">Teklif Tutarı</div>
                      <div className="text-xl font-bold text-gray-900">
                        {myBid.proposedPrice ? formatCurrency(myBid.proposedPrice) : "Belirtilmedi"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Tahmini Süre</div>
                      <div className="font-medium text-gray-900">{myBid.estimatedDuration}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Durum</div>
                      <Badge 
                        variant={
                          myBid.status === "ACCEPTED" 
                            ? "default" 
                            : myBid.status === "REJECTED" 
                            ? "destructive" 
                            : "secondary"
                        }
                      >
                        {myBid.status === "PENDING" && "Beklemede"}
                        {myBid.status === "ACCEPTED" && "Kabul Edildi"}
                        {myBid.status === "REJECTED" && "Reddedildi"}
                      </Badge>
                    </div>
                    <Separator />
                    <Button className="w-full" variant="outline" asChild>
                      <Link href="/dashboard/firma">
                        Tekliflerim
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Firma - teklif formu */}
              {canBid && (
                <Card className="border-orange-200">
                  <CardHeader>
                    <CardTitle>Teklif Verin</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BidForm jobId={id} />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
