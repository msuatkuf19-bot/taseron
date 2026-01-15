"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Star, Clock, Check, X } from "lucide-react";
import { updateBidStatus } from "@/actions/bids";
import { createReview } from "@/actions/reviews";
import { formatCurrency } from "@/lib/utils";

interface BidCardProps {
  bid: any;
  jobId: string;
  showReview?: boolean;
}

export function BidCard({ bid, jobId, showReview }: BidCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  // Get offerer info - firma that made the bid
  const offerer = bid.offerer;
  const companyProfile = offerer?.companyProfile;
  const displayName = companyProfile?.companyName || offerer?.email || "Firma";
  const city = companyProfile?.city || "";
  const phone = companyProfile?.phone;

  const handleStatusUpdate = async (status: "ACCEPTED" | "REJECTED") => {
    setLoading(true);
    try {
      await updateBidStatus(bid.id, status);
      router.refresh();
    } catch (error) {
      console.error("Update bid status error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      await createReview({
        reviewedId: bid.offererId,
        jobId: jobId,
        rating,
        comment: comment || undefined,
      });
      setReviewOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Create review error:", error);
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          {/* Offerer (Firma) Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {displayName.charAt(0)}
              </div>
              <div>
                <Link
                  href={`/firma/${companyProfile?.id || offerer?.id}`}
                  className="font-semibold hover:text-primary"
                >
                  {displayName}
                </Link>
                {city && (
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <MapPin className="h-3 w-3" />
                    <span>{city}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bid Details */}
            <div className="mt-3 p-3 bg-background rounded-lg">
              <p className="text-sm mb-2">{bid.message}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                {bid.proposedPrice && (
                  <div>
                    <span className="text-muted">Teklif: </span>
                    <span className="font-semibold text-primary">
                      {formatCurrency(bid.proposedPrice)}
                    </span>
                  </div>
                )}
                {bid.estimatedDuration && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted" />
                    <span>{bid.estimatedDuration}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact */}
            {phone && (
              <div className="flex items-center gap-2 mt-2 text-sm text-muted">
                <Phone className="h-4 w-4" />
                <a
                  href={`tel:${phone}`}
                  className="hover:text-primary"
                >
                  {phone}
                </a>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {bid.status === "PENDING" && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate("ACCEPTED")}
                  disabled={loading}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Kabul Et
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate("REJECTED")}
                  disabled={loading}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reddet
                </Button>
              </>
            )}

            {bid.status === "ACCEPTED" && showReview && (
              <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Star className="h-4 w-4 mr-1" />
                    Değerlendir
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Firmayı Değerlendir</DialogTitle>
                    <DialogDescription>
                      {displayName} için değerlendirmenizi paylaşın.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleReview} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Puan</Label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-8 w-8 ${
                                star <= rating
                                  ? "text-primary fill-primary"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="comment">Yorum (Opsiyonel)</Label>
                      <Textarea
                        id="comment"
                        placeholder="Deneyiminizi paylaşın..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setReviewOpen(false)}
                      >
                        İptal
                      </Button>
                      <Button type="submit" disabled={reviewLoading}>
                        {reviewLoading ? "Gönderiliyor..." : "Gönder"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}

            {bid.status !== "PENDING" && (
              <Badge
                variant={
                  bid.status === "ACCEPTED" ? "success" : "destructive"
                }
              >
                {bid.status === "ACCEPTED" ? "Kabul Edildi" : "Reddedildi"}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
