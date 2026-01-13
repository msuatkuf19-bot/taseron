import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 p-3">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Yetkisiz Erişim</CardTitle>
          <CardDescription>
            Bu sayfaya erişim yetkiniz bulunmamaktadır.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600 text-sm">
            Görüntülemeye çalıştığınız sayfa, hesabınızın yetki seviyesi ile erişilemez.
            Lütfen doğru hesap türüyle giriş yaptığınızdan emin olun.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full bg-[#F37021] hover:bg-[#D85F17]">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Ana Sayfaya Dön
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">
                Farklı Hesapla Giriş Yap
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
