import { notFound } from "next/navigation";
import Link from "next/link";
import { getCompanyProfile } from "@/actions/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Building2,
  Briefcase,
  Calendar,
  Star,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CompanyProfilePage({ params }: PageProps) {
  const { id } = await params;
  const { profile, openJobs, totalJobs, error } = await getCompanyProfile(id);

  if (error || !profile) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                  {profile.companyName.charAt(0)}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-1">
                    {profile.companyName}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-3 text-muted text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.city}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(profile.createdAt)} tarihinden beri üye
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            {profile.about && (
              <CardContent>
                <h3 className="font-semibold mb-2">Hakkında</h3>
                <p className="text-muted whitespace-pre-wrap">{profile.about}</p>
              </CardContent>
            )}
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Verilen Değerlendirmeler
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.reviews.length > 0 ? (
                <div className="space-y-4">
                  {profile.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <Link
                          href={`/taseron/${review.contractor.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {review.contractor.displayName}
                        </Link>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "text-primary fill-primary"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-muted text-sm">{review.comment}</p>
                      )}
                      <p className="text-xs text-muted mt-2">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-4">
                  Henüz değerlendirme yapılmamış.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>İstatistikler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted">Açık İlan</span>
                <Badge variant="default">{openJobs}</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted">Toplam İlan</span>
                <span className="font-semibold">{totalJobs}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted">Değerlendirme</span>
                <span className="font-semibold">{profile.reviews.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          {(profile.phone || profile.contactName) && (
            <Card>
              <CardHeader>
                <CardTitle>İletişim</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {profile.contactName && (
                  <p className="text-sm">
                    <span className="text-muted">Yetkili:</span>{" "}
                    {profile.contactName}
                  </p>
                )}
                {profile.phone && (
                  <p className="text-sm">
                    <span className="text-muted">Telefon:</span>{" "}
                    <a
                      href={`tel:${profile.phone}`}
                      className="text-primary hover:underline"
                    >
                      {profile.phone}
                    </a>
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
