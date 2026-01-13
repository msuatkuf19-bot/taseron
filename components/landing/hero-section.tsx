"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-dark-bg via-soft-dark to-dark-bg overflow-hidden pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F97316' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-primary-orange/10 border border-primary-orange/20 rounded-full px-4 py-2"
              >
                <span className="w-2 h-2 bg-success-green rounded-full animate-pulse"></span>
                <span className="text-sm text-white font-medium">
                  Türkiye'nin #1 İnşaat Platformu
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                İşinizi Doğru Taşeronla{" "}
                <span className="text-primary-orange">Hızlıca</span> Buluşturun
              </h1>

              <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
                Türkiye'nin en güvenilir inşaat marketplace platformu.
                Projeleriniz için doğru ustayı bulun, yeni iş fırsatlarını yakalayın.
              </p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/register?type=firma">
                <Button
                  size="lg"
                  className="bg-primary-orange hover:bg-primary-orange/90 text-white font-semibold px-8 py-6 text-base group shadow-2xl shadow-primary-orange/20 hover:shadow-primary-orange/40 transition-all hover:scale-105"
                >
                  🏢 Firma Olarak İlan Aç
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/register?type=taseron">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white font-semibold px-8 py-6 text-base backdrop-blur-sm transition-all hover:scale-105"
                >
                  🔨 Taşeron Olarak Teklif Ver
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-6 pt-8"
            >
              <div className="space-y-1">
                <div className="text-3xl font-bold text-primary-orange">500+</div>
                <div className="text-sm text-gray-400">Aktif İlan</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-primary-orange">2.5K+</div>
                <div className="text-sm text-gray-400">Kayıtlı Üye</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-primary-orange">98%</div>
                <div className="text-sm text-gray-400">Memnuniyet</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Floating Card 1 - İlan Listesi */}
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="bg-white rounded-2xl shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-primary">Aktif İlanlar</h3>
                <span className="bg-success-green/10 text-success-green text-xs font-semibold px-3 py-1 rounded-full">
                  Yeni
                </span>
              </div>

              {/* İlan Kartları */}
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-light-gray-bg rounded-xl p-4 space-y-2 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <h4 className="font-semibold text-text-primary text-sm">
                        {item === 1 && "Boya Badana İşi"}
                        {item === 2 && "Elektrik Tesisatı"}
                        {item === 3 && "Dış Cephe Isı Yalıtımı"}
                      </h4>
                      <p className="text-xs text-text-secondary">
                        {item === 1 && "İstanbul, Kadıköy"}
                        {item === 2 && "Ankara, Çankaya"}
                        {item === 3 && "İzmir, Karşıyaka"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-primary-orange font-bold text-sm">
                        {item === 1 && "12"}
                        {item === 2 && "8"}
                        {item === 3 && "15"}
                      </div>
                      <div className="text-xs text-text-secondary">Teklif</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-primary-orange/10 text-primary-orange px-2 py-1 rounded">
                      {item === 1 && "Boya"}
                      {item === 2 && "Elektrik"}
                      {item === 3 && "Isı Yalıtımı"}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {item === 1 && "2 gün önce"}
                      {item === 2 && "5 gün önce"}
                      {item === 3 && "1 hafta önce"}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Floating Card 2 - Teklif Popup */}
            <motion.div
              animate={{
                y: [0, 20, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute -right-8 top-1/4 bg-white rounded-2xl shadow-2xl p-5 w-64 border-2 border-primary-orange"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-primary-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">👷</span>
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-text-primary text-sm">Yeni Teklif!</h4>
                    <span className="w-2 h-2 bg-success-green rounded-full animate-pulse"></span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Ahmet Usta boya işiniz için teklif verdi
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-light-gray-bg h-2 rounded-full overflow-hidden">
                      <div className="bg-primary-orange h-full w-4/5 rounded-full"></div>
                    </div>
                    <span className="text-xs font-semibold text-primary-orange">4.8⭐</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 3 - Usta Profili */}
            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -left-12 bottom-16 bg-white rounded-2xl shadow-2xl p-4 w-56"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-orange to-warning-yellow rounded-full flex items-center justify-center text-white text-xl font-bold">
                  MK
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-text-primary text-sm">Mehmet Kaya</h4>
                  <p className="text-xs text-text-secondary">Elektrik Ustası</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-3 h-3 text-warning-yellow fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                    <span className="text-xs text-text-secondary ml-1">(127)</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
}
