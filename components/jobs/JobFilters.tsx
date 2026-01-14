"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState, useEffect } from "react";
import { getCategoryLabel } from "@/lib/utils";

const categories = [
  "KABA_INSAAT",
  "INCE_INSAAT",
  "ELEKTRIK",
  "TESISAT",
  "BOYA_BADANA",
  "DEKORASYON",
  "IZOLASYON",
  "CELIK_YAPI",
  "PEYZAJ",
  "RESTORASYON",
];

const sortOptions = [
  { value: "newest", label: "En Yeni" },
  { value: "oldest", label: "En Eski" },
  { value: "budget_high", label: "Bütçe (Yüksek)" },
  { value: "budget_low", label: "Bütçe (Düşük)" },
  { value: "most_viewed", label: "En Çok Görüntülenen" },
];

const cities = [
  "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya", "Gaziantep",
  "Şanlıurfa", "Mersin", "Kayseri", "Eskişehir", "Diyarbakır", "Samsun", "Denizli"
];

export function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = search || category || city || sortBy !== "newest";

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when filters change
    params.set("page", "1");

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setCity("");
    setSortBy("newest");
    router.push("?page=1", { scroll: false });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search, category, city, sortBy });
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <Input
            type="text"
            placeholder="İlan ara (başlık veya açıklama)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 bg-white border-gray-200 focus:border-primary-orange focus:ring-primary-orange"
          />
        </div>
        <Button 
          type="button"
          variant="outline" 
          size="lg"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2 border-gray-200 hover:border-primary-orange hover:text-primary-orange"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtrele
        </Button>
        <Button 
          type="submit"
          size="lg"
          className="px-8 bg-primary-orange hover:bg-primary-orange-dark"
        >
          Ara
        </Button>
      </form>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-gray-200">
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">
              Kategori
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-white border-gray-200 focus:border-primary-orange focus:ring-primary-orange">
                <SelectValue placeholder="Tüm Kategoriler" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tüm Kategoriler</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {getCategoryLabel(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">
              Şehir
            </label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="bg-white border-gray-200 focus:border-primary-orange focus:ring-primary-orange">
                <SelectValue placeholder="Tüm Şehirler" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tüm Şehirler</SelectItem>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">
              Sıralama
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-white border-gray-200 focus:border-primary-orange focus:ring-primary-orange">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-text-secondary">Aktif Filtreler:</span>
          {search && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearch("");
                updateFilters({ search: "", category, city, sortBy });
              }}
              className="gap-1 h-7 text-xs"
            >
              Arama: {search}
              <X className="h-3 w-3" />
            </Button>
          )}
          {category && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCategory("");
                updateFilters({ search, category: "", city, sortBy });
              }}
              className="gap-1 h-7 text-xs"
            >
              {getCategoryLabel(category)}
              <X className="h-3 w-3" />
            </Button>
          )}
          {city && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCity("");
                updateFilters({ search, category, city: "", sortBy });
              }}
              className="gap-1 h-7 text-xs"
            >
              {city}
              <X className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1 h-7 text-xs text-destructive hover:text-destructive"
          >
            Tümünü Temizle
          </Button>
        </div>
      )}
    </div>
  );
}
