import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { getMyBids } from "@/actions/bids";
import { getContractorProfile } from "@/actions/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  MapPin,
  Calendar,
  Star,
  FileText,
  ArrowRight,
} from "lucide-react";
import { formatDate, getCategoryLabel, getStatusLabel, formatCurrency } from "@/lib/utils";

export default async function TaseronDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "TASERON") {
    redirect("/login");
  }

  const [bidsResult, profileResult] = await Promise.all([
    getMyBids(),
    getContractorProfile(session.user.contractorProfileId!),
  ]);

  const { bids } = bidsResult;
  const { profile, avgRating, totalReviews } = profileResult;

  const pendingBids = bids?.filter((b) => b.status === "PENDING") || [];
  const acceptedBids = bids?.filter((b) => b.status === "ACCEPTED") || [];
  const rejectedBids = bids?.filter((b) => b.status === "REJECTED") || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Taşeron Dashboard</h1>
          <p className="text-muted">Tekliflerinizi takip edin ve yeni iş fırsatları bulun</p>
        </div>
        <Link href="/ilanlar">
          <Button>
            <Briefcase className="h-4 w-4 mr-2" />
            İlanları İncele
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">
              Toplam Teklif
            </CardTitle>
            <FileText className="h-4 w-4 text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bids?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">
              Bekleyen
            </CardTitle>
            <FileText className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingBids.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">
              Kabul Edilen
            </CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {acceptedBids.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">
              Ortalama Puan
            </CardTitle>
            <Star className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {totalReviews && totalReviews > 0 ? avgRating?.toFixed(1) : "-"}
            </div>
            <p className="text-xs text-muted">{totalReviews} değerlendirme</p>
          </CardContent>
        </Card>
      </div>

      {/* Bids Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Tekliflerim</CardTitle>
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
              <TabsTrigger value="all">Tümü ({bids?.length || 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <BidsList bids={pendingBids} emptyMessage="Bekleyen teklifiniz yok." />
            </TabsContent>

            <TabsContent value="accepted">
              <BidsList
                bids={acceptedBids}
                emptyMessage="Kabul edilmiş teklifiniz yok."
              />
            </TabsContent>

            <TabsContent value="rejected">
              <BidsList
                bids={rejectedBids}
                emptyMessage="Reddedilmiş teklifiniz yok."
              />
            </TabsContent>

            <TabsContent value="all">
              <BidsList bids={bids || []} emptyMessage="Henüz teklif vermediniz." />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function BidsList({
  bids,
  emptyMessage,
}: {
  bids: any[];
  emptyMessage: string;
}) {
  if (bids.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-muted mx-auto mb-4" />
        <p className="text-muted">{emptyMessage}</p>
        <Link href="/ilanlar" className="inline-block mt-4">
          <Button variant="outline">
            İlanları İncele
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bids.map((bid) => (
        <Card key={bid.id}>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Link
                    href={`/ilan/${bid.job.id}`}
                    className="font-semibold hover:text-primary"
                  >
                    {bid.job.title}
                  </Link>
                  <Badge
                    variant={
                      bid.status === "ACCEPTED"
                        ? "success"
                        : bid.status === "REJECTED"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {getStatusLabel(bid.status)}
                  </Badge>
                  <Badge variant={bid.job.status === "OPEN" ? "outline" : "secondary"}>
                    {bid.job.status === "OPEN" ? "İlan Açık" : "İlan Kapalı"}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <Link
                      href={`/firma/${bid.job.company.id}`}
                      className="hover:text-primary"
                    >
                      {bid.job.company.companyName}
                    </Link>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {bid.job.city}
                  </div>
                  <Badge variant="outline">
                    {getCategoryLabel(bid.job.category)}
                  </Badge>
                </div>
                <p className="text-sm text-muted mt-2 line-clamp-2">
                  {bid.message}
                </p>
              </div>
              <div className="text-right">
                {bid.proposedPrice && (
                  <p className="font-semibold text-primary">
                    {formatCurrency(bid.proposedPrice)}
                  </p>
                )}
                {bid.estimatedDuration && (
                  <p className="text-sm text-muted">{bid.estimatedDuration}</p>
                )}
                <p className="text-xs text-muted mt-1">
                  {formatDate(bid.createdAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
