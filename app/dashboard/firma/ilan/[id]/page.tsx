import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Calendar,
  Clock,
  ArrowLeft,
  Phone,
  Star,
} from "lucide-react";
import { formatDate, getCategoryLabel, formatCurrency } from "@/lib/utils";
import { JobStatusToggle } from "@/components/dashboard/job-status-toggle";
import { BidCard } from "@/components/dashboard/bid-card";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FirmaJobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "FIRMA") {
    redirect("/login");
  }

  const job = await prisma.jobPost.findFirst({
    where: {
      id,
      companyId: session.user.companyProfileId,
      isDeleted: false,
    },
    include: {
      bids: {
        include: {
          offerer: {
            include: {
              companyProfile: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!job) {
    notFound();
  }

  const pendingBids = job.bids.filter((b) => b.status === "PENDING");
  const acceptedBids = job.bids.filter((b) => b.status === "ACCEPTED");
  const rejectedBids = job.bids.filter((b) => b.status === "REJECTED");

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/dashboard/firma"
        className="inline-flex items-center gap-2 text-muted hover:text-primary mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Dashboard&apos;a Dön
      </Link>

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
                <JobStatusToggle jobId={job.id} currentStatus={job.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
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
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Açıklama</h3>
                <p className="text-muted whitespace-pre-wrap">{job.description}</p>
              </div>

              {(job.budgetMin || job.budgetMax) && (
                <>
                  <Separator />
                  <div>
                    <span className="text-muted">Bütçe: </span>
                    <span className="font-semibold text-primary">
                      {job.budgetMin && job.budgetMax
                        ? `${formatCurrency(job.budgetMin)} - ${formatCurrency(job.budgetMax)}`
                        : job.budgetMin
                        ? `${formatCurrency(job.budgetMin)}+`
                        : `${formatCurrency(job.budgetMax!)} kadar`}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Bids */}
          <Card>
            <CardHeader>
              <CardTitle>Gelen Teklifler ({job.bids.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending">
                <TabsList className="mb-4">
                  <TabsTrigger value="pending">
                    Bekleyen ({pendingBids.length})
                  </TabsTrigger>
                  <TabsTrigger value="accepted">
                    Kabul ({acceptedBids.length})
                  </TabsTrigger>
                  <TabsTrigger value="rejected">
                    Red ({rejectedBids.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pending">
                  {pendingBids.length > 0 ? (
                    <div className="space-y-4">
                      {pendingBids.map((bid) => (
                        <BidCard key={bid.id} bid={bid} jobId={job.id} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted text-center py-4">
                      Bekleyen teklif yok.
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="accepted">
                  {acceptedBids.length > 0 ? (
                    <div className="space-y-4">
                      {acceptedBids.map((bid) => (
                        <BidCard key={bid.id} bid={bid} jobId={job.id} showReview />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted text-center py-4">
                      Kabul edilmiş teklif yok.
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="rejected">
                  {rejectedBids.length > 0 ? (
                    <div className="space-y-4">
                      {rejectedBids.map((bid) => (
                        <BidCard key={bid.id} bid={bid} jobId={job.id} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted text-center py-4">
                      Reddedilmiş teklif yok.
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>İlan İstatistikleri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted">Toplam Teklif</span>
                <span className="font-semibold">{job.bids.length}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted">Bekleyen</span>
                <Badge variant="secondary">{pendingBids.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Kabul Edilen</span>
                <Badge variant="success">{acceptedBids.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Reddedilen</span>
                <Badge variant="destructive">{rejectedBids.length}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          {(job.contactPhone || job.contactEmail) && (
            <Card>
              <CardHeader>
                <CardTitle>İletişim Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {job.contactPhone && (
                  <p>
                    <span className="text-muted">Telefon:</span> {job.contactPhone}
                  </p>
                )}
                {job.contactEmail && (
                  <p>
                    <span className="text-muted">E-posta:</span> {job.contactEmail}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
