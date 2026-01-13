import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminGetJobById } from "@/actions/jobs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Building2, MapPin, Calendar, DollarSign, Clock, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { AdminModerationActions } from "@/components/admin/admin-moderation-actions";
import { ApprovalStatusBadge } from "@/components/jobs/approval-status-badge";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default async function AdminIlanDetayPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const result = await adminGetJobById(params.id);

  if (result.error || !result.job) {
    redirect("/admin/ilan-onay");
  }

  const job = result.job;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/admin/ilan-onay">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Onay Kuyruğuna Dön
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Ana İçerik */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {getCategoryLabel(job.category)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(job.createdAt), "d MMMM yyyy", {
                        locale: tr,
                      })}
                    </span>
                  </CardDescription>
                </div>
                <ApprovalStatusBadge approvalStatus={job.approvalStatus} />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">İlan Açıklaması</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {job.description}
                </p>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-4">
                {(job.budgetMin || job.budgetMax) && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm font-medium">Bütçe</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {job.budgetMin && job.budgetMax
                        ? `${job.budgetMin.toLocaleString()} - ${job.budgetMax.toLocaleString()} ₺`
                        : job.budgetMin
                        ? `${job.budgetMin.toLocaleString()} ₺+`
                        : `${job.budgetMax.toLocaleString()} ₺'ye kadar`}
                    </p>
                  </div>
                )}

                {job.durationText && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Tahmini Süre</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {job.durationText}
                    </p>
                  </div>
                )}
              </div>

              {(job.contactPhone || job.contactEmail) && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg mb-3">
                      İletişim Bilgileri
                    </h3>
                    <div className="space-y-2">
                      {job.contactPhone && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="w-4 h-4" />
                          <span>{job.contactPhone}</span>
                        </div>
                      )}
                      {job.contactEmail && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Mail className="w-4 h-4" />
                          <span>{job.contactEmail}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Yan Panel - Gönderen Bilgileri ve Aksiyonlar */}
        <div className="space-y-6">
          {/* Gönderen Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gönderen Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">İsim</p>
                <p className="font-semibold flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {job.createdBy?.contractorProfile?.displayName ||
                    job.createdBy?.email}
                </p>
              </div>

              {job.createdBy?.contractorProfile && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Şehir</p>
                    <p className="font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {job.createdBy.contractorProfile.city}
                    </p>
                  </div>

                  {job.createdBy.contractorProfile.phone && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Telefon</p>
                        <p className="font-semibold flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {job.createdBy.contractorProfile.phone}
                        </p>
                      </div>
                    </>
                  )}

                  {job.createdBy.contractorProfile.experienceYears && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Deneyim</p>
                        <p className="font-semibold">
                          {job.createdBy.contractorProfile.experienceYears} yıl
                        </p>
                      </div>
                    </>
                  )}

                  {job.createdBy.contractorProfile.skills?.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Yetenekler</p>
                        <div className="flex flex-wrap gap-2">
                          {job.createdBy.contractorProfile.skills.map(
                            (skill: string) => (
                              <span
                                key={skill}
                                className="px-2 py-1 bg-gray-100 rounded text-sm"
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              <Separator />
              <div>
                <p className="text-sm text-gray-600 mb-1">E-posta</p>
                <p className="font-semibold text-sm break-all flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {job.createdBy?.email}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Onay/Red Aksiyonları */}
          {job.approvalStatus === "PENDING_APPROVAL" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">İşlem</CardTitle>
                <CardDescription>
                  İlanı onaylayın veya reddedin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminModerationActions jobId={job.id} />
              </CardContent>
            </Card>
          )}

          {/* Onay Kuralları */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">
                Onay Kriterleri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>✓ Açıklama net ve anlaşılır mı?</li>
                <li>✓ Kategori doğru seçilmiş mi?</li>
                <li>✓ Yasalara aykırı içerik var mı?</li>
                <li>✓ Spam veya yanıltıcı bilgi var mı?</li>
                <li>✓ İletişim bilgileri uygun mu?</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getCategoryLabel(category: string): string {
  const categories: Record<string, string> = {
    KABA_INSAAT: "Kaba İnşaat",
    INCE_INSAAT: "İnce İnşaat",
    ELEKTRIK: "Elektrik",
    TESISAT: "Tesisat",
    BOYA_BADANA: "Boya Badana",
    DEKORASYON: "Dekorasyon",
    IZOLASYON: "İzolasyon",
    CELIK_YAPI: "Çelik Yapı",
    PEYZAJ: "Peyzaj",
    RESTORASYON: "Restorasyon",
  };
  return categories[category] || category;
}
