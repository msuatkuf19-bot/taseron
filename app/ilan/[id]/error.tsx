"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <CardTitle>Bir Hata Oluştu</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            İlan yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={reset}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              Tekrar Dene
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => window.history.back()}>
              Geri Dön
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
