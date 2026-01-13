"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toggleUserStatus } from "@/actions/admin";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserStatusToggleProps {
  userId: string;
  isActive: boolean;
}

export function UserStatusToggle({ userId, isActive }: UserStatusToggleProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setLoading(true);
    try {
      const result = await toggleUserStatus(userId);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || "Bir hata oluştu");
      }
    } catch (error) {
      alert("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isActive ? "destructive" : "default"}
      size="sm"
      onClick={handleToggle}
      disabled={loading}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
      {isActive ? "Pasif Yap" : "Aktif Yap"}
    </Button>
  );
}
