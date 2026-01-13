"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { CITIES, CATEGORIES } from "@/lib/utils";

export function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");

  const applyFilters = () => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (city) params.set("city", city);
      if (category) params.set("category", category);
      router.push(`/ilanlar?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setSearch("");
    setCity("");
    setCategory("");
    startTransition(() => {
      router.push("/ilanlar");
    });
  };

  const hasFilters = search || city || category;

  return (
    <div className="bg-card p-4 rounded-lg border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            placeholder="İlan ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>

        <Select value={city} onValueChange={setCity}>
          <SelectTrigger>
            <SelectValue placeholder="Şehir seçin" />
          </SelectTrigger>
          <SelectContent>
            {CITIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Kategori seçin" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            onClick={applyFilters}
            className="flex-1"
            disabled={isPending}
          >
            {isPending ? "Aranıyor..." : "Ara"}
          </Button>
          {hasFilters && (
            <Button variant="outline" onClick={clearFilters} size="icon">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
