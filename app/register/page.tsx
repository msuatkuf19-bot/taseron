"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerUser } from "@/actions/auth";
import { CITIES } from "@/lib/utils";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") || "";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: defaultRole as "FIRMA" | "TASERON" | "",
    companyName: "",
    displayName: "",
    city: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.role) {
      setError("Lütfen hesap türü seçin");
      setLoading(false);
      return;
    }

    try {
      const result = await registerUser({
        email: formData.email,
        password: formData.password,
        role: formData.role,
        companyName: formData.companyName,
        displayName: formData.displayName,
        city: formData.city,
        phone: formData.phone,
      });

      if (result.error) {
        setError(result.error);
      } else {
        router.push("/login?registered=true");
      }
    } catch {
      setError("Kayıt sırasında bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Kayıt Ol</CardTitle>
          <CardDescription>
            Yeni bir hesap oluşturarak başlayın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="role">Hesap Türü</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value as "FIRMA" | "TASERON" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Hesap türü seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIRMA">Firma (İlan açmak için)</SelectItem>
                  <SelectItem value="TASERON">Taşeron (Teklif vermek için)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="En az 6 karakter"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                minLength={6}
              />
            </div>

            {formData.role === "FIRMA" && (
              <div className="space-y-2">
                <Label htmlFor="companyName">Firma Adı</Label>
                <Input
                  id="companyName"
                  placeholder="Firma adınız"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  required
                />
              </div>
            )}

            {formData.role === "TASERON" && (
              <div className="space-y-2">
                <Label htmlFor="displayName">Ad Soyad / Ünvan</Label>
                <Input
                  id="displayName"
                  placeholder="Adınız veya ünvanınız"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="city">Şehir</Label>
              <Select
                value={formData.city}
                onValueChange={(value) =>
                  setFormData({ ...formData, city: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Şehir seçin" />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon (Opsiyonel)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="05XX XXX XX XX"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted">Zaten hesabınız var mı? </span>
            <Link href="/login" className="text-primary hover:underline">
              Giriş yapın
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-200px)] flex items-center justify-center">Yükleniyor...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
