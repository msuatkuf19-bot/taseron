import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { getMyBids } from "@/actions/bids";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, MapPin, Calendar, ArrowRight, FileText } from "lucide-react";
import { formatDate, getCategoryLabel, getStatusLabel, formatCurrency } from "@/lib/utils";

export default async function TaseronTekliflerPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "TASERON") {
    redirect("/login");
  }

  const { bids, error } = await getMyBids();

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/dashboard/taseron"
        className="inline-flex items-center gap-2 text-muted hover:text-primary mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Dashboard&apos;a Dön
      </Link>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tekliflerim</h1>
          <p className="text-muted">Verdiğiniz tüm tekliflerin listesi</p>
        </div>
        <Link href="/ilanlar">
          <Button>
            <Briefcase className="h-4 w-4 mr-2" />
            Yeni İlan Bul
          </Button>
        </Link>
      </div>

      {error ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : bids && bids.length > 0 ? (
        <div className="space-y-4">
          {bids.map((bid) => (
            <Card key={bid.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Link
                        href={`/ilan/${bid.job.id}`}
                        className="text-lg font-semibold hover:text-primary"
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
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-3">
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
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(bid.createdAt)}
                      </div>
                    </div>

                    <div className="p-3 bg-background rounded-lg">
                      <p className="text-sm">{bid.message}</p>
                    </div>
                  </div>

                  <div className="text-right min-w-[120px]">
                    {bid.proposedPrice && (
                      <p className="text-xl font-bold text-primary">
                        {formatCurrency(bid.proposedPrice)}
                      </p>
                    )}
                    {bid.estimatedDuration && (
                      <p className="text-sm text-muted">{bid.estimatedDuration}</p>
                    )}
                    <Link href={`/ilan/${bid.job.id}`}>
                      <Button variant="outline" size="sm" className="mt-2">
                        İlanı Görüntüle
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Henüz teklif vermediniz</h3>
            <p className="text-muted mb-4">
              Açık ilanları inceleyerek teklif vermeye başlayın.
            </p>
            <Link href="/ilanlar">
              <Button>
                İlanları İncele
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
