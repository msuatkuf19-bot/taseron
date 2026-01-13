import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { getAdminReviews } from "@/actions/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { AdminReviewActions } from "@/components/admin/admin-review-actions";

export default async function AdminReviewsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const { reviews, error } = await getAdminReviews();

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-muted hover:text-primary mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Admin Panel
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Yorum Yönetimi</h1>
        <p className="text-muted">{reviews?.length || 0} yorum bulundu</p>
      </div>

      {error ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Link
                        href={`/firma/${review.company.id}`}
                        className="font-medium hover:text-primary"
                      >
                        {review.company.companyName}
                      </Link>
                      <span className="text-muted">→</span>
                      <Link
                        href={`/taseron/${review.contractor.id}`}
                        className="font-medium hover:text-primary"
                      >
                        {review.contractor.displayName}
                      </Link>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
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
                      <span className="ml-2 text-sm text-muted">
                        ({review.rating}/5)
                      </span>
                    </div>

                    {review.comment && (
                      <p className="text-muted text-sm mb-2">{review.comment}</p>
                    )}

                    {review.job && (
                      <Link
                        href={`/ilan/${review.job.id}`}
                        className="text-xs text-muted hover:text-primary"
                      >
                        İlan: {review.job.title}
                      </Link>
                    )}

                    <p className="text-xs text-muted mt-2">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>

                  <AdminReviewActions reviewId={review.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted">Henüz yorum bulunmuyor.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
