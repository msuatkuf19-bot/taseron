import { notFound } from "next/navigation";
import Link from "next/link";
import { getContractorProfile } from "@/actions/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  User,
  Briefcase,
  Calendar,
  Star,
  Clock,
  Wrench,
} from "lucide-react";
import { formatDate, getCategoryLabel } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ContractorProfilePage({ params }: PageProps) {
  const { id } = await params;
  const { profile, avgRating, totalReviews, totalBids, error } =
    await getContractorProfile(id);

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
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profile.displayName.charAt(0)}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-1">
                    {profile.displayName}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-3 text-muted text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.city}
                    </div>
                    {profile.experienceYears && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {profile.experienceYears} yıl deneyim
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(profile.createdAt)} tarihinden beri üye
                    </div>
                  </div>
                  {/* Rating */}
                  {totalReviews > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.round(avgRating)
                                ? "text-primary fill-primary"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{avgRating.toFixed(1)}</span>
                      <span className="text-muted">({totalReviews} değerlendirme)</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Skills */}
              {profile.skills.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Uzmanlık Alanları
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {getCategoryLabel(skill)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* About */}
              {profile.about && (
                <div>
                  <h3 className="font-semibold mb-2">Hakkında</h3>
                  <p className="text-muted whitespace-pre-wrap">{profile.about}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Değerlendirmeler ({totalReviews})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.reviews.length > 0 ? (
                <div className="space-y-4">
                  {profile.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <Link
                            href={`/firma/${review.company.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {review.company.companyName}
                          </Link>
                          {review.job && (
                            <span className="text-muted text-sm ml-2">
                              - {review.job.title}
                            </span>
                          )}
                        </div>
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
                <span className="text-muted">Ortalama Puan</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-primary fill-primary" />
                  <span className="font-semibold">
                    {totalReviews > 0 ? avgRating.toFixed(1) : "-"}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted">Değerlendirme</span>
                <span className="font-semibold">{totalReviews}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted">Verilen Teklif</span>
                <span className="font-semibold">{totalBids}</span>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          {profile.phone && (
            <Card>
              <CardHeader>
                <CardTitle>İletişim</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  <span className="text-muted">Telefon:</span>{" "}
                  <a
                    href={`tel:${profile.phone}`}
                    className="text-primary hover:underline"
                  >
                    {profile.phone}
                  </a>
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
